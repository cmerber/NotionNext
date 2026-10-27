import { fireEvent, render, screen } from '@testing-library/react'
import {
  LayoutBase,
  LayoutArchive,
  LayoutSlug,
  LayoutSearch
} from '@/themes/island'
import World from '@/themes/island/components/World'
import { getThemeSwitchMeta } from '@/conf/themeSwitch.manifest'
import { postHref } from '@/themes/island/places'

const mockPush = jest.fn(),
  mockOptions = []
const mockRouter = {
  asPath: '/archive?theme=island',
  query: { theme: 'island' },
  push: mockPush
}
jest.mock('next/router', () => ({ useRouter: () => mockRouter }))
jest.mock('@/lib/config', () => ({ siteConfig: (key, fallback) => fallback }))
jest.mock('@/lib/global', () => ({
  useGlobal: () => ({
    isDarkMode: false,
    toggleDarkMode: jest.fn(),
    onLoading: false
  })
}))
jest.mock('@/components/SmartLink', () => ({
  __esModule: true,
  default: ({ href, children, ...props }) => (
    <a href={typeof href === 'string' ? href : href.pathname} {...props}>
      {children}
    </a>
  )
}))
jest.mock('@/components/LazyImage', () => ({
  __esModule: true,
  default: () => null
}))
jest.mock('@/components/ThemeEntry', () => ({
  __esModule: true,
  default: () => null
}))
jest.mock('@/components/NotionPage', () => ({
  __esModule: true,
  default: () => <p>PRIVATE CONTENT</p>
}))
jest.mock('@/themes/island/style', () => ({ Style: () => null }))
jest.mock('@/themes/island/components/WorldCanvas', () => ({
  __esModule: true,
  default: ({ options }) => {
    mockOptions.push(options)
    return null
  }
}))
beforeEach(() => {
  jest.clearAllMocks()
  mockOptions.length = 0
})
test('both worlds are recommended independently and existing article slugs retain their route', () => {
  expect(getThemeSwitchMeta('orange').recommended).toBe(true)
  expect(getThemeSwitchMeta('island').recommended).toBe(true)
  expect(postHref({ slug: 'article/existing' })).toBe('/article/existing')
})
test('the mobile navigation exposes all four real content routes', () => {
  const { container } = render(
    <LayoutBase>
      <p>Page</p>
    </LayoutBase>
  )
  fireEvent.click(screen.getByRole('button', { name: '打开小岛导航' }))
  expect(container.querySelector('#island-navigation')).toHaveAttribute(
    'data-open',
    'true'
  )
  for (const href of ['/archive', '/tools', '/profile', '/about'])
    expect(container.querySelector(`nav a[href="${href}"]`)).toBeInTheDocument()
})
test('exploring destinations, zooming, pausing and returning change one scene state', () => {
  render(<World />)
  fireEvent.click(screen.getByRole('button', { name: '风声书屋 01' }))
  expect(mockOptions.at(-1).focus).toBe('library')
  expect(screen.getByRole('link', { name: '推门，读一页 ↗' })).toHaveAttribute(
    'href',
    '/archive'
  )
  fireEvent.click(screen.getByRole('button', { name: '放大小岛' }))
  expect(mockOptions.at(-1).zoom).toBe(1)
  fireEvent.click(screen.getByRole('button', { name: '暂停小岛动画' }))
  expect(mockOptions.at(-1).paused).toBe(true)
  fireEvent.click(screen.getByRole('button', { name: '回到全岛视角' }))
  expect(mockOptions.at(-1)).toMatchObject({ focus: '', zoom: 0, reset: 1 })
})
test('locked pages never render article content or the public about biography', () => {
  const validPassword = jest.fn(() => false)
  render(
    <LayoutSlug
      post={{ id: 'private', slug: 'about', title: 'Secret' }}
      lock
      validPassword={validPassword}
    />
  )
  expect(screen.queryByText('PRIVATE CONTENT')).not.toBeInTheDocument()
  expect(screen.queryByText('你好，我是成。')).not.toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('文章密码'), {
    target: { value: 'wrong' }
  })
  fireEvent.click(screen.getByRole('button', { name: '打开笔记' }))
  expect(validPassword).toHaveBeenCalledWith('wrong')
  expect(screen.getByRole('alert')).toHaveTextContent('密码不正确')
})
test('search preserves the preview and archives preserve existing article URLs', () => {
  const { unmount } = render(<LayoutSearch />)
  fireEvent.change(screen.getByLabelText('搜索文章与笔记'), {
    target: { value: '  设计  ' }
  })
  fireEvent.click(screen.getByRole('button', { name: '寻找 ↗' }))
  expect(mockPush).toHaveBeenCalledWith({
    pathname: '/search',
    query: { theme: 'island', s: '设计' }
  })
  unmount()
  render(
    <LayoutArchive
      archivePosts={{
        2026: [{ id: 'note', slug: 'article/one', title: 'Existing note' }]
      }}
    />
  )
  expect(screen.getByRole('link', { name: /Existing note/ })).toHaveAttribute(
    'href',
    '/article/one'
  )
})

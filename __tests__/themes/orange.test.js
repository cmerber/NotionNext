import { fireEvent, render, screen } from '@testing-library/react'
import Studio from '@/themes/orange/components/Studio'
import {
  LayoutBase,
  LayoutPostList,
  LayoutSearch,
  LayoutSlug,
  LayoutArchive,
  LayoutCategoryIndex,
  LayoutTagIndex
} from '@/themes/orange'
import { siteConfig } from '@/lib/config'

jest.mock('@/themes/orange/components/StudioCanvas', () => ({
  __esModule: true,
  default: () => null
}))

const mockPush = jest.fn()
const mockToggle = jest.fn()
const mockRouter = {
  asPath: '/category/design/page/2?theme=orange',
  query: { theme: 'orange' },
  push: mockPush
}
jest.mock('next/router', () => ({ useRouter: () => mockRouter }))
jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn((key, fallback) => fallback)
}))
jest.mock('@/lib/global', () => ({
  useGlobal: () => ({
    isDarkMode: false,
    toggleDarkMode: mockToggle,
    onLoading: false
  })
}))
jest.mock('@/components/SmartLink', () => ({
  __esModule: true,
  default: ({ href, children, ...props }) => (
    <a {...props} href={typeof href === 'string' ? href : href.pathname}>
      {children}
    </a>
  )
}))
jest.mock('@/components/NotionPage', () => ({
  __esModule: true,
  default: () => <div>文章正文</div>
}))
jest.mock('@/components/LazyImage', () => ({
  __esModule: true,
  default: () => <span>封面</span>
}))
jest.mock('@/themes/orange/style', () => ({ Style: () => null }))
jest.mock('@/themes/orange/immersiveStyle', () => ({
  ImmersiveStyle: () => null
}))
jest.mock('@/themes/orange/experienceStyle', () => ({
  ExperienceStyle: () => null
}))
jest.mock('@/themes/orange/islandStoryStyle', () => ({
  IslandStoryStyle: () => null
}))

const posts = Array.from({ length: 15 }, (_, id) => ({
  id: `post-${id}`,
  title: `笔记 ${id}`,
  slug: `note-${id}`,
  category: ['设计'],
  summary: '测试摘要'
}))
beforeEach(() => {
  sessionStorage.clear()
  jest.clearAllMocks()
  siteConfig.mockImplementation((key, fallback) => fallback)
})

test('the about destination shows the island introduction instead of the original template article', () => {
  render(<LayoutSlug post={{ id: 'about', slug: 'about', title: '关于' }} />)
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
    '关于我，也关于这座小岛'
  )
  expect(screen.getByText(/图片压缩、格式转换、子网计算/)).toBeInTheDocument()
  expect(screen.queryByText('文章正文')).not.toBeInTheDocument()
  expect(screen.getByRole('link', { name: /实用工具/ })).toHaveAttribute(
    'href',
    '/tools'
  )
})

test('all scene destinations remain accessible without a WebGL canvas', () => {
  siteConfig.mockImplementation((key, fallback) =>
    key === 'ORANGE_SCENE_ENABLE' ? false : fallback
  )
  render(<Studio posts={posts} />)
  fireEvent.click(screen.getAllByRole('button', { name: /造物工作台/ })[0])
  expect(screen.getByRole('link', { name: /打开工具箱/ })).toHaveAttribute(
    'href',
    '/tools'
  )
  fireEvent.click(screen.getAllByRole('button', { name: /冒险档案柜/ })[0])
  expect(screen.getByRole('link', { name: /查看冒险档案/ })).toHaveAttribute(
    'href',
    '/profile'
  )
  fireEvent.click(screen.getByRole('button', { name: '切换夜晚' }))
  expect(mockToggle).toHaveBeenCalledTimes(1)
})

test('simplified mode can be entered and left', () => {
  render(<Studio />)
  fireEvent.click(screen.getByRole('button', { name: /简洁模式/ }))
  expect(screen.getByText('一颗装满好奇心的小星球')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /3D 场景/ }))
  expect(screen.queryByText('一颗装满好奇心的小星球')).not.toBeInTheDocument()
})

test('weather selection persists with discoveries and can be changed while paused', () => {
  const { container, unmount } = render(<Studio />)
  const weather = screen.getByRole('combobox', { name: '切换小岛场景' })
  expect(weather).toHaveValue('sunny')
  expect(screen.getAllByRole('option')).toHaveLength(4)
  fireEvent.click(screen.getByRole('button', { name: '暂停动画' }))
  fireEvent.change(weather, { target: { value: 'snow' } })
  expect(container.querySelector('.orange-studio')).toHaveAttribute(
    'data-environment',
    'snow'
  )
  expect(screen.getByRole('button', { name: '运行动画' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '飘雪' })).toHaveAttribute(
    'aria-pressed',
    'true'
  )
  expect(
    JSON.parse(sessionStorage.getItem('orange-island-passport')).environment
  ).toBe('snow')
  unmount()
  render(<Studio />)
  expect(screen.getByRole('combobox')).toHaveValue('snow')
})

test('unknown saved weather falls back to sunny without discarding the passport', () => {
  sessionStorage.setItem(
    'orange-island-passport',
    JSON.stringify({
      environment: 'invalid',
      places: ['tools'],
      harvested: true
    })
  )
  render(<Studio />)
  expect(screen.getByRole('combobox')).toHaveValue('sunny')
  expect(screen.getByLabelText('已发现 1 个角落')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /再收一份/ })).toBeInTheDocument()
})

test('the host greets visitors and decorative motion is optional', () => {
  render(<Studio />)
  fireEvent.click(screen.getByRole('button', { name: /打个招呼/ }))
  expect(screen.getByRole('status')).toHaveTextContent('欢迎来到我的小小星球')
  const petals = screen.getByRole('button', { name: /花雨/ })
  expect(petals).toHaveAttribute('aria-pressed', 'true')
  fireEvent.click(petals)
  expect(petals).toHaveAttribute('aria-pressed', 'false')
})

test('Notion settings can disable decorative particles', () => {
  siteConfig.mockImplementation((key, fallback) =>
    key === 'ORANGE_AMBIENCE_ENABLE' ? false : fallback
  )
  render(<Studio />)
  expect(screen.queryByRole('button', { name: /花雨/ })).not.toBeInTheDocument()
})

test('discoveries collect once and a souvenir opens a real readable article', () => {
  const { unmount } = render(
    <Studio
      posts={[
        { id: 'open', title: '公开笔记', slug: 'open' },
        { id: 'private', title: '私密笔记', password: 'secret' }
      ]}
    />
  )
  const shelf = screen.getByRole('button', { name: /灵感书架/ })
  fireEvent.click(shelf)
  fireEvent.click(shelf)
  fireEvent.click(screen.getByRole('button', { name: '返回全景' }))
  expect(screen.getByLabelText('已发现 1 个角落')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /摘一颗橙子/ }))
  expect(screen.getByRole('link', { name: /送你一段灵感/ })).toHaveAttribute(
    'href',
    '/article/open'
  )
  expect(screen.queryByText('私密笔记')).not.toBeInTheDocument()
  unmount()
  render(<Studio posts={posts} />)
  expect(screen.getByLabelText('已发现 1 个角落')).toBeInTheDocument()
  expect(
    screen.getByRole('button', { name: /再收一份小惊喜/ })
  ).toBeInTheDocument()
})

test('paginated collections use the current collection path', () => {
  render(<LayoutPostList posts={posts.slice(0, 3)} page={2} postCount={30} />)
  expect(screen.getByRole('link', { name: /上一页/ })).toHaveAttribute(
    'href',
    '/category/design/'
  )
  expect(screen.getByRole('link', { name: /下一页/ })).toHaveAttribute(
    'href',
    '/category/design/page/3'
  )
})

test('scroll lists expose remaining posts with the load more button', () => {
  siteConfig.mockImplementation((key, fallback) =>
    key === 'POST_LIST_STYLE' ? 'scroll' : fallback
  )
  render(<LayoutPostList posts={posts} />)
  expect(
    screen.queryByRole('heading', { name: '笔记 14' })
  ).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /再翻几篇/ }))
  expect(screen.getByRole('heading', { name: '笔记 14' })).toBeInTheDocument()
})

test('search preserves the theme preview and trims the query', () => {
  render(<LayoutSearch posts={[]} />)
  fireEvent.change(screen.getByRole('searchbox'), {
    target: { value: '  网页设计  ' }
  })
  fireEvent.click(screen.getByRole('button', { name: /搜索/ }))
  expect(mockPush).toHaveBeenCalledWith({
    pathname: '/search',
    query: { theme: 'orange', s: '网页设计' }
  })
})

test('locked articles do not render content and report incorrect passwords', () => {
  const validPassword = jest.fn(() => false)
  render(<LayoutSlug post={posts[0]} lock validPassword={validPassword} />)
  expect(screen.queryByText('文章正文')).not.toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('文章密码'), {
    target: { value: 'wrong' }
  })
  fireEvent.click(screen.getByRole('button', { name: '打开笔记' }))
  expect(validPassword).toHaveBeenCalledWith('wrong')
  expect(screen.getByRole('alert')).toHaveTextContent('密码不正确')
})

test('query search loads more results without linking to nonexistent query pages', () => {
  render(<LayoutSearch posts={posts} keyword='笔记' postCount={15} />)
  expect(
    screen.queryByRole('navigation', { name: '文章分页' })
  ).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /再翻几篇/ }))
  expect(screen.getByRole('heading', { name: '笔记 14' })).toBeInTheDocument()
})

test('custom submenus and extension slots are retained', () => {
  siteConfig.mockImplementation((key, fallback) =>
    key === 'CUSTOM_MENU' ? true : fallback
  )
  render(
    <LayoutBase
      siteInfo={{ title: '橙子星球' }}
      slotTop={<div>扩展槽</div>}
      customMenu={[
        {
          href: '/',
          name: '更多',
          subMenus: [{ href: '/category', title: '所有分类' }]
        }
      ]}
    >
      <div>内容</div>
    </LayoutBase>
  )
  expect(screen.getByText('扩展槽')).toBeInTheDocument()
  expect(screen.getByText('更多')).toBeInTheDocument()
  expect(screen.getByText('所有分类')).toHaveAttribute('href', '/category')
})

test('archives and collection indexes link to existing content', () => {
  const { rerender } = render(
    <LayoutArchive archivePosts={{ '2026-10': [posts[0]] }} />
  )
  expect(screen.getByRole('link', { name: /笔记 0/ })).toHaveAttribute(
    'href',
    '/article/note-0'
  )
  rerender(
    <LayoutCategoryIndex categoryOptions={[{ name: '网页技术', count: 2 }]} />
  )
  expect(screen.getByRole('link', { name: /网页技术/ })).toHaveAttribute(
    'href',
    '/category/%E7%BD%91%E9%A1%B5%E6%8A%80%E6%9C%AF'
  )
  rerender(<LayoutTagIndex tagOptions={[]} />)
  expect(screen.getByRole('heading', { name: '灵感标签' })).toBeInTheDocument()
})

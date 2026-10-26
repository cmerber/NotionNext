import { fireEvent, render, screen } from '@testing-library/react'
import ReadingRoom from '@/themes/orange/components/ReadingRoom'

jest.mock('next/dynamic', () => () => () => null)
jest.mock('@/components/SmartLink', () => ({
  __esModule: true,
  default: ({ href, children, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
}))
jest.mock('@/components/LazyImage', () => ({
  __esModule: true,
  default: () => null
}))
jest.mock('@/components/NotionPage', () => ({
  __esModule: true,
  default: () => (
    <div>
      <h2 id='first' className='notion-h'>
        第一个想法
      </h2>
      <p>这是保留的文章正文。</p>
      <h3 id='second' className='notion-h'>
        继续探索
      </h3>
    </div>
  )
}))
const post = {
  id: 'post',
  title: '真实的笔记',
  category: ['网页技术'],
  tagItems: [{ name: '设计' }]
}

test('a reading room retains content, builds working heading anchors and connects adjacent posts', () => {
  render(
    <ReadingRoom
      post={post}
      prev={{ id: 'previous', slug: 'previous', title: '前一篇' }}
      next={{ id: 'next', href: '/article/next', title: '后一篇' }}
    />
  )
  expect(screen.getByText('这是保留的文章正文。')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: '第一个想法' })).toHaveAttribute(
    'href',
    '#first'
  )
  expect(screen.getByRole('link', { name: '继续探索' })).toHaveAttribute(
    'href',
    '#second'
  )
  expect(screen.getByRole('link', { name: /前一篇/ })).toHaveAttribute(
    'href',
    '/article/previous'
  )
  expect(screen.getByRole('link', { name: /后一篇/ })).toHaveAttribute(
    'href',
    '/article/next'
  )
  expect(screen.getByRole('link', { name: '# 设计' })).toHaveAttribute(
    'href',
    '/tag/%E8%AE%BE%E8%AE%A1'
  )
  const width = screen.getByRole('button', { name: '舒展行宽' })
  fireEvent.click(width)
  expect(screen.getByRole('button', { name: '标准行宽' })).toHaveAttribute(
    'aria-pressed',
    'true'
  )
})

test('locked content never exposes text or heading titles through the reading navigation', () => {
  const valid = jest.fn(() => false)
  render(<ReadingRoom post={post} lock validPassword={valid} />)
  expect(screen.queryByText('这是保留的文章正文。')).not.toBeInTheDocument()
  expect(
    screen.queryByRole('navigation', { name: '文章目录' })
  ).not.toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('文章密码'), {
    target: { value: 'wrong' }
  })
  fireEvent.click(screen.getByRole('button', { name: '打开笔记' }))
  expect(valid).toHaveBeenCalledWith('wrong')
  expect(screen.getByRole('alert')).toHaveTextContent('密码不正确')
})

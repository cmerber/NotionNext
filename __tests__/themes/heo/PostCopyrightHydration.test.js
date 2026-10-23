import { act, render, screen } from '@testing-library/react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server.node'
import PostCopyright from '@/themes/heo/components/PostCopyright'

jest.mock('@/lib/config', () => ({
  siteConfig: key => ({ LINK: 'https://qcode.im', AUTHOR: '成', HEO_ARTICLE_COPYRIGHT: true })[key]
}))
jest.mock('@/lib/global', () => ({
  useGlobal: () => ({ locale: { COMMON: { AUTHOR: '作者', URL: '链接', COPYRIGHT: '版权', COPYRIGHT_NOTICE: '保留版权' } } })
}))
jest.mock('@/components/SmartLink', () => function Link({ href, children }) { return <a href={href}>{children}</a> })
jest.mock('@/components/NotByAI', () => () => null)

afterEach(() => window.history.replaceState({}, '', '/'))

test('a direct preview URL hydrates the canonical article link and text before applying browser parameters', async () => {
  window.history.replaceState({}, '', '/article/%E4%B8%80%E5%A4%A9?theme=orange')
  const view = <PostCopyright post={{ href: '/article/一天', slug: 'article/一天' }} />
  const container = document.createElement('div')
  container.innerHTML = renderToString(view)
  document.body.appendChild(container)
  const serverSection = container.firstChild
  const link = container.querySelector('li:nth-child(2) a')
  const canonical = 'https://qcode.im/article/%E4%B8%80%E5%A4%A9'
  expect(link.getAttribute('href')).toBe(canonical)
  expect(link.textContent).toBe(canonical)
  const onRecoverableError = jest.fn()
  const error = jest.spyOn(console, 'error')
  let root
  await act(async () => {
    root = hydrateRoot(container, view, { onRecoverableError })
    await Promise.resolve()
  })
  expect(container.firstChild).toBe(serverSection)
  expect(link.getAttribute('href')).toBe(window.location.href)
  expect(link.textContent).toBe(window.location.href)
  expect(onRecoverableError).not.toHaveBeenCalled()
  expect(error).not.toHaveBeenCalled()
  act(() => root.unmount())
  container.remove()
})

test('custom article copyright is retained', () => {
  render(<PostCopyright post={{ slug: 'article/example', copyright: '本站原创内容' }} />)
  expect(screen.getByText('本站原创内容')).toBeInTheDocument()
})

import { act, render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server.node'
import { hydrateRoot } from 'react-dom/client'
import SmartLink from '@/components/SmartLink'

jest.mock('@/lib/config', () => ({ siteConfig: () => 'https://qcode.im' }))
jest.mock('next/link', () => function MockLink({ href, children }) {
  const url = typeof href === 'string' ? href
    : `${href.pathname}?${new URLSearchParams(href.query).toString()}${href.hash || ''}`
  return <a href={url}>{children}</a>
})

afterEach(() => window.history.replaceState({}, '', '/'))

test('URL preview parameters never change the first hydrated href', async () => {
  window.history.replaceState({}, '', '/?theme=orange&mode=dark')
  const view = <SmartLink href='/archive#2026'>文章</SmartLink>
  const container = document.createElement('div')
  container.innerHTML = renderToString(view)
  document.body.appendChild(container)
  const anchor = container.firstChild
  expect(anchor.getAttribute('href')).toBe('/archive#2026')
  const onRecoverableError = jest.fn()
  const consoleError = jest.spyOn(console, 'error')
  let root
  await act(async () => {
    root = hydrateRoot(container, view, { onRecoverableError })
    await Promise.resolve()
  })
  expect(container.firstChild).toBe(anchor)
  expect(anchor.getAttribute('href')).toBe('/archive?theme=orange&mode=dark#2026')
  expect(onRecoverableError).not.toHaveBeenCalled()
  expect(consoleError).not.toHaveBeenCalled()
  act(() => root.unmount())
  container.remove()
})

test('client navigation retains explicit query values and leaves external links alone', () => {
  window.history.replaceState({}, '', '/?theme=orange&mode=dark')
  render(<>
    <SmartLink href={{ pathname: '/archive', query: { theme: 'heo' }, hash: '#2026' }}>归档</SmartLink>
    <SmartLink href='https://example.com/'>外部网站</SmartLink>
  </>)
  expect(screen.getByRole('link', { name: '归档' }))
    .toHaveAttribute('href', '/archive?theme=heo&mode=dark#2026')
  expect(screen.getByRole('link', { name: '外部网站' }))
    .toHaveAttribute('href', 'https://example.com/')
})

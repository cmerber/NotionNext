import { act, render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server.node'
import { hydrateRoot } from 'react-dom/client'
import { renderThemeModule } from '@/themes/renderThemeModule'

test('a preloaded theme hydrates its server article markup without replacing it', async () => {
  const Theme = renderThemeModule({
    LayoutSlug: ({ title }) => <article><h1>{title}</h1></article>
  })
  const view = <Theme __layoutName='LayoutSlug' title='原有文章' />
  const container = document.createElement('div')
  container.innerHTML = renderToString(view)
  document.body.appendChild(container)
  const serverArticle = container.firstChild
  const onRecoverableError = jest.fn()
  let root
  await act(async () => {
    root = hydrateRoot(container, view, { onRecoverableError })
    await Promise.resolve()
  })
  expect(onRecoverableError).not.toHaveBeenCalled()
  expect(container.firstChild).toBe(serverArticle)
  expect(container).toHaveTextContent('原有文章')
  act(() => root.unmount())
  container.remove()
})

test('named and default theme exports keep their own base layout and children', () => {
  const Base = ({ children }) => <main>{children}</main>
  const Named = renderThemeModule({ LayoutBase: Base })
  const Default = renderThemeModule({ default: Base })
  const view = render(<Named __layoutName='LayoutBase'>文章</Named>)
  expect(screen.getByRole('main')).toHaveTextContent('文章')
  view.rerender(<Default __layoutName='LayoutBase'>归档</Default>)
  expect(screen.getByRole('main')).toHaveTextContent('归档')
})

test('missing page layouts fall back to the theme article layout, then the site fallback', () => {
  const Theme = renderThemeModule({ default: { LayoutSlug: () => <p>文章布局</p> } })
  const Empty = renderThemeModule({})
  const Fallback = () => <p>站点默认布局</p>
  const view = render(<Theme __layoutName='Layout404' __fallback={Fallback} />)
  expect(screen.getByText('文章布局')).toBeInTheDocument()
  view.rerender(<Empty __layoutName='Layout404' __fallback={Fallback} />)
  expect(screen.getByText('站点默认布局')).toBeInTheDocument()
})

test('a missing base layout preserves children and never uses an article layout as its shell', () => {
  const Theme = renderThemeModule({ LayoutSlug: () => <p>文章布局</p> })
  render(<Theme __layoutName='LayoutBase'>公开文章</Theme>)
  expect(screen.getByText('公开文章')).toBeInTheDocument()
  expect(screen.queryByText('文章布局')).not.toBeInTheDocument()
})

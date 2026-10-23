import { act, render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server.node'
import { hydrateRoot } from 'react-dom/client'
import useThemeQuery from '@/hooks/useThemeQuery'

const mockRouter = { asPath: '/?theme=orange' }
jest.mock('next/router', () => ({ useRouter: () => mockRouter }))
jest.mock('@/lib/utils', () => ({
  getQueryParam: (path, key) => new URLSearchParams(path.split('?')[1]).get(key)
}))

test('static HTML hydrates before applying the theme preview', async () => {
  const renders = []
  function Probe() {
    const theme = useThemeQuery()
    renders.push(theme)
    return <p data-testid='theme'>{theme}</p>
  }
  mockRouter.asPath = '/?theme=orange'
  const container = document.createElement('div')
  container.innerHTML = renderToString(<Probe />)
  document.body.appendChild(container)
  const serverNode = container.firstChild
  const onRecoverableError = jest.fn()
  let root
  await act(async () => {
    root = hydrateRoot(container, <Probe />, { onRecoverableError })
    await Promise.resolve()
  })
  expect(renders[0]).toBe('')
  expect(renders[1]).toBe('')
  expect(onRecoverableError).not.toHaveBeenCalled()
  expect(container.firstChild).toBe(serverNode)
  expect(screen.getByTestId('theme')).toHaveTextContent('orange')
  act(() => root.unmount())
  container.remove()
})

test('removing the preview parameter returns control to the configured theme', () => {
  function Probe() {
    return <p data-testid='theme'>{useThemeQuery()}</p>
  }
  mockRouter.asPath = '/?theme=orange'
  const view = render(<Probe />)
  expect(screen.getByTestId('theme')).toHaveTextContent('orange')
  mockRouter.asPath = '/'
  view.rerender(<Probe />)
  expect(screen.getByTestId('theme')).toBeEmptyDOMElement()
})

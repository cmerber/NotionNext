import { render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server.node'
import useThemeQuery from '@/hooks/useThemeQuery'

const mockRouter = { asPath: '/?theme=orange' }
jest.mock('next/router', () => ({ useRouter: () => mockRouter }))
jest.mock('@/lib/utils', () => ({
  getQueryParam: (path, key) => new URLSearchParams(path.split('?')[1]).get(key)
}))

test('static HTML and the first client render agree before applying the theme preview', () => {
  const renders = []
  function Probe() {
    const theme = useThemeQuery()
    renders.push(theme)
    return <p data-testid='theme'>{theme}</p>
  }
  mockRouter.asPath = '/?theme=orange'
  renderToString(<Probe />)
  render(<Probe />)
  expect(renders[0]).toBe('')
  expect(renders[1]).toBe('')
  expect(screen.getByTestId('theme')).toHaveTextContent('orange')
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

import { act, fireEvent, render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server.node'
import SceneArrival from '@/themes/orange/components/SceneArrival'

jest.mock('@/themes/orange/arrivalStyle', () => ({ ArrivalStyle: () => null }))

afterEach(() => jest.useRealTimers())

test('the server response already contains the lightweight arrival illustration and reading exit', () => {
  const html = renderToString(<SceneArrival />)
  expect(html).toContain('小岛正在醒来')
  expect(html).toContain('<svg')
  expect(html).toContain('href="#orange-notes"')
  expect(html).toContain('value="0"')
  expect(html).not.toContain('<canvas')
  expect(html).not.toContain('<img')
})

test('progress reflects real stages and never advances just because time passes', () => {
  jest.useFakeTimers()
  const { rerender } = render(<SceneArrival />)
  act(() => jest.advanceTimersByTime(8000))
  expect(screen.getByRole('progressbar')).toHaveAttribute('value', '0')
  expect(screen.getByRole('status')).toHaveTextContent('小岛正在醒来')
  rerender(<SceneArrival phase='building' />)
  expect(screen.getByRole('progressbar')).toHaveAttribute('value', '1')
  expect(screen.getByRole('progressbar')).toHaveAttribute(
    'aria-valuetext',
    '布置场景'
  )
  rerender(<SceneArrival ready phase='building' />)
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
  expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  act(() => jest.advanceTimersByTime(500))
  expect(screen.queryByText('欢迎来到我的小小星球。')).not.toBeInTheDocument()
})

test('visitors can dismiss a slow startup and read existing articles immediately', () => {
  render(<SceneArrival />)
  const exit = screen.getByRole('link', { name: '先读点文字' })
  expect(exit).toHaveAttribute('href', '#orange-notes')
  fireEvent.click(exit)
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
  expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
})

test('reduced motion removes the ready cover immediately', () => {
  const media = jest
    .spyOn(window, 'matchMedia')
    .mockReturnValue({ matches: true })
  try {
    const { rerender } = render(<SceneArrival />)
    expect(screen.getByRole('status')).toBeInTheDocument()
    rerender(<SceneArrival ready />)
    expect(screen.queryByText('欢迎来到我的小小星球。')).not.toBeInTheDocument()
  } finally {
    media.mockRestore()
  }
})

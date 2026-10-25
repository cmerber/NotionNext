import { act, fireEvent, render, screen } from '@testing-library/react'
import Studio from '@/themes/orange/components/Studio'

jest.mock('@/lib/config', () => ({ siteConfig: (key, fallback) => fallback }))
jest.mock('@/lib/global', () => ({
  useGlobal: () => ({ isDarkMode: false, toggleDarkMode: jest.fn() })
}))
jest.mock('@/components/SmartLink', () => ({
  __esModule: true,
  default: ({ href, children, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
}))
jest.mock(
  'next/dynamic',
  () => () =>
    function MockScene({
      onUnavailable,
      onReady,
      quality,
      interaction,
      focus
    }) {
      return (
        <div>
          <span data-testid='render-quality'>{quality}</span>
          <span data-testid='scene-selection'>
            {focus}:{interaction}
          </span>
          <button onClick={() => onUnavailable('context-lost')}>
            模拟图形连接丢失
          </button>
          <button onClick={() => onUnavailable('initialization')}>
            模拟不支持图形
          </button>
          <button onClick={onReady}>模拟恢复完成</button>
        </div>
      )
    }
)

test('lost contexts automatically rebuild with a smaller GPU budget, with bounded retries', () => {
  render(<Studio />)
  expect(screen.getByTestId('render-quality')).toHaveTextContent('auto')
  for (let i = 0; i < 2; i++) {
    fireEvent.click(screen.getByRole('button', { name: '模拟图形连接丢失' }))
    expect(screen.getByTestId('render-quality')).toHaveTextContent('safe')
    expect(
      screen.queryByText('星球暂时走丢了，试着重新连接。')
    ).not.toBeInTheDocument()
  }
  fireEvent.click(screen.getByRole('button', { name: '模拟图形连接丢失' }))
  expect(screen.queryByTestId('render-quality')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: '重新开启 3D' }))
  expect(screen.getByTestId('render-quality')).toHaveTextContent('safe')
})

test('unsupported devices retain usable destinations without an automatic retry loop', () => {
  render(<Studio />)
  fireEvent.click(screen.getByRole('button', { name: '模拟不支持图形' }))
  fireEvent.click(screen.getByRole('button', { name: /灵感书架/ }))
  expect(screen.getByRole('link', { name: /翻开文章/ })).toHaveAttribute(
    'href',
    '/archive'
  )
  expect(screen.queryByTestId('render-quality')).not.toBeInTheDocument()
})

test('a healthy session renews recovery for a later background discard', () => {
  jest.useFakeTimers()
  try {
    render(<Studio />)
    for (let i = 0; i < 2; i++)
      fireEvent.click(screen.getByRole('button', { name: '模拟图形连接丢失' }))
    fireEvent.click(screen.getByRole('button', { name: '模拟恢复完成' }))
    act(() => jest.advanceTimersByTime(30000))
    fireEvent.click(screen.getByRole('button', { name: '模拟图形连接丢失' }))
    expect(screen.getByTestId('render-quality')).toHaveTextContent('safe')
  } finally {
    jest.useRealTimers()
  }
})

test('repeat selections retrigger feedback and keep their destination through recovery', () => {
  render(<Studio />)
  const journal = screen.getByRole('button', { name: /灵感书架/ })
  fireEvent.click(journal)
  expect(screen.getByTestId('scene-selection')).toHaveTextContent('journal:1')
  fireEvent.click(journal)
  expect(screen.getByTestId('scene-selection')).toHaveTextContent('journal:2')
  fireEvent.click(screen.getByRole('button', { name: '模拟图形连接丢失' }))
  expect(screen.getByTestId('scene-selection')).toHaveTextContent('journal:2')
  fireEvent.click(screen.getByRole('button', { name: '打个招呼' }))
  expect(screen.getByTestId('scene-selection')).toHaveTextContent('about:3')
  expect(screen.getByRole('button', { name: /橙子会客厅/ })).toHaveAttribute(
    'aria-pressed',
    'true'
  )
})

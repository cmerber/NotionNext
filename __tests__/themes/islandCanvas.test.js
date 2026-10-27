import { act, fireEvent, render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server.node'
import WorldCanvas from '@/themes/island/components/WorldCanvas'
import { createIsland } from '@/themes/island/scene/createIsland'

jest.mock('@/themes/island/scene/createIsland', () => ({
  createIsland: jest.fn()
}))
const props = {
  options: { focus: '', zoom: 0 },
  onSelect: jest.fn(),
  onInteract: jest.fn(),
  onPerformance: jest.fn()
}
let callbacks, api
const start = async () => {
  await act(async () => {
    await Promise.resolve()
  })
  await act(async () => {
    jest.advanceTimersByTime(25)
  })
}
beforeEach(() => {
  jest.useFakeTimers()
  jest.clearAllMocks()
  api = { update: jest.fn(), dispose: jest.fn() }
  createIsland.mockImplementation((host, options, cb) => {
    callbacks = cb
    return api
  })
})
afterEach(() => jest.useRealTimers())
test('the first server response presents the arrival cover, with no old Orange room', () => {
  const html = renderToString(<WorldCanvas {...props} />)
  expect(html).toContain('下一站，云间小岛')
  expect(html).not.toContain('island-map-links')
  expect(html).not.toContain('orange')
})
test('scene options update the existing renderer; a real frame dismisses the cover and unmount releases resources', async () => {
  const { container, rerender, unmount } = render(<WorldCanvas {...props} />)
  await start()
  expect(createIsland).toHaveBeenCalledTimes(1)
  act(() => callbacks.onReady())
  expect(container.querySelector('.island-canvas')).toHaveAttribute(
    'data-state',
    'ready'
  )
  rerender(
    <WorldCanvas
      {...props}
      options={{ focus: 'library', night: true, zoom: 2 }}
    />
  )
  expect(createIsland).toHaveBeenCalledTimes(1)
  expect(api.update).toHaveBeenLastCalledWith({
    focus: 'library',
    night: true,
    zoom: 2
  })
  unmount()
  expect(api.dispose).toHaveBeenCalledTimes(1)
})
test('a slow startup and a manual skip both release the scene and expose all four working destinations', async () => {
  const { unmount } = render(<WorldCanvas {...props} />)
  await start()
  act(() => jest.advanceTimersByTime(12001))
  expect(api.dispose).toHaveBeenCalledTimes(1)
  fireEvent.click(screen.getByRole('button', { name: '▤ 风声书屋' }))
  expect(props.onSelect).toHaveBeenCalledWith('library')
  unmount()
  render(<WorldCanvas {...props} />)
  await start()
  fireEvent.click(screen.getByRole('button', { name: '先看看小岛地图 ↗' }))
  expect(screen.getByLabelText('小岛探索地图')).toBeInTheDocument()
  act(() => callbacks.onReady())
  expect(screen.getByLabelText('小岛探索地图')).toBeInTheDocument()
})

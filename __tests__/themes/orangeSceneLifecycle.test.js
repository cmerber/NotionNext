import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import StudioCanvas from '@/themes/orange/components/StudioCanvas'
import { loadStudio } from '@/themes/orange/scene/loadStudio'
import { createStudio } from '@/themes/orange/scene/createStudio'

jest.mock('@/themes/orange/scene/createStudio', () => ({
  createStudio: jest.fn()
}))

jest.mock('@/themes/orange/scene/loadStudio', () => ({ loadStudio: jest.fn() }))
jest.mock('@/themes/orange/arrivalStyle', () => ({ ArrivalStyle: () => null }))
beforeEach(() => {
  jest.clearAllMocks()
  loadStudio.mockResolvedValue({ createStudio })
})

test('camera, lighting and all weather changes reuse the renderer, and leaving releases it', async () => {
  const instance = { update: jest.fn(), dispose: jest.fn() }
  const ready = jest.fn()
  createStudio.mockImplementation((host, options, callbacks) => {
    callbacks.onReady()
    return instance
  })
  const props = {
    night: false,
    view: 0,
    focus: '',
    interaction: 0,
    tour: true,
    paused: false,
    ambience: true,
    greeting: 0,
    onReady: ready
  }
  const { rerender, unmount } = render(<StudioCanvas {...props} />)
  await waitFor(() => expect(ready).toHaveBeenCalledTimes(1))
  rerender(<StudioCanvas {...props} night focus='journal' tour={false} />)
  expect(createStudio).toHaveBeenCalledTimes(1)
  expect(instance.update).toHaveBeenLastCalledWith(
    expect.objectContaining({ night: true, focus: 'journal', tour: false })
  )
  rerender(
    <StudioCanvas {...props} focus='journal' interaction={2} tour={false} />
  )
  expect(createStudio).toHaveBeenCalledTimes(1)
  expect(instance.update).toHaveBeenLastCalledWith(
    expect.objectContaining({ focus: 'journal', interaction: 2 })
  )
  for (const environment of ['rain', 'snow', 'desert', 'sunny']) {
    rerender(<StudioCanvas {...props} environment={environment} paused />)
    expect(instance.update).toHaveBeenLastCalledWith(
      expect.objectContaining({ environment, paused: true })
    )
  }
  expect(createStudio).toHaveBeenCalledTimes(1)
  unmount()
  expect(instance.dispose).toHaveBeenCalledTimes(1)
})

const sceneProps = {
  night: false,
  view: 0,
  tour: true,
  focus: '',
  interaction: 0,
  paused: false,
  ambience: true,
  greeting: 0,
  onReady: jest.fn(),
  onUnavailable: jest.fn()
}

test('the loader waits for a rendered frame and releases its cover without holding back readiness', async () => {
  const instance = { update: jest.fn(), dispose: jest.fn() }
  let complete
  createStudio.mockImplementation((host, options, callbacks) => {
    complete = callbacks.onReady
    return instance
  })
  const { container } = render(<StudioCanvas {...sceneProps} />)
  await waitFor(() => expect(createStudio).toHaveBeenCalledTimes(1))
  expect(screen.getByRole('progressbar')).toHaveAttribute('value', '1')
  expect(container.querySelector('.orange-canvas')).toHaveStyle({
    visibility: 'hidden'
  })
  act(() => complete())
  expect(sceneProps.onReady).toHaveBeenCalledTimes(1)
  expect(container.querySelector('.orange-canvas')).toHaveStyle({
    visibility: 'visible'
  })
  expect(container.querySelector('.orange-canvas').style.opacity).toBe('')
  expect(container.querySelector('.orange-scene-arrival')).toHaveAttribute(
    'data-ready',
    'true'
  )
})

test('leaving after the module arrives cancels deferred model construction', async () => {
  jest.useFakeTimers()
  const { unmount } = render(<StudioCanvas {...sceneProps} />)
  await act(async () => {
    await Promise.resolve()
  })
  expect(screen.getByRole('progressbar')).toHaveAttribute('value', '1')
  expect(createStudio).not.toHaveBeenCalled()
  unmount()
  act(() => jest.runOnlyPendingTimers())
  expect(createStudio).not.toHaveBeenCalled()
  jest.useRealTimers()
})

test('keyboard focus leaves the loading cover before it becomes hidden', async () => {
  let complete
  createStudio.mockImplementation((host, options, callbacks) => {
    complete = callbacks.onReady
    return { update: jest.fn(), dispose: jest.fn() }
  })
  render(
    <div className='orange-studio'>
      <button type='button' className='orange-environment-trigger'>
        切换小岛场景
      </button>
      <StudioCanvas {...sceneProps} />
    </div>
  )
  await waitFor(() => expect(createStudio).toHaveBeenCalledTimes(1))
  screen.getByRole('link', { name: '先读点文字' }).focus()
  act(() => complete())
  expect(screen.getByRole('button', { name: '切换小岛场景' })).toHaveFocus()
})

test('a rejected scene chunk keeps a local interactive scene and reports its actual stage', async () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
  const select = jest.fn()
  try {
    loadStudio.mockRejectedValue(new Error('chunk unavailable'))
    render(<StudioCanvas {...sceneProps} onSelect={select} />)
    expect(screen.getByRole('status')).toHaveTextContent('小岛正在醒来')
    expect(
      screen.queryByRole('button', { name: '轻量场景：灵感书架' })
    ).not.toBeInTheDocument()
    await waitFor(() =>
      expect(sceneProps.onUnavailable).toHaveBeenCalledWith('module-load')
    )
    fireEvent.click(screen.getByRole('button', { name: '轻量场景：灵感书架' }))
    expect(select).toHaveBeenCalledWith('journal')
    expect(createStudio).not.toHaveBeenCalled()
  } finally {
    warn.mockRestore()
  }
})

test('a stalled import times out and cannot create a renderer after leaving the scene', async () => {
  jest.useFakeTimers()
  let resolve
  loadStudio.mockReturnValue(
    new Promise(done => {
      resolve = done
    })
  )
  const { unmount } = render(<StudioCanvas {...sceneProps} />)
  expect(screen.getByRole('status')).toHaveTextContent('小岛正在醒来')
  expect(
    screen.queryByRole('button', { name: '轻量场景：向小主人打招呼' })
  ).not.toBeInTheDocument()
  await act(async () => {
    jest.advanceTimersByTime(10000)
    await Promise.resolve()
  })
  expect(sceneProps.onUnavailable).toHaveBeenCalledWith('startup-timeout')
  expect(
    screen.getByRole('button', { name: '轻量场景：向小主人打招呼' })
  ).toBeVisible()
  await act(async () => {
    resolve({ createStudio })
    await Promise.resolve()
  })
  expect(createStudio).not.toHaveBeenCalled()
  unmount()
  jest.useRealTimers()
})

test('a background tab receives a full startup window when it becomes visible', () => {
  jest.useFakeTimers()
  const hidden = jest.spyOn(document, 'hidden', 'get').mockReturnValue(true)
  loadStudio.mockReturnValue(new Promise(() => {}))
  try {
    const { unmount } = render(<StudioCanvas {...sceneProps} />)
    act(() => jest.advanceTimersByTime(30000))
    expect(sceneProps.onUnavailable).not.toHaveBeenCalled()
    hidden.mockReturnValue(false)
    fireEvent(document, new Event('visibilitychange'))
    act(() => jest.advanceTimersByTime(9999))
    expect(sceneProps.onUnavailable).not.toHaveBeenCalled()
    act(() => jest.advanceTimersByTime(1))
    expect(sceneProps.onUnavailable).toHaveBeenCalledWith('startup-timeout')
    unmount()
  } finally {
    hidden.mockRestore()
    jest.useRealTimers()
  }
})

test('an early scene setup exception does not leave a permanently hidden canvas', async () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
  try {
    createStudio.mockImplementation(() => {
      throw new Error('setup failed')
    })
    render(<StudioCanvas {...sceneProps} />)
    await waitFor(() =>
      expect(sceneProps.onUnavailable).toHaveBeenCalledWith('scene-init')
    )
    expect(
      screen.getByRole('button', { name: '轻量场景：向小主人打招呼' })
    ).toBeVisible()
  } finally {
    warn.mockRestore()
  }
})

test('compatibility mode never imports WebGL and retains the portrait greeting', () => {
  const greet = jest.fn(),
    select = jest.fn()
  render(
    <StudioCanvas
      {...sceneProps}
      rendererMode='compat'
      onGreet={greet}
      onSelect={select}
    />
  )
  expect(loadStudio).not.toHaveBeenCalled()
  expect(sceneProps.onReady).toHaveBeenCalled()
  fireEvent.click(
    screen.getByRole('button', { name: '轻量场景：向小主人打招呼' })
  )
  expect(greet).toHaveBeenCalledTimes(1)
  expect(select).toHaveBeenCalledWith('about')
})

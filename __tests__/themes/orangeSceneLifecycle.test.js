import { render, waitFor } from '@testing-library/react'
import StudioCanvas from '@/themes/orange/components/StudioCanvas'
import { createStudio } from '@/themes/orange/scene/createStudio'

jest.mock('@/themes/orange/scene/createStudio', () => ({
  createStudio: jest.fn()
}))

test('camera and lighting changes reuse the renderer, and leaving the scene releases it', async () => {
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
  unmount()
  expect(instance.dispose).toHaveBeenCalledTimes(1)
})

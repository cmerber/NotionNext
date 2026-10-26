import { fireEvent, render, screen } from '@testing-library/react'
import CompatScene from '@/themes/orange/components/CompatScene'
import { Draggable } from '@/components/Draggable'

const originalPointer = window.PointerEvent
const viewport = { width: 800, height: 600 }
beforeAll(() => {
  window.PointerEvent = class extends MouseEvent {
    constructor(type, options = {}) {
      super(type, options)
      Object.defineProperties(this, {
        pointerId: { value: options.pointerId ?? 1 },
        pointerType: { value: options.pointerType ?? 'mouse' },
        isPrimary: { value: options.isPrimary ?? true }
      })
    }
  }
  Object.defineProperty(document.documentElement, 'clientWidth', {
    configurable: true,
    get: () => viewport.width
  })
  Object.defineProperty(document.documentElement, 'clientHeight', {
    configurable: true,
    get: () => viewport.height
  })
})
afterAll(() => {
  window.PointerEvent = originalPointer
})
beforeEach(() => {
  viewport.width = 800
  viewport.height = 600
})

const point = (x, y, extra = {}) => ({
  clientX: x,
  clientY: y,
  pointerId: 1,
  button: 0,
  ...extra
})
function makeScene() {
  const select = jest.fn(),
    interact = jest.fn()
  render(<CompatScene view={0} tour onSelect={select} onInteract={interact} />)
  const root = screen.getByRole('group')
  const capture = jest.fn(),
    release = jest.fn()
  root.setPointerCapture = capture
  root.hasPointerCapture = jest.fn(() => true)
  root.releasePointerCapture = release
  return {
    root,
    capture,
    release,
    select,
    interact,
    object: screen.getByRole('button', { name: '轻量场景：灵感书架' })
  }
}

test('a deliberate room drag stops the tour, supports a wide orbit, and never opens the object on release', () => {
  const { root, object, select, interact, capture } = makeScene()
  fireEvent.pointerDown(object, point(100, 100))
  fireEvent.pointerMove(root, point(700, 120))
  expect(capture).toHaveBeenCalledWith(1)
  expect(root).toHaveAttribute('data-manual', 'true')
  expect(parseFloat(root.style.getPropertyValue('--yaw'))).toBeGreaterThan(100)
  expect(interact).toHaveBeenCalledTimes(1)
  fireEvent.pointerUp(root, point(1100, 200))
  expect(root).toHaveAttribute('data-dragging', 'false')
  fireEvent.click(object, { detail: 1 })
  expect(select).not.toHaveBeenCalled()
  fireEvent.pointerDown(object, point(100, 100))
  fireEvent.pointerUp(object, point(101, 100))
  fireEvent.click(object, { detail: 1 })
  expect(select).toHaveBeenCalledWith('journal')
})

test('vertical phone swipes remain scroll gestures and another pointer cannot hijack a drag', () => {
  const { root, object, interact } = makeScene()
  fireEvent.pointerDown(object, point(100, 100, { pointerType: 'touch' }))
  const move = new PointerEvent('pointermove', {
    ...point(104, 180, { pointerType: 'touch' }),
    bubbles: true,
    cancelable: true
  })
  fireEvent(root, move)
  expect(move.defaultPrevented).toBe(false)
  expect(interact).not.toHaveBeenCalled()
  fireEvent.pointerDown(object, point(100, 100))
  fireEvent.pointerMove(root, point(300, 100, { pointerId: 2 }))
  expect(interact).not.toHaveBeenCalled()
  fireEvent.pointerMove(root, point(150, 100))
  fireEvent.pointerCancel(root, point(150, 100, { pointerId: 2 }))
  expect(root).toHaveAttribute('data-dragging', 'true')
  fireEvent.lostPointerCapture(root, point(150, 100))
  expect(root).toHaveAttribute('data-dragging', 'false')
})

test('cancelled drags release capture, keyboard rotation remains usable and tilt stays bounded', () => {
  const { root, object, release } = makeScene()
  fireEvent.pointerDown(object, point(100, 100))
  fireEvent.pointerMove(root, point(130, -3000))
  expect(parseFloat(root.style.getPropertyValue('--tilt'))).toBe(72)
  fireEvent.blur(window)
  expect(root).toHaveAttribute('data-dragging', 'false')
  expect(release).toHaveBeenCalledWith(1)
  const yaw = parseFloat(root.style.getPropertyValue('--yaw'))
  fireEvent.keyDown(root, { key: 'ArrowRight' })
  expect(parseFloat(root.style.getPropertyValue('--yaw'))).toBe(yaw + 10)
})

function toolbar() {
  const click = jest.fn()
  render(
    <Draggable stick handleClassName='handle'>
      <div
        data-testid='toolbar'
        style={{ position: 'fixed', left: 24, top: 500 }}
      >
        <span className='handle' data-drag-handle tabIndex={0}>
          移动
        </span>
        <button onClick={click}>切换主题</button>
      </div>
    </Draggable>
  )
  const element = screen.getByTestId('toolbar')
  const root = element.parentElement
  let held = false
  const capture = jest.fn(() => {
    held = true
  })
  root.setPointerCapture = capture
  root.hasPointerCapture = () => held
  root.releasePointerCapture = () => {
    held = false
  }
  element.getBoundingClientRect = () => ({
    left: parseFloat(element.style.left),
    top: parseFloat(element.style.top),
    width: 160,
    height: 48
  })
  return {
    element,
    handle: screen.getByText('移动'),
    root,
    capture,
    click
  }
}

test('floating controls use viewport coordinates, stay within resized screens and preserve page scrolling', () => {
  const { element, handle, root, click, capture } = toolbar()
  const overflow = document.documentElement.style.overflow
  fireEvent.pointerDown(handle, point(34, 512))
  expect(capture).toHaveBeenCalledWith(1)
  // A fast vertical move can leave the narrow handle before its first move.
  fireEvent.pointerLeave(root, point(34, 490))
  fireEvent.pointerMove(root, point(550, 1000))
  fireEvent.pointerUp(root, point(550, 1000))
  expect(element).toHaveAttribute('data-positioned', 'true')
  expect(element.style.left).toBe('540px')
  expect(element.style.top).toBe('552px')
  expect(document.documentElement.style.overflow).toBe(overflow)
  // A new button tap must clear any suppressed click left by an outside release.
  fireEvent.pointerDown(screen.getByRole('button'), point(560, 565))
  fireEvent.click(screen.getByRole('button'), { detail: 1 })
  expect(click).toHaveBeenCalledTimes(1)
  viewport.width = 320
  viewport.height = 500
  fireEvent.resize(window)
  expect(element.style.left).toBe('160px')
  expect(element.style.top).toBe('452px')
  fireEvent.keyDown(handle, { key: 'ArrowLeft' })
  expect(element.style.left).toBe('148px')
})

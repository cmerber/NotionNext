import { useCallback, useEffect, useRef, useState } from 'react'
import usePointerDrag from '@/hooks/usePointerDrag'

export const Draggable = ({ children, stick, handleClassName }) => {
  const start = useRef(null)
  const [moving, setMoving] = useState(false)
  const place = useCallback((element, x, y) => {
    const bounds = element.getBoundingClientRect()
    const maxX = Math.max(
      0,
      document.documentElement.clientWidth - bounds.width
    )
    const maxY = Math.max(
      0,
      document.documentElement.clientHeight - bounds.height
    )
    element.dataset.positioned = 'true'
    Object.assign(element.style, {
      left: `${Math.max(0, Math.min(maxX, x))}px`,
      top: `${Math.max(0, Math.min(maxY, y))}px`,
      right: 'auto',
      bottom: 'auto'
    })
  }, [])
  const drag = usePointerDrag({
    captureOnDown: true,
    canStart: event =>
      !event.target.closest(
        'button, a, input, select, textarea, [contenteditable="true"]'
      ) &&
      (!handleClassName ||
        Boolean(event.target.closest(`.${handleClassName}`))),
    onStart() {
      const element = drag.ref.current?.firstElementChild
      if (!element) return
      const bounds = element.getBoundingClientRect()
      start.current = { element, x: bounds.left, y: bounds.top }
      setMoving(true)
    },
    onMove({ dx, dy }) {
      if (start.current)
        place(start.current.element, start.current.x + dx, start.current.y + dy)
    },
    onEnd() {
      if (start.current && (stick === 'left' || stick === 'right')) {
        const { element } = start.current
        const bounds = element.getBoundingClientRect()
        place(
          element,
          stick === 'left'
            ? 0
            : document.documentElement.clientWidth - bounds.width,
          bounds.top
        )
      }
      start.current = null
      setMoving(false)
    }
  })
  useEffect(() => {
    const element = drag.ref.current?.firstElementChild
    const resize = () => {
      if (
        !element ||
        element.dataset.positioned !== 'true' ||
        element.getAttribute('aria-hidden') === 'true'
      )
        return
      const bounds = element.getBoundingClientRect()
      place(element, bounds.left, bounds.top)
    }
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [drag.ref, place])
  return (
    <div
      {...drag}
      onKeyDown={event => {
        if (!event.target.closest('[data-drag-handle]')) return
        const directions = {
          ArrowLeft: [-12, 0],
          ArrowRight: [12, 0],
          ArrowUp: [0, -12],
          ArrowDown: [0, 12]
        }
        const delta = directions[event.key]
        const element = drag.ref.current?.firstElementChild
        if (!delta || !element) return
        event.preventDefault()
        const bounds = element.getBoundingClientRect()
        place(element, bounds.left + delta[0], bounds.top + delta[1])
      }}
      className={`draggable ${moving ? 'cursor-grabbing' : 'cursor-grab'} select-none`}
    >
      {children}
    </div>
  )
}

import { useCallback, useEffect, useRef } from 'react'

// Capture only deliberate drags: taps keep their original target and vertical
// touch swipes can remain ordinary page scrolling.
export default function usePointerDrag(options) {
  const ownRoot = useRef(null)
  const root = options.elementRef || ownRoot
  const gesture = useRef(null)
  const suppressClick = useRef(false)
  const callbacks = useRef(options)
  callbacks.current = options
  const finish = useCallback(
    cancelled => {
      const current = gesture.current
      gesture.current = null
      if (!current) return
      if (root.current) {
        root.current.dataset.dragging = 'false'
        if (root.current.hasPointerCapture?.(current.id))
          root.current.releasePointerCapture(current.id)
      }
      if (current.active) callbacks.current.onEnd?.({ cancelled })
    },
    [root]
  )
  useEffect(() => {
    const blur = () => finish(true)
    window.addEventListener('blur', blur)
    return () => {
      window.removeEventListener('blur', blur)
      gesture.current = null
    }
  }, [finish])
  return {
    ref: root,
    onPointerDown(event) {
      if (
        gesture.current ||
        event.isPrimary === false ||
        (event.pointerType !== 'touch' && event.button !== 0)
      )
        return
      suppressClick.current = false
      if (callbacks.current.canStart?.(event) === false) return
      gesture.current = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        touch: event.pointerType === 'touch',
        active: false
      }
      // Small drag handles can be crossed before the first move event. Capture
      // those immediately; full scenes still leave ordinary object taps intact.
      if (callbacks.current.captureOnDown) {
        try {
          root.current?.setPointerCapture?.(event.pointerId)
        } catch {
          /* Pointer was already cancelled. */
        }
      }
    },
    onPointerMove(event) {
      const current = gesture.current
      if (!current || event.pointerId !== current.id) return
      const dx = event.clientX - current.x,
        dy = event.clientY - current.y
      if (!current.active) {
        if (
          current.touch &&
          callbacks.current.horizontalTouch &&
          Math.abs(dy) > 8 &&
          Math.abs(dy) > Math.abs(dx)
        ) {
          gesture.current = null
          return
        }
        if (Math.hypot(dx, dy) < 6) return
        current.active = true
        suppressClick.current = true
        if (root.current) {
          root.current.dataset.dragging = 'true'
          try {
            root.current.setPointerCapture?.(current.id)
          } catch {
            /* Pointer was already cancelled. */
          }
        }
        callbacks.current.onStart?.()
      }
      event.preventDefault()
      callbacks.current.onMove?.({ dx, dy })
    },
    onPointerUp(event) {
      if (event.pointerId === gesture.current?.id) finish(false)
    },
    onPointerCancel(event) {
      if (event.pointerId === gesture.current?.id) finish(true)
    },
    onLostPointerCapture(event) {
      if (event.pointerId === gesture.current?.id) finish(true)
    },
    onPointerLeave() {
      const current = gesture.current
      if (
        current &&
        !current.active &&
        !root.current?.hasPointerCapture?.(current.id)
      )
        gesture.current = null
    },
    onClickCapture(event) {
      if (suppressClick.current && event.detail !== 0) {
        event.preventDefault()
        event.stopPropagation()
        suppressClick.current = false
      }
    }
  }
}

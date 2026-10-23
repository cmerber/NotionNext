import { useEffect, useRef } from 'react'

export default function StudioCanvas({
  night,
  view,
  paused,
  onSelect,
  onHover,
  onReady,
  onUnavailable
}) {
  const host = useRef(null)
  const api = useRef(null)
  const callbacks = useRef({ onSelect, onHover, onReady, onUnavailable })
  callbacks.current = { onSelect, onHover, onReady, onUnavailable }
  const options = useRef({ night, view, paused })
  options.current = { night, view, paused }

  useEffect(() => {
    let cancelled = false
    let dispose
    // The renderer stays in its own async chunk; article pages never initialize it.
    import('../scene/createStudio')
      .then(({ createStudio }) => {
        if (cancelled || !host.current) return
        const instance = createStudio(host.current, options.current, {
          onSelect: value => callbacks.current.onSelect(value),
          onHover: value => callbacks.current.onHover(value),
          onReady: () => callbacks.current.onReady(),
          onUnavailable: () => callbacks.current.onUnavailable()
        })
        api.current = instance
        dispose = () => instance.dispose()
      })
      .catch(() => {
        if (!cancelled) callbacks.current.onUnavailable()
      })
    return () => {
      cancelled = true
      api.current = null
      dispose?.()
    }
  }, [])

  useEffect(() => {
    api.current?.update({ night, view, paused })
  }, [night, view, paused])

  return (
    <div
      ref={host}
      className='orange-canvas'
      role='img'
      aria-label='可旋转的微缩工作室，包含可点击的书架、电脑、档案柜和沙发。也可以使用下方按钮选择入口。'
    />
  )
}

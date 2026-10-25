import { useEffect, useRef } from 'react'

export default function StudioCanvas({
  night,
  view,
  focus,
  tour,
  paused,
  ambience,
  greeting,
  quality,
  onGreet,
  onSelect,
  onHover,
  onReady,
  onRecovering,
  onUnavailable
}) {
  const host = useRef(null)
  const api = useRef(null)
  const callbacks = useRef({
    onSelect,
    onHover,
    onReady,
    onRecovering,
    onUnavailable,
    onGreet
  })
  callbacks.current = {
    onSelect,
    onHover,
    onReady,
    onRecovering,
    onUnavailable,
    onGreet
  }
  const options = useRef({
    night,
    view,
    focus,
    tour,
    paused,
    ambience,
    greeting,
    quality
  })
  options.current = {
    night,
    view,
    focus,
    tour,
    paused,
    ambience,
    greeting,
    quality
  }

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
          onRecovering: () => callbacks.current.onRecovering?.(),
          onUnavailable: reason => callbacks.current.onUnavailable(reason),
          onGreet: () => callbacks.current.onGreet?.()
        })
        api.current = instance
        dispose = () => instance.dispose()
      })
      .catch(() => {
        if (!cancelled) callbacks.current.onUnavailable('initialization')
      })
    return () => {
      cancelled = true
      api.current = null
      dispose?.()
    }
  }, [])

  useEffect(() => {
    api.current?.update({
      night,
      view,
      focus,
      tour,
      paused,
      ambience,
      greeting
    })
  }, [night, view, focus, tour, paused, ambience, greeting])

  return (
    <div
      ref={host}
      className='orange-canvas'
      data-render-quality={quality || 'auto'}
      role='img'
      aria-label='可旋转的治愈系微缩工作室，有棕发黑色上衣的小主人、书架、电脑和档案柜。点击人物会挥手，也可以使用下方按钮选择入口。'
    />
  )
}

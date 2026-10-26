import { useEffect, useRef, useState } from 'react'
import CompatScene from './CompatScene'
import { loadStudio } from '../scene/loadStudio'

export default function StudioCanvas({
  rendererMode = 'auto',
  night,
  view,
  focus,
  interaction,
  tour,
  paused,
  ambience,
  greeting,
  harvested,
  quality,
  onInteract,
  onAction,
  onPerformance,
  onGreet,
  onSelect,
  onHover,
  onReady,
  onRecovering,
  onUnavailable
}) {
  const host = useRef(null)
  const [presented, setPresented] = useState(false)
  const api = useRef(null)
  const callbacks = useRef({
    onPerformance,
    onAction,
    onInteract,
    onSelect,
    onHover,
    onReady,
    onRecovering,
    onUnavailable,
    onGreet
  })
  callbacks.current = {
    onPerformance,
    onAction,
    onInteract,
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
    interaction,
    tour,
    paused,
    ambience,
    greeting,
    harvested,
    quality
  })
  options.current = {
    night,
    view,
    focus,
    interaction,
    tour,
    paused,
    ambience,
    greeting,
    harvested,
    quality
  }

  useEffect(() => {
    let cancelled = false
    let instance
    let ready = false
    if (rendererMode === 'compat') {
      callbacks.current.onReady?.()
      return
    }
    // A visible local scene is already present. Bound this async work so a
    // missing chunk or a stalled first GPU frame cannot leave an empty stage.
    const timer = setTimeout(() => {
      if (!cancelled && !ready) {
        cancelled = true
        instance?.dispose()
        instance = null
        api.current = null
        callbacks.current.onUnavailable('startup-timeout')
      }
    }, 10000)
    const fail = (reason, error) => {
      if (cancelled) return
      cancelled = true
      clearTimeout(timer)
      if (error) console.warn(`[Orange 3D] ${reason}`, error.message)
      callbacks.current.onUnavailable(reason)
    }
    loadStudio()
      .then(({ createStudio }) => {
        if (cancelled || !host.current) return
        try {
          instance = createStudio(host.current, options.current, {
            onPerformance: () => callbacks.current.onPerformance?.(),
            onAction: action => callbacks.current.onAction?.(action),
            onInteract: () => callbacks.current.onInteract?.(),
            onSelect: value => callbacks.current.onSelect?.(value),
            onHover: value => callbacks.current.onHover?.(value),
            onReady: () => {
              if (cancelled) return
              ready = true
              clearTimeout(timer)
              setPresented(true)
              callbacks.current.onReady?.()
            },
            onRecovering: () => callbacks.current.onRecovering?.(),
            onUnavailable: reason => fail(reason),
            onGreet: () => callbacks.current.onGreet?.()
          })
          api.current = instance
        } catch (error) {
          fail('scene-init', error)
        }
      })
      .catch(error => fail('module-load', error))
    return () => {
      cancelled = true
      clearTimeout(timer)
      api.current = null
      instance?.dispose()
    }
  }, [rendererMode])

  useEffect(() => {
    api.current?.update({
      night,
      view,
      focus,
      interaction,
      tour,
      paused,
      ambience,
      greeting,
      harvested,
      quality
    })
  }, [
    night,
    view,
    focus,
    interaction,
    tour,
    paused,
    ambience,
    greeting,
    harvested,
    quality
  ])

  return (
    <>
      {(rendererMode === 'compat' || !presented) && (
        <CompatScene
          focus={focus}
          view={view}
          tour={tour}
          paused={paused}
          greeting={greeting}
          interaction={interaction}
          ambience={ambience}
          onSelect={onSelect}
          onInteract={onInteract}
          onGreet={onGreet}
          onAction={onAction}
        />
      )}
      {rendererMode !== 'compat' && (
        <div
          ref={host}
          className='orange-canvas'
          style={{ visibility: presented ? 'visible' : 'hidden' }}
          data-render-quality={quality || 'auto'}
          data-renderer='webgl'
          role='img'
          aria-label='可旋转的治愈系微缩工作室，有棕发黑色上衣的小主人、书架、电脑和档案柜。点击人物会挥手，也可以使用下方按钮选择入口。'
        />
      )}
    </>
  )
}

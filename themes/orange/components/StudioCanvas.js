import { useEffect, useRef, useState } from 'react'
import CompatScene from './CompatScene'
import { loadStudio } from '../scene/loadStudio'
import SceneArrival from './SceneArrival'

export default function StudioCanvas({
  rendererMode = 'auto',
  night,
  environment = 'sunny',
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
  const [failed, setFailed] = useState(false)
  const [phase, setPhase] = useState('loading')
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
    environment,
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
    environment,
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
    let paint = 0
    let task = 0
    if (rendererMode === 'compat') {
      callbacks.current.onReady?.()
      return
    }
    // Show one quiet arrival screen while WebGL loads. Only mount the
    // compatibility world after a confirmed failure, never as a loading frame.
    let timer
    const timeout = () => {
      if (!cancelled && !ready) {
        cancelled = true
        cancelAnimationFrame(paint)
        clearTimeout(task)
        instance?.dispose()
        instance = null
        api.current = null
        setFailed(true)
        callbacks.current.onUnavailable('startup-timeout')
      }
    }
    // A background tab cannot paint the deferred construction frame. Give it
    // the normal startup window when it becomes visible instead of failing it.
    const armTimeout = () => {
      clearTimeout(timer)
      if (!cancelled && !ready && !document.hidden)
        timer = setTimeout(timeout, 10000)
    }
    armTimeout()
    document.addEventListener('visibilitychange', armTimeout)
    const fail = (reason, error) => {
      if (cancelled) return
      cancelled = true
      clearTimeout(timer)
      cancelAnimationFrame(paint)
      clearTimeout(task)
      instance?.dispose()
      instance = null
      api.current = null
      setFailed(true)
      if (error) console.warn(`[Orange 3D] ${reason}`, error.message)
      callbacks.current.onUnavailable(reason)
    }
    loadStudio()
      .then(({ createStudio }) => {
        if (cancelled || !host.current) return
        setPhase('building')
        // Let the loader paint its real next stage before model construction
        // occupies the main thread. This costs one frame, not a staged delay.
        paint = requestAnimationFrame(() => {
          task = setTimeout(() => {
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
                  const studio = host.current?.closest('.orange-studio')
                  const cover = studio?.querySelector('.orange-scene-arrival')
                  if (cover?.contains(document.activeElement))
                    studio
                      .querySelector('.orange-environment-trigger')
                      ?.focus({ preventScroll: true })
                  setPresented(true)
                  callbacks.current.onReady?.()
                },
                onRecovering: () => callbacks.current.onRecovering?.(),
                onUnavailable: reason => fail(reason),
                onGreet: () => callbacks.current.onGreet?.()
              })
              if (cancelled) instance?.dispose()
              else api.current = instance
            } catch (error) {
              fail('scene-init', error)
            }
          }, 0)
        })
      })
      .catch(error => fail('module-load', error))
    return () => {
      cancelled = true
      clearTimeout(timer)
      cancelAnimationFrame(paint)
      clearTimeout(task)
      document.removeEventListener('visibilitychange', armTimeout)
      api.current = null
      instance?.dispose()
    }
  }, [rendererMode])

  useEffect(() => {
    api.current?.update({
      night,
      environment,
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
    environment,
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
      {(rendererMode === 'compat' || failed) && (
        <CompatScene
          focus={focus}
          view={view}
          tour={tour}
          paused={paused}
          greeting={greeting}
          interaction={interaction}
          ambience={ambience}
          environment={environment}
          onSelect={onSelect}
          onInteract={onInteract}
          onGreet={onGreet}
          onAction={onAction}
        />
      )}
      {rendererMode !== 'compat' && !failed && (
        <SceneArrival ready={presented} phase={phase} />
      )}
      {rendererMode !== 'compat' && (
        <div
          ref={host}
          className='orange-canvas'
          style={{
            visibility: presented ? 'visible' : 'hidden'
          }}
          data-render-quality={quality || 'auto'}
          data-renderer='webgl'
          role='img'
          aria-label='可旋转的微缩小岛，主人能走到书架和电脑旁，室外有树木、小屋、行驶的汽车和散步的行人。点击人物会挥手，也可以使用下方按钮选择入口。'
        />
      )}
    </>
  )
}

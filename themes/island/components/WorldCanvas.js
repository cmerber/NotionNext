import { useEffect, useRef, useState } from 'react'
import { PLACES } from '../places'

export default function WorldCanvas({
  options,
  onSelect,
  onInteract,
  onPerformance,
  enabled = true
}) {
  const host = useRef(null)
  const api = useRef(null)
  const latest = useRef({ options, onSelect, onInteract, onPerformance })
  latest.current = { options, onSelect, onInteract, onPerformance }
  const [status, setStatus] = useState('loading')
  const [attempt, setAttempt] = useState(0)
  const [manualRetries, setManualRetries] = useState(0)
  const recoveries = useRef(0)
  const [skipped, setSkipped] = useState(false)
  const [phase, setPhase] = useState('正在寻找云间的小岛')
  useEffect(() => {
    if (!enabled || skipped) {
      setStatus('fallback')
      return
    }
    let cancelled = false,
      ready = false,
      instance,
      timer,
      healthyTimer,
      frame,
      task
    const fail = (reason = 'initialization') => {
      if (cancelled) return
      cancelled = true
      clearTimeout(timer)
      clearTimeout(healthyTimer)
      clearTimeout(task)
      cancelAnimationFrame(frame)
      instance?.dispose()
      instance = null
      api.current = null
      if (host.current) host.current.dataset.failure = reason
      if (
        ready &&
        ['context-lost', 'render'].includes(reason) &&
        recoveries.current < 2
      ) {
        recoveries.current++
        if (host.current)
          host.current.dataset.recoveries = String(recoveries.current)
        latest.current.onPerformance()
        setStatus('loading')
        setAttempt(v => v + 1)
        return
      }
      setStatus('fallback')
    }
    const arm = () => {
      clearTimeout(timer)
      if (!cancelled && !ready && !document.hidden)
        timer = setTimeout(() => fail('startup-timeout'), 12000)
    }
    setStatus('loading')
    setPhase('正在寻找云间的小岛')
    arm()
    document.addEventListener('visibilitychange', arm)
    import('../scene/createIsland')
      .then(({ createIsland }) => {
        if (cancelled) return
        setPhase('为房子点灯，等小动物回家')
        frame = requestAnimationFrame(() => {
          task = setTimeout(() => {
            if (cancelled || !host.current) return
            instance = createIsland(host.current, latest.current.options, {
              onSelect: id => latest.current.onSelect(id),
              onInteract: () => latest.current.onInteract(),
              onPerformance: () => latest.current.onPerformance(),
              onReady: () => {
                if (!cancelled) {
                  ready = true
                  clearTimeout(timer)
                  healthyTimer = setTimeout(() => {
                    recoveries.current = 0
                  }, 20000)
                  setStatus('ready')
                }
              },
              onUnavailable: fail
            })
            if (cancelled) instance.dispose()
            else api.current = instance
          }, 0)
        })
      })
      .catch(() => fail('module'))
    return () => {
      cancelled = true
      clearTimeout(timer)
      clearTimeout(healthyTimer)
      clearTimeout(task)
      cancelAnimationFrame(frame)
      document.removeEventListener('visibilitychange', arm)
      instance?.dispose()
      api.current = null
    }
  }, [attempt, enabled, skipped])
  useEffect(() => {
    api.current?.update(options)
  }, [options])
  return (
    <>
      <div
        className='island-canvas'
        ref={host}
        data-state={status}
        aria-label='可以拖动旋转的立体小岛'
      />
      {status === 'fallback' && (
        <div className='island-map' aria-label='小岛探索地图'>
          <svg
            viewBox='0 0 800 600'
            role='img'
            aria-label='云间小岛：书屋、工坊、观测站与居所'
          >
            <defs>
              <linearGradient id='island-rock' x2='0.4' y2='1'>
                <stop stopColor='#bfbea4' />
                <stop offset='1' stopColor='#73846e' />
              </linearGradient>
            </defs>
            <ellipse
              cx='405'
              cy='470'
              rx='260'
              ry='36'
              fill='#637968'
              opacity='.1'
            />
            <path
              d='M140 310L208 418 400 520 606 422 680 310Z'
              fill='url(#island-rock)'
            />
            <ellipse cx='410' cy='305' rx='275' ry='135' fill='#acbc8e' />
            <path
              d='M240 279Q425 210 540 356M285 370Q390 290 563 248'
              stroke='#dfd4b4'
              strokeWidth='24'
              fill='none'
            />
            {[
              [250, 235],
              [500, 205],
              [550, 335],
              [290, 345]
            ].map(([x, y], i) => (
              <g key={i} transform={`translate(${x} ${y})`}>
                <path d='M-39 15L0 38 42 15V-43L0-67-39-43Z' fill='#f5e7c6' />
                <path
                  d='M-49-39L0-82 50-39 0-13Z'
                  fill={i === 3 ? '#bd8862' : '#607f70'}
                />
                <rect
                  x='-5'
                  y='-4'
                  width='15'
                  height='30'
                  rx='2'
                  fill='#8c704e'
                />
              </g>
            ))}
            {[
              [170, 300],
              [630, 270],
              [420, 190],
              [405, 380]
            ].map(([x, y], i) => (
              <g key={i}>
                <path d={`M${x} ${y}v-43`} stroke='#85724c' strokeWidth='8' />
                <circle cx={x} cy={y - 52} r='28' fill='#728f63' />
                <circle cx={x + 17} cy={y - 65} r='20' fill='#95ab78' />
              </g>
            ))}
          </svg>
          <div className='island-map-links'>
            {PLACES.map(p => (
              <button type='button' key={p.id} onClick={() => onSelect(p.id)}>
                {p.icon} {p.title}
              </button>
            ))}
          </div>
          <p>当前为轻量探索地图，所有内容都可以打开。</p>
          {enabled && manualRetries < 2 && (
            <button
              type='button'
              className='island-text-link'
              onClick={() => {
                setSkipped(false)
                recoveries.current = 0
                setManualRetries(v => v + 1)
                setAttempt(v => v + 1)
              }}
            >
              重新开启立体世界 ↗
            </button>
          )}
        </div>
      )}
      <div
        className={`island-arrival ${status !== 'loading' ? 'island-arrived' : ''}`}
        aria-hidden={status !== 'loading'}
      >
        <span className='island-arrival-emblem' aria-hidden='true'>
          ⌂<i>✦</i>
        </span>
        <p className='island-eyebrow'>A SMALL WORLD, A SLOWER PACE</p>
        <h2>下一站，云间小岛。</h2>
        <p role='status'>{phase}</p>
        <span className='island-arrival-line'>
          <i />
        </span>
        <button
          tabIndex={status === 'loading' ? 0 : -1}
          type='button'
          onClick={() => setSkipped(true)}
        >
          先看看小岛地图 ↗
        </button>
      </div>
    </>
  )
}

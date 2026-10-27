import { useEffect, useState } from 'react'
import { ArrivalStyle } from '../arrivalStyle'

const STEPS = ['载入小岛', '布置场景', '点亮生活']

// This illustration is inline SVG: the arrival screen needs no extra download,
// WebGL context, or model before it can appear in the server-rendered page.
export default function SceneArrival({ ready = false, phase = 'loading' }) {
  const [dismissed, setDismissed] = useState(false)
  useEffect(() => {
    if (!ready) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDismissed(true)
      return
    }
    // Only the exit transition is timed. Readiness comes from the first actual
    // rendered frame, never from a pretend percentage or a minimum wait.
    const timer = setTimeout(() => setDismissed(true), 500)
    return () => clearTimeout(timer)
  }, [ready])
  if (dismissed) return null
  const step = ready ? 2 : phase === 'building' ? 1 : 0
  return (
    <div
      className='orange-scene-arrival'
      data-ready={ready}
      data-phase={phase}
      aria-hidden={ready}
      onTransitionEnd={event => {
        if (ready && event.target === event.currentTarget) setDismissed(true)
      }}
    >
      <ArrivalStyle />
      <div className='orange-arrival-brand' aria-hidden='true'>
        <span>🍊</span>
        <span>
          QCODE <i>/</i> 橙子星球
        </span>
      </div>
      <div className='orange-arrival-center'>
        <span className='orange-arrival-kicker'>
          A LITTLE WORLD IS WAKING UP
        </span>
        <div className='orange-arrival-drawing' aria-hidden='true'>
          <svg viewBox='0 0 400 270' fill='none'>
            <ellipse
              className='orange-arrival-orbit'
              cx='200'
              cy='167'
              rx='172'
              ry='50'
              transform='rotate(-12 200 167)'
            />
            <circle
              cx='335'
              cy='91'
              r='20'
              fill='var(--arrival-sun)'
              stroke='none'
            />
            <path
              d='M334 69q-4-10 8-12q2 11-8 12'
              fill='var(--arrival-leaf)'
              stroke='none'
            />
            <g className='orange-arrival-islet'>
              <path
                d='m88 168 103-46 119 49-108 51Z'
                fill='var(--arrival-ground)'
              />
              <path
                d='m88 168 114 54 108-51-19 35-87 38-92-40Z'
                fill='var(--arrival-stone)'
              />
              <path d='m88 168 114 54 108-51M202 222v22m-75-27 20-21m96 30 15-30' />
              <path
                d='m157 153 45-22 49 23v40l-48 22-46-23Z'
                fill='var(--arrival-house)'
              />
              <path
                d='m146 155 56-57 62 57-13 9-49-44-45 44Z'
                fill='var(--arrival-roof)'
              />
              <path d='m203 168 48-14m-49 14v48' />
              <path d='m216 177 19-9v18l-19 9Z' fill='var(--arrival-window)' />
              <path d='m171 169 16 8v25l-16-8Z' fill='var(--arrival-roof)' />
              <path d='M132 183v-39m-6 12 6 5 9-8' />
              <path
                d='M112 140q-2-15 13-19 1-15 15-12 17 3 13 18 15 11 2 21-8 7-21-1-18 7-22-7Z'
                fill='var(--arrival-leaf)'
              />
              <path d='m263 195 12-6 13 6-12 6Z' fill='var(--arrival-leaf)' />
              <path d='m141 199 16 7m-25-2 12 5m82-64 8-4' />
            </g>
            <path
              className='orange-arrival-cloud'
              d='M56 98q-12-1-10-9 2-9 13-7 2-13 14-11 10 0 12 11 13-2 14 7 2 9-12 9Z'
            />
            <path
              d='m289 47 2 6 6 2-6 2-2 6-2-6-6-2 6-2Zm-185 8 1 4 4 1-4 1-1 4-1-4-4-1 4-1Z'
              stroke='var(--arrival-accent)'
            />
          </svg>
        </div>
        <div role={ready ? undefined : 'status'} aria-live='polite'>
          <h2>{ready ? '欢迎来到我的小小星球。' : '小岛正在醒来…'}</h2>
          <p>{ready ? '这一刻，留给好奇心。' : '有一座小岛，正在为你亮灯。'}</p>
        </div>
        <div className='orange-arrival-progress'>
          <div className='orange-arrival-step-label'>
            <span>{STEPS[step]}</span>
            <span>
              0{step + 1} <i>/ 03</i>
            </span>
          </div>
          <progress
            max={2}
            value={step}
            aria-label='小岛入场准备步骤'
            aria-valuetext={STEPS[step]}
          />
          <ol aria-hidden='true'>
            {STEPS.map((label, index) => (
              <li key={label} data-active={index <= step}>
                <b>{index < step || ready ? '✓' : '·'}</b>
                {label}
              </li>
            ))}
          </ol>
        </div>
        <a
          className='orange-arrival-skip'
          href='#orange-notes'
          tabIndex={ready ? -1 : 0}
          onClick={() => setDismissed(true)}
        >
          先读点文字 <span aria-hidden='true'>↘</span>
        </a>
      </div>
      <span className='orange-arrival-foot' aria-hidden='true'>
        把每一次探索，都留在这里。
      </span>
    </div>
  )
}

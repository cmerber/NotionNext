import { useEffect, useId, useRef, useState } from 'react'
import { ENVIRONMENTS } from '../scene/environments'

function WeatherIcon({ mode }) {
  return (
    <svg
      viewBox='0 0 32 32'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.4'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      {mode === 'sunny' && (
        <>
          <circle cx='16' cy='16' r='6' />
          <path d='M16 3v3m0 20v3M3 16h3m20 0h3M7 7l2 2m14 14 2 2M7 25l2-2M23 9l2-2' />
        </>
      )}
      {mode === 'rain' && (
        <>
          <path d='M9 19a5 5 0 0 1-1-10 8 8 0 0 1 15-1 5.5 5.5 0 0 1 0 11H9Z' />
          <path d='m11 23-2 4m9-4-2 4m9-4-2 4' />
        </>
      )}
      {mode === 'snow' && (
        <>
          <path d='M16 3v26M5 9l22 14M5 23 27 9M12 6l4 4 4-4M12 26l4-4 4 4M6 14l5-1-1-5m16 10-5 1 1 5M6 18l5 1-1 5m16-10-5-1 1-5' />
        </>
      )}
      {mode === 'desert' && (
        <>
          <circle cx='22' cy='9' r='4' />
          <path d='M3 22q8-12 17-1t9 0M3 27q13-9 26-2M8 17V8m0 5-3-2V9m3 3 3-2V7' />
        </>
      )}
    </svg>
  )
}

export default function EnvironmentPicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const root = useRef(null),
    trigger = useRef(null),
    choices = useRef([])
  const panelId = useId()
  const index = Math.max(
    0,
    ENVIRONMENTS.findIndex(item => item.id === value)
  )
  const current = ENVIRONMENTS[index]
  useEffect(() => {
    if (!open) return
    choices.current[index]?.focus({ preventScroll: true })
    const outside = event => {
      if (!root.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [open, index])
  const close = () => {
    setOpen(false)
    trigger.current?.focus({ preventScroll: true })
  }
  return (
    <div
      className='orange-environment-control'
      ref={root}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
      onKeyDown={event => {
        if (event.key === 'Escape' && open) {
          event.preventDefault()
          event.stopPropagation()
          close()
        }
      }}
    >
      <button
        ref={trigger}
        type='button'
        className='orange-environment-trigger'
        aria-label={`切换小岛场景，当前${current.name}`}
        aria-haspopup='dialog'
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen(active => !active)}
        onKeyDown={event => {
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            setOpen(true)
          }
        }}
      >
        <WeatherIcon mode={current.id} />
        <span>{current.name}</span>
        <svg
          className='orange-environment-chevron'
          viewBox='0 0 16 16'
          fill='none'
          aria-hidden='true'
        >
          <path
            d='m4 6 4 4 4-4'
            stroke='currentColor'
            strokeWidth='1.2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </button>
      {open && (
        <button
          type='button'
          className='orange-environment-shade'
          aria-hidden='true'
          tabIndex={-1}
          onClick={close}
        />
      )}
      {open && (
        <div
          id={panelId}
          role='dialog'
          aria-label='选择小岛场景'
          className='orange-environment-panel'
        >
          <div className='orange-environment-heading'>
            <span>换一处风景</span>
            <button type='button' aria-label='关闭场景面板' onClick={close}>
              ×
            </button>
          </div>
          <div
            className='orange-environment-grid'
            role='radiogroup'
            aria-label='天气场景'
          >
            {ENVIRONMENTS.map((item, at) => (
              <button
                key={item.id}
                ref={node => {
                  choices.current[at] = node
                }}
                type='button'
                role='radio'
                aria-checked={value === item.id}
                tabIndex={index === at ? 0 : -1}
                data-weather={item.id}
                onClick={() => {
                  onChange(item.id)
                  close()
                }}
                onKeyDown={event => {
                  const offset = {
                    ArrowRight: 1,
                    ArrowLeft: -1,
                    ArrowDown: 2,
                    ArrowUp: -2
                  }[event.key]
                  if (
                    offset !== undefined ||
                    event.key === 'Home' ||
                    event.key === 'End'
                  ) {
                    event.preventDefault()
                    const next =
                      event.key === 'Home'
                        ? 0
                        : event.key === 'End'
                          ? ENVIRONMENTS.length - 1
                          : (at + offset + ENVIRONMENTS.length) %
                            ENVIRONMENTS.length
                    onChange(ENVIRONMENTS[next].id)
                    choices.current[next]?.focus({ preventScroll: true })
                  }
                }}
              >
                <span className='orange-weather-glyph'>
                  <WeatherIcon mode={item.id} />
                </span>
                <span>{item.name}</span>
                {value === item.id && (
                  <span className='orange-weather-check' aria-hidden='true'>
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
          <p className='orange-environment-caption' aria-live='polite'>
            {current.note}
          </p>
        </div>
      )}
    </div>
  )
}

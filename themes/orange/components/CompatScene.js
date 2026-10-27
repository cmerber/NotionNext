import { useCallback, useEffect, useRef } from 'react'
import usePointerDrag from '@/hooks/usePointerDrag'

const COLORS = ['#bbccb0', '#e6a466', '#efe2c7', '#7e9b84', '#d3b58a']

function Block({ x = 0, y = 0, z = 0, w, d, h, color, children }) {
  return (
    <span
      className='orange-compat-block'
      style={{
        left: x,
        top: y,
        width: w,
        height: d,
        '--h': `${h}px`,
        '--d': `${d}px`,
        '--block': color,
        transform: `translateZ(${z}px)`
      }}
    >
      <i className='compat-top'>{children}</i>
      <i className='compat-front' />
      <i className='compat-side' />
      <i className='compat-side-left' />
      <i className='compat-back' />
    </span>
  )
}

// A local CSS perspective scene stays interactive when WebGL is unavailable.
export default function CompatScene({
  focus,
  view = 0,
  tour,
  paused,
  greeting,
  interaction,
  ambience,
  environment = 'sunny',
  onSelect,
  onGreet,
  onAction,
  onInteract
}) {
  const root = useRef(null)
  const world = useRef(null)
  const angles = useRef({ yaw: -26, tilt: 58 })
  const start = useRef(null)
  const writeAngles = useCallback((yaw, tilt) => {
    angles.current = { yaw, tilt: Math.max(40, Math.min(72, tilt)) }
    root.current?.style.setProperty('--yaw', `${yaw}deg`)
    root.current?.style.setProperty('--tilt', `${angles.current.tilt}deg`)
  }, [])
  const freezeTour = () => {
    const transform = world.current && getComputedStyle(world.current).transform
    if (
      transform &&
      transform !== 'none' &&
      typeof DOMMatrixReadOnly !== 'undefined'
    ) {
      const matrix = new DOMMatrixReadOnly(transform)
      writeAngles(
        (Math.atan2(-matrix.m21, matrix.m11) * 180) / Math.PI,
        (Math.atan2(-matrix.m32, matrix.m33) * 180) / Math.PI
      )
    }
    root.current.dataset.manual = 'true'
    onInteract?.()
  }
  const drag = usePointerDrag({
    elementRef: root,
    horizontalTouch: true,
    onStart() {
      freezeTour()
      start.current = { ...angles.current }
    },
    onMove({ dx, dy }) {
      if (start.current)
        writeAngles(
          start.current.yaw + dx * 0.3,
          start.current.tilt - dy * 0.13
        )
    },
    onEnd() {
      start.current = null
    }
  })
  useEffect(() => {
    writeAngles([-26, -4, 24][view % 3], 58)
  }, [view, writeAngles])
  useEffect(() => {
    if (tour && root.current) root.current.dataset.manual = 'false'
  }, [tour])
  useEffect(() => {
    const resize = () => {
      const width = root.current?.clientWidth,
        height = root.current?.clientHeight
      if (!width || !height) return
      const fit =
        width < 760 ? width / 780 : Math.min(width / 1100, height / 800)
      root.current.style.setProperty(
        '--fit',
        String(Math.max(0.36, Math.min(3.3, fit)))
      )
    }
    resize()
    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize)
    if (root.current) observer?.observe(root.current)
    window.addEventListener('resize', resize)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [])
  const select = id => onSelect?.(id)
  return (
    <div
      {...drag}
      className='orange-compat'
      role='group'
      aria-label='互动场景，可拖动或使用方向键旋转'
      tabIndex={0}
      data-focus={focus || 'world'}
      data-still={Boolean(paused)}
      data-tour={Boolean(tour)}
      data-ambience={Boolean(ambience)}
      data-environment={environment}
      onKeyDown={event => {
        if (event.target !== event.currentTarget) return
        const steps = {
          ArrowLeft: [-10, 0],
          ArrowRight: [10, 0],
          ArrowUp: [0, -4],
          ArrowDown: [0, 4]
        }
        const delta = steps[event.key]
        if (!delta) return
        event.preventDefault()
        freezeTour()
        writeAngles(
          angles.current.yaw + delta[0],
          angles.current.tilt + delta[1]
        )
      }}
    >
      {(environment === 'rain' || environment === 'snow') && (
        <div className='compat-weather' aria-hidden='true'>
          {Array.from({ length: 20 }, (_, i) => (
            <i
              key={i}
              style={{
                left: `${(i * 37) % 100}%`,
                animationDelay: `${-i * 0.31}s`,
                animationDuration: `${environment === 'snow' ? 6 + (i % 4) : 0.9 + (i % 3) * 0.2}s`
              }}
            />
          ))}
        </div>
      )}
      <div className='compat-moon' aria-hidden='true' />
      <button
        className='compat-gift'
        type='button'
        aria-label='打开小岛信箱'
        onClick={() => onAction?.('orange')}
      >
        📮
      </button>
      <div className='compat-cloud compat-cloud-one' aria-hidden='true' />
      <div className='compat-cloud compat-cloud-two' aria-hidden='true' />
      <div className='compat-camera'>
        <div className='compat-world' ref={world}>
          <Block
            w={600}
            d={420}
            h={25}
            color={
              environment === 'snow'
                ? '#edf2ec'
                : environment === 'desert'
                  ? '#dcbb83'
                  : environment === 'rain'
                    ? '#8da99b'
                    : '#c8d2b8'
            }
          />
          <Block x={5} y={5} z={25} w={590} d={410} h={8} color='#f2e4cb' />
          {Array.from({ length: 10 }, (_, i) => (
            <Block
              key={i}
              x={30 + i * 55}
              y={12}
              z={34}
              w={1}
              d={390}
              h={1}
              color='#cfb697'
            />
          ))}
          <Block x={12} y={8} z={33} w={575} d={12} h={30} color='#cfbfa5' />
          <Block x={12} y={10} z={33} w={12} d={390} h={30} color='#c3b49a' />
          <Block x={20} y={12} z={33} w={8} d={8} h={220} color='#b68c65' />
          <Block x={570} y={12} z={33} w={8} d={8} h={220} color='#b68c65' />
          <Block x={20} y={12} z={253} w={558} d={8} h={8} color='#b68c65' />
          <button
            type='button'
            className='compat-item compat-shelf'
            aria-label='轻量场景：灵感书架'
            onClick={() => select('journal')}
          >
            <Block w={130} d={12} h={170} color='#aa7d58' />
            {[0, 65, 130].map((level, row) => (
              <span key={level} className='compat-row'>
                <Block y={0} z={level} w={130} d={48} h={7} color='#8c674d' />
                {Array.from({ length: 6 }, (_, i) => (
                  <Block
                    key={i}
                    x={8 + i * 19}
                    y={14}
                    z={level + 8}
                    w={14}
                    d={27}
                    h={36 + (i % 3) * 6}
                    color={COLORS[(i + row) % COLORS.length]}
                  />
                ))}
              </span>
            ))}
          </button>
          <button
            type='button'
            className='compat-item compat-desk'
            aria-label='轻量场景：造物工作台'
            onClick={() => select('tools')}
          >
            {[4, 184].map(x => (
              <Block key={x} x={x} y={4} w={9} d={73} h={100} color='#78927a' />
            ))}
            <Block z={100} w={200} d={90} h={9} color='#cfaa7e' />
            <Block x={50} y={15} z={110} w={12} d={12} h={28} color='#3e5049' />
            <span className='compat-screen'>
              hello, world<span>▰ ▰ ▰</span>
            </span>
            <Block x={26} y={55} z={110} w={85} d={23} h={4} color='#e6dfc7'>
              ⌘ · · · ·
            </Block>
            <Block
              x={160}
              y={47}
              z={110}
              w={18}
              d={18}
              h={25}
              color='#de9b57'
            />
          </button>
          <button
            type='button'
            className='compat-item compat-cabinet'
            aria-label='轻量场景：冒险档案柜'
            onClick={() => select('profile')}
          >
            <Block w={90} d={65} h={112} color='#7d997e' />
            {[0, 1, 2].map(i => (
              <span key={i} className={`compat-drawer compat-drawer-${i}`}>
                <Block
                  x={4}
                  y={62}
                  z={8 + i * 33}
                  w={82}
                  d={5}
                  h={29}
                  color='#bbccb0'
                />
                <Block
                  x={34}
                  y={69}
                  z={22 + i * 33}
                  w={25}
                  d={5}
                  h={4}
                  color='#c3a064'
                />
              </span>
            ))}
            <span className='compat-orange' />
          </button>
          <button
            type='button'
            className='compat-item compat-sofa'
            aria-label='轻量场景：橙子会客厅'
            onClick={() => select('about')}
          >
            <Block w={125} d={72} h={30} color='#74937b' />
            <Block y={0} z={30} w={125} d={12} h={45} color='#74937b' />
            <Block x={8} y={18} z={30} w={109} d={50} h={10} color='#b4c5a8' />
            <Block x={12} y={10} z={43} w={27} d={18} h={26} color='#dfb48e' />
          </button>
          <button
            type='button'
            className='compat-host'
            aria-label='轻量场景：向小主人打招呼'
            onClick={() => {
              onGreet?.()
              onSelect?.('about')
            }}
          >
            <span
              key={greeting}
              className={
                greeting ? 'compat-portrait compat-greeting' : 'compat-portrait'
              }
            >
              {/* Local reference asset: no image optimizer or third-party request. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src='/orange/avatar-reference.webp'
                alt='棕发黑衣的小主人'
                width='128'
                height='128'
              />
              <span className='compat-wave'>✦</span>
            </span>
            <span className='compat-host-shadow' />
          </button>
          <span
            key={interaction}
            className={`compat-response ${focus ? 'compat-response-active' : ''}`}
            aria-hidden='true'
          />
        </div>
      </div>
    </div>
  )
}

import { useRef, useState } from 'react'

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
    </span>
  )
}

// A small, local CSS perspective scene works even with WebGL disabled. It is
// also the initial view while the richer renderer's separate chunk is loading.
export default function CompatScene({
  focus,
  view = 0,
  tour,
  paused,
  greeting,
  interaction,
  ambience,
  onSelect,
  onGreet
}) {
  const [dragAngle, setDragAngle] = useState(0)
  const drag = useRef(null)
  const moved = useRef(false)
  const yaw = [-26, -4, 24][view % 3] + dragAngle
  const select = id => {
    if (!moved.current) onSelect?.(id)
  }
  return (
    <div
      className='orange-compat'
      data-focus={focus || 'world'}
      data-still={Boolean(paused)}
      data-tour={Boolean(tour)}
      data-ambience={Boolean(ambience)}
      onPointerDown={event => {
        drag.current = { x: event.clientX, angle: dragAngle }
        moved.current = false
      }}
      onPointerMove={event => {
        if (!drag.current) return
        const delta = event.clientX - drag.current.x
        if (Math.abs(delta) > 8) {
          moved.current = true
          setDragAngle(
            Math.max(-30, Math.min(30, drag.current.angle + delta * 0.12))
          )
        }
      }}
      onPointerUp={() => {
        drag.current = null
      }}
      onPointerCancel={() => {
        drag.current = null
      }}
      onPointerLeave={() => {
        drag.current = null
      }}
    >
      <div className='compat-moon' aria-hidden='true' />
      <div className='compat-cloud compat-cloud-one' aria-hidden='true' />
      <div className='compat-cloud compat-cloud-two' aria-hidden='true' />
      <div className='compat-camera'>
        <div className='compat-world' style={{ '--yaw': `${yaw}deg` }}>
          <Block w={600} d={420} h={25} color='#c8d2b8' />
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
              if (!moved.current) {
                onGreet?.()
                onSelect?.('about')
              }
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

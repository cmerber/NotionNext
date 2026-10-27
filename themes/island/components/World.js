import { useMemo, useState } from 'react'
import SmartLink from '@/components/SmartLink'
import { useGlobal } from '@/lib/global'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import { PLACES, postHref } from '../places'
import WorldCanvas from './WorldCanvas'

export default function World({ posts = [] }) {
  const { isDarkMode } = useGlobal()
  const [focus, setFocus] = useState('')
  const [paused, setPaused] = useState(false)
  const [tour, setTour] = useState(false)
  const [quality, setQuality] = useState('auto')
  const [zoom, setZoom] = useState(0)
  const [reset, setReset] = useState(0)
  const [visited, setVisited] = useState([])
  const ambience = siteConfig('ISLAND_AMBIENCE_ENABLE', true, CONFIG)
  const select = id => {
    setFocus(id)
    setZoom(0)
    setTour(false)
    setVisited(v => (v.includes(id) ? v : [...v, id]))
  }
  const options = useMemo(
    () => ({
      focus,
      paused,
      tour,
      quality,
      zoom,
      reset,
      night: Boolean(isDarkMode),
      ambience
    }),
    [focus, paused, tour, quality, zoom, reset, isDarkMode, ambience]
  )
  const place = PLACES.find(p => p.id === focus)
  return (
    <section className='island-explore' aria-label='云间小岛互动探索'>
      <WorldCanvas
        options={options}
        onSelect={select}
        onInteract={() => setTour(false)}
        onPerformance={() => setQuality('safe')}
        enabled={siteConfig('ISLAND_SCENE_ENABLE', true, CONFIG)}
      />
      <div className={`island-intro ${focus ? 'island-intro-away' : ''}`}>
        <p className='island-eyebrow'>
          <span className='island-live-dot' /> SOMEWHERE ABOVE THE CLOUDS
        </p>
        <h1>
          {String(siteConfig('ISLAND_TITLE', CONFIG.ISLAND_TITLE, CONFIG))
            .split(/(?<=，)/)
            .map((line, i) => (
              <span key={i}>{line}</span>
            ))}
        </h1>
        <p className='island-intro-deck'>
          把日常的微光，
          <br />
          收藏在一座小岛上。
        </p>
        <button
          type='button'
          className='island-explore-cta'
          onClick={() => {
            setTour(v => !v)
            setFocus('')
          }}
        >
          {tour ? '停下来，随意走走' : '环岛漫游'}{' '}
          <span aria-hidden='true'>↗</span>
        </button>
        <div className='island-passport'>
          <span>ISLAND PASSPORT</span>
          <div>
            {PLACES.map(p => (
              <button
                title={p.title}
                aria-label={`探索${p.title}`}
                aria-pressed={visited.includes(p.id)}
                key={p.id}
                onClick={() => select(p.id)}
              >
                {visited.includes(p.id) ? '✦' : p.number}
              </button>
            ))}
          </div>
          <small>
            {visited.filter(id => id !== 'animals').length} / 4 处风景，慢慢遇见
          </small>
        </div>
      </div>
      <div className='island-world-label' aria-hidden='true'>
        <span>云间小岛</span>
        <small>A PLACE TO BELONG</small>
        <i>27° N / ∞</i>
      </div>
      <div className='island-markers'>
        {PLACES.map(p => (
          <button
            key={p.id}
            type='button'
            data-place-marker={p.id}
            aria-label={`走近${p.title}`}
            onClick={() => select(p.id)}
          >
            <span>{p.number}</span>
            <strong>{p.title} ↗</strong>
          </button>
        ))}
      </div>
      <div className='island-controls' aria-label='小岛视角控制'>
        <button
          type='button'
          aria-label='放大小岛'
          disabled={zoom >= 4}
          onClick={() => setZoom(v => Math.min(4, v + 1))}
        >
          ＋
        </button>
        <button
          type='button'
          aria-label='缩小小岛'
          disabled={zoom <= -3}
          onClick={() => setZoom(v => Math.max(-3, v - 1))}
        >
          −
        </button>
        <span />
        <button
          type='button'
          aria-label='回到全岛视角'
          onClick={() => {
            setFocus('')
            setZoom(0)
            setReset(v => v + 1)
          }}
        >
          ↺
        </button>
        <button
          type='button'
          aria-label={paused ? '继续小岛动画' : '暂停小岛动画'}
          aria-pressed={paused}
          onClick={() => setPaused(v => !v)}
        >
          {paused ? '▷' : 'Ⅱ'}
        </button>
        <button
          type='button'
          aria-label='认识岛上的小动物'
          onClick={() => select('animals')}
        >
          ♧
        </button>
      </div>
      {focus && (
        <aside className='island-place-card' aria-live='polite' key={focus}>
          <button
            className='island-close'
            type='button'
            aria-label='关闭地点介绍'
            onClick={() => setFocus('')}
          >
            ×
          </button>
          <p className='island-eyebrow'>
            {place
              ? `${place.number} / ${place.label}`
              : '05 / LITTLE NEIGHBOURS'}
          </p>
          <h2>
            {place?.title || '今天也有好邻居。'}{' '}
            <span aria-hidden='true'>{place?.icon || '♧'}</span>
          </h2>
          <p>
            {place?.text ||
              '橘猫在果园巡游，小羊在草地散步，白鸟掠过屋顶。点击它们，打个招呼。'}
          </p>
          {place && (
            <SmartLink className='island-text-link' href={place.href}>
              {place.action} ↗
            </SmartLink>
          )}
          {focus === 'library' && (
            <div className='island-card-notes'>
              {posts
                .filter(p => !p.password)
                .slice(0, 2)
                .map(p => (
                  <SmartLink href={postHref(p)} key={p.id}>
                    {p.title}
                    <span>↗</span>
                  </SmartLink>
                ))}
            </div>
          )}
          {focus === 'animals' && (
            <button
              type='button'
              className='island-text-link'
              onClick={() => setFocus('')}
            >
              继续在岛上走走 ↗
            </button>
          )}
        </aside>
      )}
      <div className='island-dock-wrap'>
        <p>拖动旋转 · 点亮建筑 · 跟着小主人走走</p>
        <nav className='island-dock' aria-label='小岛地点'>
          {PLACES.map(p => (
            <button
              type='button'
              key={p.id}
              aria-pressed={focus === p.id}
              onClick={() => select(p.id)}
            >
              <span aria-hidden='true'>{p.icon}</span>
              <strong>{p.title}</strong>
              <small>{p.number}</small>
            </button>
          ))}
        </nav>
        <a href='#island-journal'>
          捎一封小岛来信 <span>↓</span>
        </a>
      </div>
    </section>
  )
}

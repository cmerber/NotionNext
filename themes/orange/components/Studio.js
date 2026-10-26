import { useCallback, useEffect, useRef, useState } from 'react'
import Scene from './StudioCanvas'
import SmartLink from '@/components/SmartLink'
import { useGlobal } from '@/lib/global'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

export const PLACES = [
  {
    id: 'journal',
    number: '01',
    title: '灵感书架',
    subtitle: '文章与学习笔记',
    description: '把学到的、想明白的，都慢慢放进这里。',
    href: '/archive',
    action: '翻开文章',
    icon: '▤'
  },
  {
    id: 'tools',
    number: '02',
    title: '造物工作台',
    subtitle: '达闻西实用工具箱',
    description: '让日常的麻烦事，变成顺手的小工具。',
    href: '/tools',
    action: '打开工具箱',
    icon: '⌘'
  },
  {
    id: 'profile',
    number: '03',
    title: '冒险档案柜',
    subtitle: '能力、等级与成长',
    description: '每一次行动，都在为下一次冒险积攒经验。',
    href: '/profile',
    action: '查看冒险档案',
    icon: '✧'
  },
  {
    id: 'about',
    number: '04',
    title: '橙子会客厅',
    subtitle: '认识这个星球的主人',
    description: '关于我，以及我正在探索的那些事。',
    href: '/about',
    action: '认识我',
    icon: '☕'
  }
]

export default function Studio({ posts = [] }) {
  const { isDarkMode, toggleDarkMode } = useGlobal()
  const [selected, setSelected] = useState('')
  const [interaction, setInteraction] = useState(0)
  const [view, setView] = useState(0)
  const [paused, setPaused] = useState(false)
  const [tour, setTour] = useState(true)
  const [flat, setFlat] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [quality, setQuality] = useState('auto')
  const [rendererMode, setRendererMode] = useState('auto')
  const [failureReason, setFailureReason] = useState('')
  const recoveries = useRef(0)
  const [sceneStatus, setSceneStatus] = useState('loading')
  const [hover, setHover] = useState('')
  const [greeting, setGreeting] = useState(0)
  const [greetingVisible, setGreetingVisible] = useState(false)
  const [ambience, setAmbience] = useState(true)
  const greet = useCallback(() => {
    setGreeting(value => value + 1)
    setGreetingVisible(true)
  }, [])
  useEffect(() => {
    if (!greetingVisible) return
    const timer = setTimeout(() => setGreetingVisible(false), 4500)
    return () => clearTimeout(timer)
  }, [greeting, greetingVisible])
  useEffect(() => {
    if (sceneStatus !== 'ready') return
    // Limit consecutive failures, allowing recovery again after a healthy
    // session when a phone later discards a background tab.
    const timer = setTimeout(() => {
      recoveries.current = 0
    }, 30000)
    return () => clearTimeout(timer)
  }, [sceneStatus, attempt])
  const fallback = useCallback(reason => {
    setFailureReason(reason)
    if (reason === 'context-lost' && recoveries.current < 2) {
      recoveries.current += 1
      setQuality('safe')
      setSceneStatus('recovering')
      setAttempt(value => value + 1)
    } else {
      setRendererMode('compat')
      setSceneStatus('ready')
    }
  }, [])
  const place = PLACES.find(item => item.id === selected)
  const sceneEnabled = siteConfig('ORANGE_SCENE_ENABLE', true, CONFIG)
  const ambienceEnabled = siteConfig('ORANGE_AMBIENCE_ENABLE', true, CONFIG)
  const showScene = sceneEnabled && !flat && sceneStatus !== 'unavailable'
  const title = String(siteConfig('ORANGE_TITLE', CONFIG.ORANGE_TITLE, CONFIG))
  const titleBreak = title.indexOf('，')
  const explore = id => {
    setSelected(id)
    setInteraction(value => value + 1)
    setTour(false)
  }
  const retry = () => {
    recoveries.current = 0
    setQuality('safe')
    setRendererMode('auto')
    setFailureReason('')
    setSceneStatus('loading')
    setFlat(false)
    setAttempt(value => value + 1)
  }
  return (
    <section
      className='orange-studio orange-immersive'
      aria-label='橙子星球交互工作室'
      data-scene-status={sceneStatus}
      data-scene-renderer={rendererMode}
      data-scene-failure={failureReason}
      data-focused={Boolean(selected)}
    >
      <div className='orange-world-sky' aria-hidden='true' />
      <div className='orange-stage'>
        {showScene ? (
          <Scene
            key={`${attempt}:${rendererMode}`}
            rendererMode={rendererMode}
            quality={quality}
            night={isDarkMode}
            view={view}
            focus={selected}
            interaction={interaction}
            tour={tour}
            paused={paused}
            ambience={ambience && ambienceEnabled}
            greeting={greeting}
            onGreet={greet}
            onInteract={() => setTour(false)}
            onSelect={explore}
            onHover={setHover}
            onReady={() => setSceneStatus('ready')}
            onRecovering={() => setSceneStatus('recovering')}
            onUnavailable={fallback}
          />
        ) : (
          <div className='orange-flat-scene'>
            <div className='orange-fallback-planet' aria-hidden='true'>
              <span>🍊</span>
            </div>
            <h2>一颗装满好奇心的小星球</h2>
            <p>
              {sceneStatus === 'unavailable'
                ? '星球暂时走丢了，试着重新连接。'
                : '选一个地方，开始探索。'}
            </p>
            {sceneEnabled && (
              <button type='button' className='orange-button' onClick={retry}>
                重新开启 3D
              </button>
            )}
          </div>
        )}
      </div>
      {rendererMode === 'compat' && showScene && (
        <button type='button' className='orange-compat-notice' onClick={retry}>
          轻量互动场景 · 尝试完整 3D ↗
        </button>
      )}
      {sceneStatus === 'recovering' && showScene && (
        <div className='orange-reconnecting' role='status'>
          正在重新连接星球…
        </div>
      )}
      <div className='orange-world-title'>
        <p>
          <span className='orange-live-dot' /> A LITTLE WORLD BY QCODE
        </p>
        <h1>
          {titleBreak >= 0 ? (
            <>
              {title.slice(0, titleBreak + 1)}
              <br />
              <em>{title.slice(titleBreak + 1)}</em>
            </>
          ) : (
            title
          )}
        </h1>
        <span className='orange-world-coordinate'>浮游于日常 · EST. 2026</span>
      </div>
      <div className='orange-world-index' aria-hidden='true'>
        橙子星球
        <br />
        <span>THE FLOATING STUDIO</span>
        <i>01 — ∞</i>
      </div>
      <div className='orange-world-tools' aria-label='场景控制'>
        <button
          type='button'
          onClick={toggleDarkMode}
          aria-label={isDarkMode ? '切换白天' : '切换夜晚'}
          title='切换昼夜'
        >
          {isDarkMode ? '☾' : '☀'}
        </button>
        {showScene && (
          <>
            <button
              type='button'
              onClick={() => {
                setSelected('')
                setTour(false)
                setView(value => value + 1)
              }}
              aria-label='切换视角'
              title='切换视角'
            >
              ↻
            </button>
            <button
              type='button'
              onClick={() => {
                setSelected('')
                setTour(value => !value)
              }}
              aria-label='环游星球'
              aria-pressed={tour}
              title='环游星球'
            >
              ◎
            </button>
            <button
              type='button'
              onClick={() => {
                explore('about')
                greet()
              }}
              aria-label='打个招呼'
              title='打个招呼'
            >
              ✌
            </button>
            {ambienceEnabled && (
              <button
                type='button'
                onClick={() => setAmbience(value => !value)}
                aria-label={isDarkMode ? '萤光' : '花雨'}
                aria-pressed={ambience}
                title='切换氛围'
              >
                ✧
              </button>
            )}
            <button
              type='button'
              onClick={() => setPaused(value => !value)}
              aria-label={paused ? '运行动画' : '暂停动画'}
              aria-pressed={paused}
              title={paused ? '运行动画' : '暂停动画'}
            >
              {paused ? '▷' : 'Ⅱ'}
            </button>
          </>
        )}
        {sceneEnabled && (
          <button
            type='button'
            onClick={() => {
              if (flat || sceneStatus === 'unavailable') retry()
              else setFlat(true)
            }}
            aria-label={
              flat || sceneStatus === 'unavailable' ? '3D 场景' : '简洁模式'
            }
            title='切换场景模式'
          >
            {flat ? '◇' : '▦'}
          </button>
        )}
      </div>
      <div
        className='orange-welcome-bubble'
        role='status'
        aria-live='polite'
        hidden={!greetingVisible}
      >
        嗨，欢迎来到我的小小星球。
        <br />
        <span>今天也要给自己一点温柔 🍊</span>
      </div>
      {place && (
        <aside
          key={interaction}
          className='orange-focus-card'
          aria-live='polite'
        >
          <button
            className='orange-focus-close'
            type='button'
            aria-label='返回全景'
            onClick={() => {
              setSelected('')
              setTour(true)
            }}
          >
            ×
          </button>
          <span className='orange-eyebrow'>{place.number} / DISCOVER</span>
          <h2>
            {place.title} <span>{place.icon}</span>
          </h2>
          <SmartLink className='orange-text-link' href={place.href}>
            {place.action} ↗
          </SmartLink>
          {selected === 'journal' && posts[0] && (
            <SmartLink
              className='orange-focus-latest'
              href={posts[0].href || `/article/${posts[0].slug || posts[0].id}`}
            >
              最新 · {posts[0].title}
            </SmartLink>
          )}
        </aside>
      )}
      <div className='orange-world-bottom'>
        <div className='orange-scene-caption' aria-live='polite'>
          {hover
            ? `${PLACES.find(item => item.id === hover)?.title || ''} · 点击靠近`
            : '拖动旋转 · 点选探索'}
        </div>
        <nav className='orange-place-nav' aria-label='工作室探索入口'>
          {PLACES.map(item => (
            <button
              key={item.id}
              type='button'
              aria-pressed={selected === item.id}
              onClick={() => explore(item.id)}
            >
              <span className='orange-nav-icon'>{item.icon}</span>
              <span>{item.title}</span>
              <small>{item.number}</small>
            </button>
          ))}
        </nav>
        <a className='orange-scroll-note' href='#orange-notes'>
          <span>往下，读点什么</span> ↓
        </a>
      </div>
    </section>
  )
}

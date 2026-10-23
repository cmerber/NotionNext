import { useCallback, useState } from 'react'
import dynamic from 'next/dynamic'
import SmartLink from '@/components/SmartLink'
import { useGlobal } from '@/lib/global'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

const Scene = dynamic(() => import('./StudioCanvas'), {
  ssr: false,
  loading: () => <div className='orange-scene-message'>正在打开工作室…</div>
})

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
  const [selected, setSelected] = useState('journal')
  const [view, setView] = useState(0)
  const [paused, setPaused] = useState(false)
  const [flat, setFlat] = useState(false)
  const [sceneStatus, setSceneStatus] = useState('loading')
  const [hover, setHover] = useState('')
  const fallback = useCallback(() => setSceneStatus('unavailable'), [])
  const place = PLACES.find(item => item.id === selected) || PLACES[0]
  const sceneEnabled = siteConfig('ORANGE_SCENE_ENABLE', true, CONFIG)
  const showScene = sceneEnabled && !flat && sceneStatus !== 'unavailable'
  const title = String(siteConfig('ORANGE_TITLE', CONFIG.ORANGE_TITLE, CONFIG))
  const titleBreak = title.indexOf('，')

  return (
    <section className='orange-studio' aria-label='橙子星球交互工作室'>
      <div className='orange-stage'>
        <div className='orange-stage-label'>
          <span className='orange-live-dot' /> QCODE / LITTLE STUDIO{' '}
          <span>欢迎来坐坐</span>
        </div>
        {showScene ? (
          <Scene
            night={isDarkMode}
            view={view}
            paused={paused}
            onSelect={setSelected}
            onHover={setHover}
            onReady={() => setSceneStatus('ready')}
            onUnavailable={fallback}
          />
        ) : (
          <div className='orange-flat-scene'>
            <span className='orange-flat-orbit'>🍊</span>
            <h2>一颗装满好奇心的小星球</h2>
            <p>
              {sceneStatus === 'unavailable'
                ? '当前设备暂时无法显示 3D，下面的入口依然可以使用。'
                : '从书架到工作台，选一个地方开始探索。'}
            </p>
            <div className='orange-flat-places'>
              {PLACES.map(item => (
                <button
                  type='button'
                  key={item.id}
                  onClick={() => setSelected(item.id)}
                  aria-pressed={selected === item.id}
                >
                  <span>{item.icon}</span>
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className='orange-scene-caption' aria-live='polite'>
          {hover
            ? `${PLACES.find(item => item.id === hover)?.title || ''} · 点击探索`
            : showScene
              ? '拖动旋转 · 点击房间里的物件'
              : '点击入口，探索星球'}
        </div>
        <div className='orange-scene-controls' aria-label='场景控制'>
          <button
            type='button'
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? '切换白天' : '切换夜晚'}
          >
            {isDarkMode ? '☾ 夜晚' : '☀ 白天'}
          </button>
          {showScene && (
            <>
              <button type='button' onClick={() => setView(value => value + 1)}>
                ↻ 切换视角
              </button>
              <button
                type='button'
                onClick={() => setPaused(value => !value)}
                aria-pressed={paused}
              >
                {paused ? '▷ 运行动画' : 'Ⅱ 暂停动画'}
              </button>
            </>
          )}
          {sceneEnabled && (
            <button
              type='button'
              onClick={() => {
                setFlat(value => !value)
                if (flat) setSceneStatus('loading')
              }}
              aria-pressed={flat}
            >
              {flat ? '◇ 3D 场景' : '▦ 简洁模式'}
            </button>
          )}
        </div>
      </div>
      <aside className='orange-studio-note'>
        <div>
          <p className='orange-eyebrow'>A SMALL PLACE FOR BIG IDEAS</p>
          <h1>
            {titleBreak >= 0 ? (
              <>
                {title.slice(0, titleBreak + 1)}
                <br />
                {title.slice(titleBreak + 1)}
              </>
            ) : (
              title
            )}
          </h1>
          <p className='orange-intro'>
            {siteConfig(
              'ORANGE_DESCRIPTION',
              CONFIG.ORANGE_DESCRIPTION,
              CONFIG
            )}
          </p>
        </div>
        <div className='orange-place-note' aria-live='polite'>
          <span className='orange-place-number'>{place.number} / EXPLORE</span>
          <h2>
            {place.title}
            <span>{place.icon}</span>
          </h2>
          <p>{place.description}</p>
          {selected === 'journal' && posts.length > 0 && (
            <SmartLink
              href={posts[0].href || `/article/${posts[0].slug || posts[0].id}`}
              className='orange-latest-note'
            >
              最近写下 · {posts[0].title}
            </SmartLink>
          )}
          <SmartLink className='orange-text-link' href={place.href}>
            {place.action} <span>↗</span>
          </SmartLink>
        </div>
        <p className='orange-handnote'>
          保持好奇，慢慢生长。 <span>✳</span>
        </p>
      </aside>
      <nav className='orange-place-nav' aria-label='工作室探索入口'>
        {PLACES.map(item => (
          <button
            key={item.id}
            type='button'
            aria-pressed={selected === item.id}
            onClick={() => setSelected(item.id)}
          >
            <span className='orange-nav-icon'>{item.icon}</span>
            <span>
              <small>
                {item.number} / {item.subtitle}
              </small>
              <strong>{item.title}</strong>
            </span>
            <span className='orange-nav-arrow'>↗</span>
          </button>
        ))}
      </nav>
    </section>
  )
}

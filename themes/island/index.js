import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import SmartLink from '@/components/SmartLink'
import LazyImage from '@/components/LazyImage'
import ThemeEntry from '@/components/ThemeEntry'
import { useGlobal } from '@/lib/global'
import { siteConfig } from '@/lib/config'
import CONFIG from './config'
import { Style } from './style'
import World from './components/World'
import ReadingRoom from './components/ReadingRoom'
import { PLACES, postHref } from './places'

function LayoutBase({ children, slotTop, siteInfo }) {
  const { isDarkMode, toggleDarkMode, onLoading } = useGlobal()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => setMenuOpen(false), [router.asPath])
  const home = (router.asPath || '/').split('?')[0] === '/'
  return (
    <div id='theme-island' data-home={home}>
      <Style />
      <a className='island-skip' href='#island-main'>
        跳到主要内容
      </a>
      <header className='island-header'>
        <SmartLink href='/' className='island-brand'>
          <span className='island-brand-symbol' aria-hidden='true'>
            ⌂<i>✦</i>
          </span>
          <span>
            {siteInfo?.title || '橙子星球'}
            <small>THE ISLAND JOURNAL</small>
          </span>
        </SmartLink>
        <nav aria-label='主导航' id='island-navigation' data-open={menuOpen}>
          {PLACES.map(p => (
            <SmartLink
              key={p.id}
              href={p.href}
              aria-current={
                router.asPath.split('?')[0] === p.href ? 'page' : undefined
              }
            >
              {
                {
                  library: '文字与灵感',
                  workshop: '实用工具',
                  observatory: '冒险档案',
                  home: '关于小岛'
                }[p.id]
              }
            </SmartLink>
          ))}
        </nav>
        <div className='island-header-actions'>
          <button
            className='island-menu-toggle'
            type='button'
            aria-label='打开小岛导航'
            aria-expanded={menuOpen}
            aria-controls='island-navigation'
            onClick={() => setMenuOpen(v => !v)}
          >
            ☰
          </button>
          <SmartLink href='/search' aria-label='搜索小岛文章'>
            ⌕
          </SmartLink>
          <ThemeEntry className='island-theme-entry' />
          <button
            type='button'
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? '切换白天' : '切换夜晚'}
          >
            {isDarkMode ? '☾' : '☀'}
          </button>
        </div>
      </header>
      <main id='island-main' aria-busy={onLoading}>
        {slotTop}
        {children}
      </main>
      <footer className='island-footer'>
        <SmartLink href='/'>⌂ {siteInfo?.title || '橙子星球'}</SmartLink>
        <span>在云端，留一盏灯。</span>
        <SmartLink href='/about'>由成设计与搭建 · QCODE.IM ↗</SmartLink>
      </footer>
    </div>
  )
}

function PostCards({ posts = [] }) {
  return (
    <div className='island-post-grid'>
      {posts.map((post, index) => (
        <article className='island-post-card' key={post.id || post.slug}>
          <SmartLink
            className='island-post-cover'
            href={postHref(post)}
            tabIndex={-1}
            aria-hidden='true'
          >
            {post.pageCover ? (
              <LazyImage
                src={post.pageCover}
                alt=''
                className='island-cover-image'
              />
            ) : (
              <span className='island-note-art' data-tone={index % 3}>
                <i>✳</i>
                <strong>{String(index + 1).padStart(2, '0')}</strong>
                <small>A NOTE FROM THE ISLAND</small>
              </span>
            )}
          </SmartLink>
          <div className='island-post-copy'>
            <p className='island-post-meta'>
              {[].concat(post.category || []).join(' / ') || '小岛笔记'}{' '}
              <span>{post.publishDay || post.date?.start_date || ''}</span>
            </p>
            <h3>
              <SmartLink href={postHref(post)}>{post.title}</SmartLink>
            </h3>
            {post.summary && <p>{post.summary}</p>}
            <SmartLink className='island-text-link' href={postHref(post)}>
              打开这一页 ↗
            </SmartLink>
          </div>
        </article>
      ))}
    </div>
  )
}

function LayoutIndex(props) {
  return (
    <>
      <World posts={props.posts} />
      <section className='island-journal' id='island-journal'>
        <div className='island-section-heading'>
          <div>
            <p className='island-eyebrow'>POSTCARDS FROM THE ISLAND</p>
            <h2>风经过，留下几页。</h2>
          </div>
          <SmartLink href='/archive' className='island-text-link'>
            到书屋坐坐 ↗
          </SmartLink>
        </div>
        <LayoutPostList {...props} hideHeading />
      </section>
    </>
  )
}

function LayoutPostList({
  posts = [],
  page = 1,
  postCount,
  category,
  tag,
  hideHeading = false,
  loadMore = false
}) {
  const router = useRouter()
  const perPage = Math.max(1, Number(siteConfig('POSTS_PER_PAGE', 12)) || 12)
  const [visible, setVisible] = useState(perPage)
  useEffect(() => setVisible(perPage), [router.asPath, perPage])
  const scroll = loadMore || siteConfig('POST_LIST_STYLE') === 'scroll'
  const total = Math.ceil((postCount || posts.length) / perPage)
  const current = Math.max(1, Number(page) || 1)
  const prefix = router.asPath
    .split('?')[0]
    .replace(/\/page\/\d+\/?$/, '')
    .replace(/\/$/, '')
  const href = value => ({
    pathname: value === 1 ? `${prefix}/` : `${prefix}/page/${value}`,
    query: router.query.s ? { s: router.query.s } : {}
  })
  return (
    <div className={`island-list ${hideHeading ? '' : 'island-content'}`}>
      {!hideHeading && (
        <Heading
          eyebrow='THE READING HOUSE'
          title={category || (tag ? `# ${tag}` : '文字与灵感')}
          text='把学习、研究和生活里的好奇心，慢慢写成一页页笔记。'
        />
      )}
      {posts.length ? (
        <PostCards posts={scroll ? posts.slice(0, visible) : posts} />
      ) : (
        <p className='island-empty'>下一封来信，正在路上。</p>
      )}
      {scroll && visible < posts.length && (
        <button
          className='island-button island-more'
          type='button'
          onClick={() => setVisible(v => v + perPage)}
        >
          再读几页 ↓
        </button>
      )}
      {!scroll && total > 1 && (
        <nav className='island-pagination' aria-label='文章分页'>
          {current > 1 && (
            <SmartLink href={href(current - 1)} rel='prev'>
              ← 上一页
            </SmartLink>
          )}
          <span>
            {current} / {total}
          </span>
          {current < total && (
            <SmartLink href={href(current + 1)} rel='next'>
              下一页 →
            </SmartLink>
          )}
        </nav>
      )}
    </div>
  )
}

function Heading({ eyebrow, title, text }) {
  return (
    <div className='island-page-heading'>
      <p className='island-eyebrow'>{eyebrow}</p>
      <h1>{title}</h1>
      {text && <p>{text}</p>}
    </div>
  )
}

function LayoutArchive({ archivePosts = {} }) {
  return (
    <section className='island-content'>
      <Heading
        eyebrow='01 / THE READING HOUSE'
        title='文字与灵感'
        text='书屋的门一直开着，找一篇喜欢的，慢慢读。'
      />
      <div className='island-archive-layout'>
        <aside>
          <span>⌂</span>
          <h2>风声书屋</h2>
          <p>
            读过的、想过的、
            <br />
            亲手试过的。
          </p>
          <SmartLink href='/category' className='island-text-link'>
            按主题翻阅 ↗
          </SmartLink>
        </aside>
        <div>
          {Object.entries(archivePosts).map(([date, posts]) => (
            <section className='island-archive' key={date}>
              <h2>{date}</h2>
              {posts.map((p, i) => (
                <SmartLink key={p.id} href={postHref(p)}>
                  <small>{String(i + 1).padStart(2, '0')}</small>
                  <span>{p.title}</span>
                  <i>↗</i>
                </SmartLink>
              ))}
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}

function LayoutSearch(props) {
  const router = useRouter()
  const [keyword, setKeyword] = useState(
    props.keyword || props.currentSearch || ''
  )
  useEffect(
    () => setKeyword(props.keyword || props.currentSearch || ''),
    [props.keyword, props.currentSearch]
  )
  return (
    <section className='island-content'>
      <Heading eyebrow='LOOK AROUND THE ISLAND' title='找一点灵感' />
      <form
        className='island-search'
        onSubmit={e => {
          e.preventDefault()
          router.push({
            pathname: '/search',
            query: { ...router.query, s: keyword.trim() }
          })
        }}
      >
        <label htmlFor='island-search'>搜索文章与笔记</label>
        <div>
          <input
            id='island-search'
            type='search'
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder='试试网页设计、教育技术……'
          />
          <button type='submit' className='island-button'>
            寻找 ↗
          </button>
        </div>
      </form>
      {(props.keyword || props.currentSearch) && (
        <LayoutPostList
          {...props}
          hideHeading
          loadMore={Boolean(props.keyword)}
        />
      )}
    </section>
  )
}

function CollectionIndex({ options = [], title, path }) {
  return (
    <section className='island-content'>
      <Heading eyebrow='COLLECT A LITTLE WONDER' title={title} />
      <div className='island-collection'>
        {options.map(item => (
          <SmartLink
            key={item.name}
            href={`/${path}/${encodeURIComponent(item.name)}`}
          >
            <span>{item.name}</span>
            <small>{item.count || 0} 篇 ↗</small>
          </SmartLink>
        ))}
      </div>
    </section>
  )
}
const LayoutCategoryIndex = props => (
  <CollectionIndex
    options={props.categoryOptions}
    title='按主题探索'
    path='category'
  />
)
const LayoutTagIndex = props => (
  <CollectionIndex options={props.tagOptions} title='灵感的索引' path='tag' />
)

function IslandStory() {
  return (
    <section className='island-content island-about'>
      <Heading
        eyebrow='04 / A PLACE TO BELONG'
        title='你好，我是成。'
        text='写代码，做研究，也认真生活。'
      />
      <div className='island-about-layout'>
        <div className='island-about-art'>
          <span>⌂</span>
          <strong>QCODE / 成</strong>
          <small>A LITTLE CORNER OF THE INTERNET</small>
        </div>
        <div>
          <p>
            我是橙子星球的维护者。在这里，我记录学习与动手实践的过程：从一个还不成熟的想法，到一篇笔记、一个网页，或一个能省下重复操作的小工具。
          </p>
          <p>
            书屋里有粒计算与粒球计算的学习记录，也有网页设计、网站实训和教育技术相关内容。我希望把零散的理解写清楚，方便以后回看，也给路过的你一点启发。
          </p>
          <h2>为什么是一座小岛？</h2>
          <p>
            因为我想在热闹的互联网里，留一处可以慢下来的地方。风声书屋收藏文字，玻璃工坊放着工具，观测站记录成长，山丘居所则留给日常和相遇。
          </p>
          <p>
            这座小岛由 Notion 管理内容，使用 Next.js 构建，并通过 Vercel
            发布。文章与工具会继续生长，欢迎随时回来看看。
          </p>
          <div className='island-about-links'>
            {PLACES.slice(0, 3).map(p => (
              <SmartLink key={p.id} href={p.href}>
                {p.icon} {p.title} ↗
              </SmartLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
function LayoutSlug(props) {
  if (!props.post) return <Layout404 />
  if (!props.lock && props.post.slug?.replace(/^\/+|\/+$/g, '') === 'about')
    return <IslandStory />
  return <ReadingRoom {...props} />
}
function Layout404() {
  return (
    <section className='island-content island-empty'>
      <Heading
        eyebrow='404 / OFF THE MAP'
        title='风把路标吹走了。'
        text='先回小岛，找一条新的小路吧。'
      />
      <SmartLink href='/' className='island-button'>
        返回小岛 ↗
      </SmartLink>
    </section>
  )
}

export {
  LayoutBase,
  LayoutIndex,
  LayoutPostList,
  LayoutSearch,
  LayoutArchive,
  LayoutCategoryIndex,
  LayoutTagIndex,
  LayoutSlug,
  Layout404,
  CONFIG as THEME_CONFIG
}

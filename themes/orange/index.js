import SmartLink from '@/components/SmartLink'
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Studio from './components/Studio'
import CONFIG from './config'
import { Style } from './style'
import { ImmersiveStyle } from './immersiveStyle'
import ReadingRoom from './components/ReadingRoom'
import { ExperienceStyle } from './experienceStyle'
import IslandStory from './components/IslandStory'
import ThemeEntry from '@/components/ThemeEntry'

const postHref = post => post.href || `/article/${post.slug || post.id}`

function MenuLink({ link }) {
  if (!link || link.show === false || !link.href) return null
  if (link.subMenus?.length)
    return (
      <details className='orange-menu'>
        <summary>{link.name || link.title}</summary>
        <div>
          {link.subMenus
            .filter(item => item.show !== false && item.href)
            .map((item, index) => (
              <MenuLink key={item.id || index} link={item} />
            ))}
        </div>
      </details>
    )
  return (
    <SmartLink href={link.href} target={link.target}>
      {link.name || link.title}
    </SmartLink>
  )
}

function LayoutBase({
  children,
  slotTop,
  siteInfo,
  customMenu = [],
  customNav = []
}) {
  const { isDarkMode, toggleDarkMode, onLoading } = useGlobal()
  const router = useRouter()
  const path = (router.asPath || '/').split('?')[0]
  const extraLinks = siteConfig('CUSTOM_MENU') ? customMenu : customNav
  return (
    <div id='theme-orange'>
      <Style />
      <ImmersiveStyle />
      <ExperienceStyle />
      <a className='orange-skip' href='#orange-main'>
        跳到主要内容
      </a>
      <header className='orange-header'>
        <SmartLink href='/' className='orange-brand'>
          <span>🍊</span>
          <span>
            {siteInfo?.title || siteConfig('TITLE', '橙子星球')}
            <small>A CORNER OF THE INTERNET</small>
          </span>
        </SmartLink>
        <nav aria-label='主导航'>
          <SmartLink
            href='/archive'
            aria-current={
              path.includes('/article/') || path.startsWith('/archive')
                ? 'page'
                : undefined
            }
          >
            文字与灵感
          </SmartLink>
          <SmartLink
            href='/tools'
            aria-current={path.startsWith('/tools') ? 'page' : undefined}
          >
            实用工具
          </SmartLink>
          <SmartLink
            href='/profile'
            aria-current={path.startsWith('/profile') ? 'page' : undefined}
          >
            冒险档案
          </SmartLink>
          <SmartLink
            href='/about'
            aria-current={path.startsWith('/about') ? 'page' : undefined}
          >
            关于小岛
          </SmartLink>
          {(extraLinks || [])
            .filter(
              link =>
                link.show !== false &&
                link.href &&
                (link.subMenus?.length ||
                  !['/', '/archive', '/tools', '/profile', '/about'].includes(
                    link.href
                  ))
            )
            .map((link, index) => (
              <MenuLink key={link.id || `${link.href}-${index}`} link={link} />
            ))}
          <SmartLink
            href='/search'
            aria-label='搜索文章'
            className='orange-round-button'
          >
            ⌕
          </SmartLink>
          <ThemeEntry className='orange-round-button' />
          <button
            type='button'
            className='orange-round-button'
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? '切换白天' : '切换夜晚'}
          >
            {isDarkMode ? '☾' : '☀'}
          </button>
        </nav>
      </header>
      <main id='orange-main' aria-busy={onLoading}>
        {slotTop}
        {children}
      </main>
      <footer className='orange-footer'>
        <SmartLink href='/'>🍊 {siteInfo?.title || '橙子星球'}</SmartLink>
        <span className='orange-footer-motto'>把每一次探索，都留在这里。</span>
        <SmartLink href='/about' className='orange-footer-credit'>
          由成设计与搭建 · QCODE.IM
        </SmartLink>
      </footer>
    </div>
  )
}

function PostCards({ posts = [] }) {
  const tilt = event => {
    if (
      event.pointerType === 'touch' ||
      !window.matchMedia('(hover: hover)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return
    const card = event.currentTarget
    const rect = card.getBoundingClientRect()
    card.style.setProperty(
      '--card-x',
      `${(0.5 - (event.clientY - rect.top) / rect.height) * 4}deg`
    )
    card.style.setProperty(
      '--card-y',
      `${((event.clientX - rect.left) / rect.width - 0.5) * 4}deg`
    )
  }
  return (
    <div className='orange-post-grid'>
      {posts.map((post, index) => (
        <article
          className='orange-post-card'
          data-cover-tone={index % 3}
          key={post.id || post.slug}
          onPointerMove={tilt}
          onPointerLeave={event => {
            event.currentTarget.style.setProperty('--card-x', '0deg')
            event.currentTarget.style.setProperty('--card-y', '0deg')
          }}
        >
          <SmartLink
            href={postHref(post)}
            className='orange-post-cover'
            tabIndex={-1}
            aria-hidden='true'
          >
            {post.pageCover ? (
              <LazyImage
                src={post.pageCover}
                alt=''
                className='orange-cover-image'
              />
            ) : (
              <span className='orange-cover-placeholder'>
                <span className='orange-cover-orbit' />
                <strong>{String(index + 1).padStart(2, '0')}</strong>
                <i>✳</i>
                <small>FIELD NOTES / 小岛来信</small>
              </span>
            )}
          </SmartLink>
          <div className='orange-post-copy'>
            <div className='orange-post-meta'>
              <span>
                {[].concat(post.category || []).join(' / ') || '星球笔记'}
              </span>
              <time>
                {post.date?.start_date ||
                  post.date?.start ||
                  post.lastEditedDate ||
                  ''}
              </time>
            </div>
            <h3>
              <SmartLink href={postHref(post)}>{post.title}</SmartLink>
            </h3>
            {post.summary && <p>{post.summary}</p>}
            {!!post.tagItems?.length && (
              <div className='orange-card-tags'>
                {post.tagItems.slice(0, 3).map(tag => (
                  <SmartLink
                    key={tag.name || tag}
                    href={`/tag/${encodeURIComponent(tag.name || tag)}`}
                  >
                    # {tag.name || tag}
                  </SmartLink>
                ))}
              </div>
            )}
            <SmartLink href={postHref(post)} className='orange-read-link'>
              继续阅读 <span>↗</span>
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
      <Studio posts={props.posts} />
      <section id='orange-notes' className='orange-journal-section'>
        <div className='orange-section-heading'>
          <div>
            <p className='orange-eyebrow'>FIELD NOTES / 持续更新中</p>
            <h2>
              最近，留下的足迹<span>✳</span>
            </h2>
          </div>
          <SmartLink href='/archive' className='orange-text-link'>
            全部文章 ↗
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
  const [visible, setVisible] = useState(12)
  const perPage = Math.max(1, Number(siteConfig('POSTS_PER_PAGE', 12)) || 12)
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
  useEffect(() => setVisible(perPage), [router.asPath, perPage])
  return (
    <div className='orange-list'>
      {!hideHeading && (
        <div className='orange-page-heading'>
          <p className='orange-eyebrow'>COLLECTION / 星球收藏</p>
          <h1>{category || (tag ? `# ${tag}` : '文字与灵感')}</h1>
        </div>
      )}
      {posts.length ? (
        <PostCards posts={scroll ? posts.slice(0, visible) : posts} />
      ) : (
        <p className='orange-empty'>这里还没有笔记，下一次灵感正在路上。</p>
      )}
      {scroll && visible < posts.length && (
        <button
          className='orange-button orange-more'
          type='button'
          onClick={() => setVisible(value => value + perPage)}
        >
          再翻几篇 ↓
        </button>
      )}
      {!scroll && total > 1 && (
        <nav className='orange-pagination' aria-label='文章分页'>
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

function LayoutSearch(props) {
  const router = useRouter()
  const [keyword, setKeyword] = useState(
    props.keyword || props.currentSearch || ''
  )
  useEffect(
    () => setKeyword(props.keyword || props.currentSearch || ''),
    [props.keyword, props.currentSearch]
  )
  const search = event => {
    event.preventDefault()
    router.push({
      pathname: '/search',
      query: {
        ...(router.query.theme ? { theme: router.query.theme } : {}),
        s: keyword.trim()
      }
    })
  }
  return (
    <section className='orange-journal-section'>
      <div className='orange-page-heading'>
        <p className='orange-eyebrow'>FIND A LITTLE INSPIRATION</p>
        <h1>找一点灵感</h1>
      </div>
      <form className='orange-search' onSubmit={search}>
        <label htmlFor='orange-search'>搜索文章与笔记</label>
        <div>
          <input
            id='orange-search'
            type='search'
            value={keyword}
            onChange={event => setKeyword(event.target.value)}
            placeholder='试试“网页设计”或“教育技术”'
          />
          <button type='submit' className='orange-button'>
            搜索 ↗
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

function LayoutArchive({ archivePosts = {} }) {
  return (
    <section className='orange-journal-section'>
      <div className='orange-page-heading'>
        <p className='orange-eyebrow'>THE JOURNAL / 按时间收藏</p>
        <h1>文字与灵感</h1>
        <p>记录一些值得留下来的想法。</p>
      </div>
      {Object.entries(archivePosts).map(([date, posts]) => (
        <section key={date} className='orange-archive'>
          <h2>{date}</h2>
          {posts.map(post => (
            <SmartLink key={post.id} href={postHref(post)}>
              <span>{post.title}</span>
              <span>↗</span>
            </SmartLink>
          ))}
        </section>
      ))}
    </section>
  )
}

function CollectionIndex({ options, title, path }) {
  return (
    <section className='orange-journal-section'>
      <div className='orange-page-heading'>
        <p className='orange-eyebrow'>EXPLORE THE COLLECTION</p>
        <h1>{title}</h1>
      </div>
      <div className='orange-collection'>
        {(options || []).map(item => (
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
  <CollectionIndex options={props.tagOptions} title='灵感标签' path='tag' />
)

function LayoutSlug(props) {
  if (!props.post) return <Layout404 />
  if (!props.lock && props.post.slug?.replace(/^\/+|\/+$/g, '') === 'about')
    return <IslandStory full />
  return <ReadingRoom {...props} />
}

function Layout404() {
  return (
    <section className='orange-empty orange-lost'>
      <span>✧</span>
      <p className='orange-eyebrow'>404 / OFF THE MAP</p>
      <h1>好像走到星球边缘了。</h1>
      <p>这条路径暂时没有内容，先回工作室坐坐吧。</p>
      <SmartLink href='/' className='orange-button'>
        返回工作室 ↗
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

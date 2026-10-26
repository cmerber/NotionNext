import { useEffect, useRef, useState } from 'react'
import SmartLink from '@/components/SmartLink'
import LazyImage from '@/components/LazyImage'
import NotionPage from '@/components/NotionPage'
import dynamic from 'next/dynamic'

const Comment = dynamic(() => import('@/components/Comment'), { ssr: false })
const ShareBar = dynamic(() => import('@/components/ShareBar'), { ssr: false })
const href = post => post.href || `/article/${post.slug || post.id}`

export default function ReadingRoom({ post, lock, validPassword, prev, next }) {
  const article = useRef(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [headings, setHeadings] = useState([])
  const [active, setActive] = useState('')
  const [progress, setProgress] = useState(0)
  const [minutes, setMinutes] = useState(null)
  const [wide, setWide] = useState(false)
  useEffect(() => {
    if (lock || !article.current) return
    const root = article.current
    let frame = 0
    let sections = []
    const scan = () => {
      sections = Array.from(root.querySelectorAll('.notion-h, h2, h3')).filter(
        el => el.textContent.trim()
      )
      sections.forEach((el, i) => {
        if (!el.id) el.id = `orange-section-${i}`
      })
      setHeadings(
        sections.map(el => ({
          id: el.id,
          text: el.textContent.replace(/^[#\s]+/, '').trim(),
          sub: el.matches('h3, .notion-h2, .notion-h3')
        }))
      )
      setMinutes(Math.max(1, Math.ceil(root.textContent.length / 450)))
    }
    const measure = () => {
      frame = 0
      const rect = root.getBoundingClientRect()
      const distance = Math.max(
        1,
        root.scrollHeight - window.innerHeight * 0.55
      )
      setProgress(
        Math.max(
          0,
          Math.min(100, Math.round(((110 - rect.top) / distance) * 100))
        )
      )
      const reached = sections.filter(
        el => el.getBoundingClientRect().top < 160
      )
      setActive(reached[reached.length - 1]?.id || sections[0]?.id || '')
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    scan()
    measure()
    const mutations = new MutationObserver(() => {
      scan()
      onScroll()
    })
    mutations.observe(root, { childList: true, subtree: true })
    const resize =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(onScroll)
    resize?.observe(root)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      mutations.disconnect()
      resize?.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [post?.id, lock])
  if (lock)
    return (
      <section className='orange-reading orange-lock-room'>
        <span className='orange-lock-symbol' aria-hidden='true'>
          ✳
        </span>
        <p className='orange-eyebrow'>A PRIVATE NOTE</p>
        <h1>这篇笔记需要密码</h1>
        <p>有些故事，只留给知道暗号的人。</p>
        <form
          className='orange-search'
          onSubmit={event => {
            event.preventDefault()
            setError(!validPassword?.(password))
          }}
        >
          <label htmlFor='orange-password'>文章密码</label>
          <div>
            <input
              id='orange-password'
              type='password'
              value={password}
              onChange={event => setPassword(event.target.value)}
              required
            />
            <button className='orange-button' type='submit'>
              打开笔记
            </button>
          </div>
          {error && <p role='alert'>密码不正确，再试一次吧。</p>}
        </form>
      </section>
    )
  const about = post.slug === 'about' || post.type === 'Page'
  const categories = [].concat(post.category || []).filter(Boolean)
  const tags = (post.tagItems || [])
    .map(item => (typeof item === 'string' ? item : item.name))
    .filter(Boolean)
  return (
    <section
      className={`orange-reading-room ${wide ? 'orange-reading-wide' : ''}`}
    >
      <div
        className='orange-reading-progress'
        role='progressbar'
        aria-label='阅读进度'
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <span style={{ width: `${progress}%` }} />
      </div>
      <nav className='orange-breadcrumb' aria-label='当前位置'>
        <SmartLink href='/'>小岛</SmartLink>
        <span>/</span>
        <SmartLink href='/archive'>灵感书架</SmartLink>
        <span>/</span>
        <span>{about ? '会客厅' : '一篇笔记'}</span>
      </nav>
      <header
        className={`orange-story-hero ${about ? 'orange-story-about' : ''}`}
      >
        <div className='orange-story-heading'>
          <p className='orange-eyebrow'>
            {about
              ? 'NICE TO MEET YOU / 会客厅'
              : 'FROM THE LITTLE ISLAND / 小岛来信'}
          </p>
          <h1>{post.title}</h1>
          {post.summary && <p className='orange-story-deck'>{post.summary}</p>}
          <div className='orange-story-meta'>
            <span>
              {post.publishDay ||
                post.date?.start_date ||
                post.date?.start ||
                '一段值得留下的时光'}
            </span>
            {minutes && <span>约 {minutes} 分钟阅读</span>}
            {categories.map(name => (
              <SmartLink
                key={name}
                href={`/category/${encodeURIComponent(name)}`}
              >
                {name}
              </SmartLink>
            ))}
          </div>
        </div>
        <div className='orange-story-art' aria-hidden='true'>
          {post.pageCover ? (
            <LazyImage
              src={post.pageCover}
              placeholderSrc='/orange/journal-cover.svg'
              fallbackSrc='/orange/journal-cover.svg'
              alt=''
              className='orange-story-image'
            />
          ) : (
            <>
              <span className='orange-art-orbit' />
              <div className='orange-paper-book'>
                <span>
                  FIELD
                  <br />
                  NOTES
                </span>
                <i>✳</i>
              </div>
              <span className='orange-art-sun'>✳</span>
              <span className='orange-art-caption'>
                COLLECT A LITTLE WONDER
              </span>
            </>
          )}
        </div>
      </header>
      <div className='orange-reading-layout'>
        <aside className='orange-reading-aside'>
          <div className='orange-reading-compass'>
            <span>01 / READING ROOM</span>
            <p>
              慢慢读，
              <br />
              让想法落地。
            </p>
            <SmartLink href='/'>返回小岛 ↗</SmartLink>
          </div>
          {headings.length > 0 && (
            <details className='orange-toc' open>
              <summary>
                本篇目录{' '}
                <span>{headings.length.toString().padStart(2, '0')}</span>
              </summary>
              <nav aria-label='文章目录'>
                {headings.map(item => (
                  <a
                    href={`#${item.id}`}
                    key={item.id}
                    className={item.sub ? 'orange-toc-sub' : ''}
                    aria-current={active === item.id ? 'location' : undefined}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </details>
          )}
          <div className='orange-reading-settings'>
            <button
              type='button'
              aria-pressed={wide}
              onClick={() => setWide(value => !value)}
            >
              {wide ? '标准行宽' : '舒展行宽'}
            </button>
            <button
              type='button'
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: window.matchMedia(
                    '(prefers-reduced-motion: reduce)'
                  ).matches
                    ? 'auto'
                    : 'smooth'
                })
              }
            >
              回到开篇 ↑
            </button>
          </div>
        </aside>
        <div className='orange-reading-paper'>
          <article id='article-wrapper' ref={article}>
            <NotionPage post={post} />
          </article>
          <div className='orange-story-end'>
            <span>✳</span>
            <p>谢谢你，读到这里。</p>
            <small>愿这一页，给你带来一点新的灵感。</small>
            {tags.length > 0 && (
              <div className='orange-story-tags'>
                {tags.map(tag => (
                  <SmartLink key={tag} href={`/tag/${encodeURIComponent(tag)}`}>
                    # {tag}
                  </SmartLink>
                ))}
              </div>
            )}
          </div>
          <nav className='orange-adjacent' aria-label='继续阅读'>
            {prev && (
              <SmartLink href={href(prev)}>
                <small>← 上一篇</small>
                <strong>{prev.title}</strong>
              </SmartLink>
            )}
            {next && (
              <SmartLink href={href(next)}>
                <small>下一篇 →</small>
                <strong>{next.title}</strong>
              </SmartLink>
            )}
            {!prev && !next && (
              <SmartLink href='/archive'>
                <small>下一段灵感</small>
                <strong>回书架，再翻一页 ↗</strong>
              </SmartLink>
            )}
          </nav>
          <ShareBar post={post} />
          <Comment frontMatter={post} />
        </div>
      </div>
    </section>
  )
}

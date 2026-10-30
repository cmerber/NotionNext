import { useEffect, useMemo, useRef, useState } from 'react'
import { activeLyricIndex, parseLrc } from '@/lib/music/lyrics'
import { copyText, lyricScrollTop, shareUrl } from '@/lib/music/player'
import styles from './MusicRoom.module.css'

const clock = time =>
  `${Math.floor((time || 0) / 60)}:${String(Math.floor((time || 0) % 60)).padStart(2, '0')}`

function Icon({ name, ...props }) {
  const shapes = {
    play: <path d='m9 5 11 7-11 7Z' fill='currentColor' stroke='none' />,
    pause: <path d='M8 5v14M16 5v14' strokeWidth='4' />,
    previous: (
      <>
        <path d='M6 5v14' />
        <path d='m19 5-10 7 10 7Z' fill='currentColor' stroke='none' />
      </>
    ),
    next: (
      <>
        <path d='M18 5v14' />
        <path d='m5 5 10 7-10 7Z' fill='currentColor' stroke='none' />
      </>
    ),
    volume: (
      <>
        <path d='M4 9h4l5-4v14l-5-4H4Z' />
        <path d='M17 8q5 4 0 8' />
      </>
    ),
    muted: (
      <>
        <path d='M4 9h4l5-4v14l-5-4H4Z' />
        <path d='m17 9 5 6m0-6-5 6' />
      </>
    ),
    download: (
      <>
        <path d='M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4' />
      </>
    ),
    repeat: (
      <>
        <path d='m16 3 4 4-4 4M4 11V9a2 2 0 0 1 2-2h14M8 21l-4-4 4-4m12 0v2a2 2 0 0 1-2 2H4' />
      </>
    ),
    arrow: <path d='M5 19 19 5M5 5h14v14' />,
    share: (
      <>
        <path d='M12 16V3m-4 4 4-4 4 4M5 11v10h14V11' />
      </>
    )
  }
  return (
    <svg
      viewBox='0 0 24 24'
      width='20'
      height='20'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
      {...props}
    >
      {shapes[name]}
    </svg>
  )
}

export default function MusicRoom({ catalog }) {
  const tracks = catalog.tracks || []
  const [index, setIndex] = useState(0)
  const track = tracks[index]
  const audio = useRef(null)
  const lineRefs = useRef([])
  const lyricBox = useRef(null)
  const browseTimer = useRef(null)
  const touchStartY = useRef(null)
  const desiredPlay = useRef(false)
  const attempt = useRef(0)
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(track?.duration || 0)
  const [volume, setVolume] = useState(0.75)
  const [muted, setMuted] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [notice, setNotice] = useState('')
  const [lyricsFollow, setLyricsFollow] = useState(true)
  const [shareTarget, setShareTarget] = useState('site')
  const [copyFallback, setCopyFallback] = useState('')
  const lines = useMemo(() => parseLrc(track?.lrcText), [track?.lrcText])
  const active = activeLyricIndex(lines, time)

  useEffect(() => {
    try {
      const hash = decodeURIComponent(window.location.hash.slice(1))
      const found = tracks.findIndex(item => item.id === hash)
      if (found >= 0) setIndex(found)
    } catch {
      // An invalid URL fragment should not prevent playback.
    }
  }, [tracks])

  useEffect(() => {
    const player = audio.current
    if (!player || !track) return
    const currentAttempt = ++attempt.current
    setPlaying(false)
    setLoading(desiredPlay.current)
    setTime(0)
    setDuration(track.duration)
    setNotice('')
    setCopyFallback('')
    clearTimeout(browseTimer.current)
    setLyricsFollow(true)
    player.load()
    if (desiredPlay.current) {
      player.play().catch(error => {
        if (attempt.current !== currentAttempt || error.name === 'AbortError')
          return
        desiredPlay.current = false
        setLoading(false)
        setNotice('点击播放，继续听这首歌。')
      })
    }
  }, [track])

  useEffect(() => () => clearTimeout(browseTimer.current), [])

  useEffect(() => {
    if (!playing || typeof window.requestAnimationFrame !== 'function') return
    let frame
    let lastUpdate = 0
    const followMediaClock = now => {
      if (now - lastUpdate >= 50) {
        setTime(audio.current?.currentTime || 0)
        lastUpdate = now
      }
      frame = window.requestAnimationFrame(followMediaClock)
    }
    frame = window.requestAnimationFrame(followMediaClock)
    return () => window.cancelAnimationFrame(frame)
  }, [playing, track])

  const resumeLyrics = () => {
    clearTimeout(browseTimer.current)
    setTime(audio.current?.currentTime || 0)
    setLyricsFollow(true)
  }
  const browseLyrics = () => {
    clearTimeout(browseTimer.current)
    setLyricsFollow(false)
    browseTimer.current = setTimeout(resumeLyrics, 4000)
  }

  useEffect(() => {
    if (audio.current) {
      audio.current.volume = volume
      audio.current.muted = muted
    }
  }, [volume, muted])

  useEffect(() => {
    if (!lyricsFollow || active < 0) return
    const box = lyricBox.current
    const line = lineRefs.current[active]
    if (box && line)
      box.scrollTo({
        top: lyricScrollTop(box, line),
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth'
      })
  }, [active, lyricsFollow])

  useEffect(() => {
    if (
      !track ||
      !('mediaSession' in navigator) ||
      !('MediaMetadata' in window)
    )
      return
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: '小岛声场',
      artwork: [
        {
          src: new URL(track.cover, window.location.origin).href,
          sizes: '360x360',
          type: track.cover.endsWith('.png') ? 'image/png' : 'image/jpeg'
        }
      ]
    })
    const handlers = {
      play: () => {
        desiredPlay.current = true
        audio.current?.play().catch(() => {
          desiredPlay.current = false
        })
      },
      pause: () => {
        desiredPlay.current = false
        audio.current?.pause()
      },
      previoustrack: () => choose((index - 1 + tracks.length) % tracks.length),
      nexttrack: () => choose((index + 1) % tracks.length)
    }
    for (const [action, handler] of Object.entries(handlers)) {
      try {
        navigator.mediaSession.setActionHandler(action, handler)
      } catch {}
    }
    return () => {
      for (const action of Object.keys(handlers)) {
        try {
          navigator.mediaSession.setActionHandler(action, null)
        } catch {}
      }
    }
    // Handlers are recreated for the selected track.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, track, tracks.length])

  const choose = next => {
    if (next === index) return
    desiredPlay.current = !audio.current?.paused || desiredPlay.current
    audio.current?.pause()
    setIndex(next)
    window.history.replaceState(null, '', `#${tracks[next].id}`)
  }
  const toggle = async () => {
    const player = audio.current
    if (!player) return
    if (!player.paused) {
      desiredPlay.current = false
      player.pause()
      return
    }
    desiredPlay.current = true
    setLoading(true)
    setNotice('')
    try {
      await player.play()
    } catch {
      setLoading(false)
      desiredPlay.current = false
      setNotice('暂时无法播放，请重试或下载后收听。')
    }
  }
  const seek = next => {
    if (!audio.current || !Number.isFinite(next)) return
    audio.current.currentTime = Math.max(0, Math.min(next, duration))
    setTime(audio.current.currentTime)
    resumeLyrics()
  }
  const share = async () => {
    const url = shareUrl(track, shareTarget, window.location.origin)
    try {
      await copyText(url)
      setCopyFallback('')
      setNotice(
        shareTarget === 'qq' && url.includes('y.qq.com')
          ? 'QQ 音乐歌曲链接已复制。'
          : '本站歌曲链接已复制。'
      )
    } catch {
      setCopyFallback(url)
      setNotice('浏览器未允许自动复制，可选中下方链接复制。')
    }
  }
  if (!track)
    return (
      <section className={styles.room}>
        <h1>小岛声场</h1>
        <p>新的旋律正在路上。</p>
      </section>
    )

  return (
    <div
      className={styles.room}
      data-playing={playing}
      data-tone={track.tone || 'dusk'}
    >
      <div className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>
            <span /> QCODE / INDEPENDENT SOUNDS
          </p>
          <h1>
            小岛声场<span>让生活，有回响。</span>
          </h1>
        </div>
        <p className={styles.introNote}>
          把没说完的话，放进旋律里。
          <br />
          这里是晴岑来的小小音乐角落，
          <br />
          也是为你留的一张听歌座位。
        </p>
      </div>

      <section className={styles.player} aria-label='音乐播放器'>
        <div className={styles.deck}>
          <div className={styles.deckTop}>
            <span>THE ISLAND SESSIONS</span>
            <span>VOL. {String(index + 1).padStart(2, '0')}</span>
          </div>
          <div className={styles.recordStage}>
            <div className={styles.orbit} />
            <div className={styles.record}>
              <div className={styles.recordLabel}>
                <img
                  src={track.cover}
                  alt={`${track.title}歌曲封面`}
                  width='360'
                  height='360'
                />
              </div>
              <i className={styles.spindle} />
            </div>
            <div className={styles.tonearm}>
              <i />
            </div>
            <span className={styles.sideLabel}>
              SIDE {index === 0 ? 'A' : 'B'} · 33⅓ RPM
            </span>
          </div>
          <div className={styles.deckBottom}>
            <span className={styles.signal}>
              {[0, 1, 2, 3, 4].map(n => (
                <i key={n} style={{ '--n': n }} />
              ))}
              <b>{playing ? 'ON AIR' : 'READY TO PLAY'}</b>
            </span>
            <span>晴岑来 / QING CEN LAI</span>
          </div>
        </div>

        <div className={styles.console}>
          <div className={styles.songMeta}>
            <span>{track.tag}</span>
            <span>AI 辅助创作</span>
          </div>
          <h2>{track.title}</h2>
          <p className={styles.artist}>
            {track.artist}
            <span> / </span>小岛作品集
          </p>
          <p className={styles.description}>{track.description}</p>
          <div className={styles.lyricHeader}>
            <span>歌词 / LYRICS</span>
            <button
              type='button'
              onClick={() => {
                if (lyricsFollow) browseLyrics()
                else resumeLyrics()
              }}
              aria-pressed={lyricsFollow}
            >
              {lyricsFollow ? '歌词跟随中 ↘' : '恢复跟随 · 4 秒后自动恢复 ↘'}
            </button>
          </div>
          <div
            ref={lyricBox}
            className={styles.lyrics}
            tabIndex={0}
            aria-label='滚动歌词，点击歌词跳到对应时间'
            onWheel={event => {
              if (event.deltaY) browseLyrics()
            }}
            onTouchStart={event => {
              touchStartY.current = event.touches[0]?.clientY ?? null
            }}
            onTouchMove={event => {
              if (
                touchStartY.current !== null &&
                Math.abs(
                  (event.touches[0]?.clientY ?? touchStartY.current) -
                    touchStartY.current
                ) > 8
              )
                browseLyrics()
            }}
            onKeyDown={event => {
              if (
                [
                  'ArrowUp',
                  'ArrowDown',
                  'PageUp',
                  'PageDown',
                  'Home',
                  'End'
                ].includes(event.key)
              )
                browseLyrics()
            }}
          >
            {lines.length ? (
              <div className={styles.lyricLines}>
                {lines.map((line, n) => (
                  <button
                    type='button'
                    key={`${line.time}-${n}`}
                    ref={el => {
                      lineRefs.current[n] = el
                    }}
                    className={n === active ? styles.activeLine : ''}
                    aria-current={n === active ? 'true' : undefined}
                    onClick={() => {
                      seek(line.time)
                      setLyricsFollow(true)
                    }}
                    aria-label={`${clock(line.time)} ${line.text}`}
                  >
                    {line.text}
                  </button>
                ))}
              </div>
            ) : (
              <p className={styles.noLyrics}>
                先让旋律陪你一会儿。
                <br />
                <small>歌词正在整理中</small>
              </p>
            )}
          </div>
          <div className={styles.progress}>
            <input
              aria-label='播放进度'
              aria-valuetext={`${clock(time)}，共 ${clock(duration)}`}
              type='range'
              min='0'
              max={duration || 1}
              step='0.1'
              value={Math.min(time, duration || 1)}
              onChange={event => seek(Number(event.target.value))}
              style={{
                '--progress': `${duration ? (time / duration) * 100 : 0}%`
              }}
            />
            <div>
              <span>{clock(time)}</span>
              <span>{clock(duration)}</span>
            </div>
          </div>
          <div className={styles.controls}>
            <button
              type='button'
              title={repeat ? '单曲循环已开启' : '开启单曲循环'}
              aria-label='单曲循环'
              aria-pressed={repeat}
              className={repeat ? styles.enabled : ''}
              onClick={() => setRepeat(!repeat)}
            >
              <Icon name='repeat' />
              {repeat && <sup>1</sup>}
            </button>
            <div className={styles.transport}>
              <button
                type='button'
                aria-label='上一首'
                onClick={() =>
                  choose((index - 1 + tracks.length) % tracks.length)
                }
              >
                <Icon name='previous' />
              </button>
              <button
                type='button'
                className={styles.playButton}
                aria-label={playing ? '暂停' : '播放'}
                aria-busy={loading}
                onClick={toggle}
              >
                <Icon
                  name={playing ? 'pause' : 'play'}
                  width='26'
                  height='26'
                />
              </button>
              <button
                type='button'
                aria-label='下一首'
                onClick={() => choose((index + 1) % tracks.length)}
              >
                <Icon name='next' />
              </button>
            </div>
            <div className={styles.volume}>
              <button
                type='button'
                aria-label={muted ? '取消静音' : '静音'}
                onClick={() => setMuted(!muted)}
              >
                <Icon name={muted || volume === 0 ? 'muted' : 'volume'} />
              </button>
              <input
                type='range'
                min='0'
                max='1'
                step='0.01'
                value={muted ? 0 : volume}
                aria-label='音量'
                onChange={event => {
                  setVolume(Number(event.target.value))
                  setMuted(false)
                }}
              />
            </div>
          </div>
          <div className={styles.songActions}>
            <a href={track.audio} download={`${track.title}.mp3`}>
              <Icon name='download' width='16' height='16' /> 下载音乐
            </a>
            {track.lrc && (
              <a href={track.lrc} download={`${track.title}.lrc`}>
                LRC 歌词 ↗
              </a>
            )}
            <div className={styles.shareActions}>
              <select
                aria-label='分享链接类型'
                value={shareTarget}
                onChange={event => {
                  setShareTarget(event.target.value)
                  setCopyFallback('')
                }}
              >
                <option value='site'>本站歌曲</option>
                {shareUrl(track, 'qq', '').startsWith('https://y.qq.com/') && (
                  <option value='qq'>QQ 音乐</option>
                )}
              </select>
              <button
                type='button'
                onClick={share}
                title='直接复制所选歌曲链接'
              >
                <Icon name='share' width='16' height='16' /> 复制链接
              </button>
            </div>
          </div>
          <p className={styles.notice} role='status'>
            {notice || (loading ? '正在连接这段旋律…' : '\u00a0')}
          </p>
          {copyFallback && (
            <input
              className={styles.copyFallback}
              aria-label='待复制的歌曲链接'
              readOnly
              value={copyFallback}
              onFocus={event => event.target.select()}
            />
          )}
        </div>
        <audio
          ref={audio}
          src={track.audio}
          preload='metadata'
          loop={repeat}
          onLoadedMetadata={() => {
            if (Number.isFinite(audio.current.duration))
              setDuration(audio.current.duration)
          }}
          onTimeUpdate={() => setTime(audio.current.currentTime)}
          onSeeked={resumeLyrics}
          onPlaying={() => {
            resumeLyrics()
            setPlaying(true)
            setLoading(false)
          }}
          onPause={() => setPlaying(false)}
          onWaiting={() => {
            if (desiredPlay.current) setLoading(true)
          }}
          onCanPlay={() => setLoading(false)}
          onError={() => {
            setPlaying(false)
            setLoading(false)
            desiredPlay.current = false
            setNotice('音频暂时没有连接成功，请稍后重试。')
          }}
          onEnded={() => {
            if (!repeat) {
              desiredPlay.current = true
              setIndex((index + 1) % tracks.length)
            }
          }}
        />
      </section>

      <section className={styles.collection} aria-label='歌曲列表'>
        <div className={styles.sectionHeading}>
          <h2>两段旋律，一些日常。</h2>
          <span>THE COLLECTION / {String(tracks.length).padStart(2, '0')}</span>
        </div>
        <div className={styles.trackList}>
          {tracks.map((song, n) => (
            <button
              type='button'
              key={song.id}
              className={`${styles.trackRow} ${n === index ? styles.selectedTrack : ''}`}
              aria-pressed={n === index}
              aria-label={`选择歌曲 ${song.title}`}
              onClick={() => choose(n)}
            >
              <span className={styles.trackNumber}>
                {n === index && playing ? '♫' : String(n + 1).padStart(2, '0')}
              </span>
              <img
                src={song.cover}
                alt=''
                width='64'
                height='64'
                loading='lazy'
              />
              <span className={styles.trackName}>
                <strong>{song.title}</strong>
                <small>
                  {song.artist} · {song.tag}
                </small>
              </span>
              <span className={styles.rowDescription}>{song.shortNote}</span>
              <span className={styles.rowTime}>{clock(song.duration)}</span>
              <span className={styles.rowPlay}>
                <Icon
                  name={n === index && playing ? 'pause' : 'play'}
                  width='16'
                  height='16'
                />
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className={styles.artistCard} aria-label='关注音乐人'>
        <div className={styles.artistMark}>
          晴<span>岑来</span>
          <i>✳</i>
        </div>
        <div className={styles.artistBio}>
          <p className={styles.eyebrow}>BEHIND THE SOUNDS</p>
          <h2>你好，我是晴岑来。</h2>
          <p>
            写下生活里的念头，也尝试用 AI 把它们变成旋律。
            <br />
            如果有一句恰好唱进你心里，欢迎在音乐平台找到我。
          </p>
          <div className={styles.platforms}>
            {[...(track.platforms || []), ...(catalog.platforms || [])]
              .filter(
                (link, n, all) =>
                  all.findIndex(item => item.url === link.url) === n
              )
              .map(link => (
                <a
                  key={link.name}
                  href={link.url}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {link.name}
                  <Icon name='arrow' width='14' height='14' />
                </a>
              ))}
          </div>
          <small className={styles.platformNote}>{catalog.platformNote}</small>
        </div>
        <span className={styles.artistAside}>
          STAY A LITTLE.
          <br />
          LISTEN A LITTLE.
        </span>
      </section>
      <p className={styles.footnote}>
        有些日子适合赶路，有些日子适合听歌。
        <span>MADE WITH LIFE, & A LITTLE AI.</span>
      </p>
    </div>
  )
}

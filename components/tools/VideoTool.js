import { useMemo, useState } from 'react'

const DIRECT_VIDEO_EXTENSIONS = /\.(mp4|webm|mov|m4v|mkv|avi|flv)(?:$|[?#])/i

const SYSTEMS = {
  windows: {
    label: 'Windows',
    install:
      'winget install --id yt-dlp.yt-dlp -e && winget install --id Gyan.FFmpeg -e',
    folder: '-P "%USERPROFILE%\\Downloads"',
    quote: value => `"${value.replace(/"/g, '%22')}"`,
    extension: 'cmd'
  },
  mac: {
    label: 'macOS',
    install: 'brew install yt-dlp ffmpeg',
    folder: '-P "$HOME/Downloads"',
    quote: value => `'${value.replace(/'/g, `'"'"'`)}'`,
    extension: 'command'
  },
  linux: {
    label: 'Linux',
    install: 'python3 -m pip install -U yt-dlp && sudo apt install ffmpeg',
    folder: '-P "$HOME/Downloads"',
    quote: value => `'${value.replace(/'/g, `'"'"'`)}'`,
    extension: 'sh'
  }
}

function classifyUrl(value) {
  let parsed
  try {
    parsed = new URL(value)
  } catch {
    return { type: 'invalid' }
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) return { type: 'invalid' }

  if (DIRECT_VIDEO_EXTENSIONS.test(`${parsed.pathname}${parsed.search}`)) {
    return { type: 'direct', url: parsed.toString() }
  }

  const host = parsed.hostname.toLowerCase()
  const platforms = [
    [/bilibili\.com$|b23\.tv$/, 'B站'],
    [/youtube\.com$|youtu\.be$/, 'YouTube'],
    [/douyin\.com$/, '抖音'],
    [/xiaohongshu\.com$|xhslink\.com$/, '小红书'],
    [/instagram\.com$/, 'Instagram'],
    [/tiktok\.com$/, 'TikTok'],
    [/(?:twitter|x)\.com$/, 'X / Twitter'],
    [/vimeo\.com$/, 'Vimeo']
  ]
  const platform = platforms.find(([pattern]) => pattern.test(host))?.[1]
  return {
    type: 'platform',
    url: parsed.toString(),
    platform: platform || '网页视频'
  }
}

function triggerDownload(url, filename) {
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename || ''
  anchor.target = '_blank'
  anchor.rel = 'noopener noreferrer'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
}

function buildCommand(url, system, useCookies) {
  const config = SYSTEMS[system]
  const cookieOption = useCookies ? ' --cookies-from-browser chrome' : ''
  return `yt-dlp${cookieOption} -f "bv*+ba/b" --merge-output-format mp4 --embed-metadata --embed-thumbnail ${config.folder} ${config.quote(url)}`
}

export default function VideoTool() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [system, setSystem] = useState('windows')
  const [useCookies, setUseCookies] = useState(false)
  const [notice, setNotice] = useState('')
  const classification = useMemo(() => classifyUrl(url.trim()), [url])
  const command = useMemo(
    () =>
      result?.type === 'platform'
        ? buildCommand(result.url, system, useCookies)
        : '',
    [result, system, useCookies]
  )

  const updateUrl = value => {
    setUrl(value)
    setResult(null)
    setError('')
  }

  const copy = async value => {
    try {
      await navigator.clipboard.writeText(value)
      setNotice('已复制')
    } catch {
      setNotice('复制失败，请手动选择')
    }
    window.setTimeout(() => setNotice(''), 1600)
  }

  const paste = async () => {
    try {
      updateUrl((await navigator.clipboard.readText()).trim())
    } catch {
      setError('无法读取剪贴板，请长按或按 Ctrl+V 粘贴网址')
    }
  }

  const analyse = () => {
    const next = classifyUrl(url.trim())
    setError('')
    if (next.type === 'invalid') {
      setResult(null)
      setError('请粘贴以 http:// 或 https:// 开头的完整视频网址')
      return
    }
    setResult(next)
  }

  const downloadTask = () => {
    if (!command) return
    const config = SYSTEMS[system]
    const content =
      system === 'windows'
        ? `@echo off\r\nchcp 65001 >nul\r\n${command}\r\necho.\r\necho 下载任务结束。\r\npause\r\n`
        : `#!/usr/bin/env bash\nset -e\n${command}\necho "下载任务结束。"\n`
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const blobUrl = URL.createObjectURL(blob)
    triggerDownload(blobUrl, `qcode-video-task.${config.extension}`)
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
  }

  return (
    <section className='relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.07)] dark:border-gray-700 dark:bg-[var(--heo-color-card-dark)] md:p-7'>
      <div className='absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-orange-400' />
      <div className='mb-5 flex items-start gap-3'>
        <span className='mt-1 h-8 w-1 shrink-0 rounded-full bg-[var(--heo-color-primary)]' />
        <div>
          <h2 className='text-xl font-black text-gray-900 dark:text-white md:text-2xl'>
            🎞️ 视频取件箱
          </h2>
          <p className='mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400'>
            视频直链直接保存；B站等平台生成本机最高画质下载任务，自动合并声音和画面。
          </p>
        </div>
      </div>

      <div className='rounded-2xl bg-gray-50 p-4 dark:bg-gray-900 md:p-5'>
        <label className='mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200'>
          视频网址
        </label>
        <div className='flex flex-col gap-2 sm:flex-row'>
          <input
            type='url'
            value={url}
            onChange={event => updateUrl(event.target.value)}
            onKeyDown={event => event.key === 'Enter' && analyse()}
            placeholder='粘贴 B站、YouTube、抖音或视频直链……'
            className='min-h-[48px] min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-[var(--heo-color-primary)] focus:ring-2 focus:ring-indigo-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-indigo-900'
          />
          <button
            type='button'
            onClick={() => void paste()}
            className='min-h-[48px] rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-600 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
          >
            粘贴
          </button>
          <button
            type='button'
            disabled={!url.trim()}
            onClick={analyse}
            className='min-h-[48px] rounded-xl bg-[var(--heo-color-primary)] px-5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50'
          >
            生成任务
          </button>
        </div>
        <div className='mt-3 flex flex-wrap gap-2 text-xs'>
          <span className='rounded-full bg-pink-50 px-3 py-1.5 font-bold text-pink-600 dark:bg-pink-950/30 dark:text-pink-300'>
            B站 · YouTube · 抖音等
          </span>
          <span className='rounded-full bg-blue-50 px-3 py-1.5 font-bold text-blue-600 dark:bg-blue-950/30 dark:text-blue-300'>
            MP4 · WebM · MOV 等直链
          </span>
          <span className='rounded-full bg-emerald-50 px-3 py-1.5 font-bold text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-300'>
            无需上传视频
          </span>
        </div>
      </div>

      {error && (
        <div className='mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300'>
          {error}
        </div>
      )}

      {result?.type === 'direct' && (
        <div className='mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 dark:border-emerald-900 dark:bg-emerald-950/20'>
          <div className='font-black text-gray-900 dark:text-white'>
            已识别为视频直链
          </div>
          <p className='mt-2 break-all text-xs leading-5 text-gray-500 dark:text-gray-400'>
            {result.url}
          </p>
          <button
            type='button'
            onClick={() => triggerDownload(result.url)}
            className='mt-4 min-h-[46px] rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md'
          >
            下载原始视频
          </button>
          <p className='mt-3 text-xs text-gray-500 dark:text-gray-400'>
            若浏览器打开播放页，请在视频菜单里选择“视频另存为”。
          </p>
        </div>
      )}

      {result?.type === 'platform' && (
        <div className='mt-5 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700'>
          <div className='bg-gradient-to-r from-indigo-50 to-orange-50 p-5 dark:from-indigo-950/30 dark:to-orange-950/20'>
            <div className='text-xs font-black uppercase tracking-[0.16em] text-[var(--heo-color-primary)]'>
              已识别 · {result.platform}
            </div>
            <h3 className='mt-2 text-lg font-black text-gray-900 dark:text-white'>
              在你的电脑本地下载最高可用画质
            </h3>
            <p className='mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300'>
              平台音视频通常分开传输，本机助手会自动选择最高画质、最高音质并合并成
              MP4。
            </p>
          </div>

          <div className='space-y-5 p-5'>
            <div>
              <div className='mb-2 text-sm font-black text-gray-800 dark:text-white'>
                1. 选择电脑系统
              </div>
              <div className='flex flex-wrap gap-2'>
                {Object.entries(SYSTEMS).map(([id, item]) => (
                  <button
                    key={id}
                    type='button'
                    onClick={() => setSystem(id)}
                    className={`min-h-[42px] rounded-xl px-4 text-sm font-bold transition ${system === id ? 'bg-[var(--heo-color-primary)] text-white' : 'border border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className='mb-2 text-sm font-black text-gray-800 dark:text-white'>
                2. 首次使用只需安装一次
              </div>
              <div className='flex gap-2 rounded-2xl bg-gray-950 p-3 text-gray-100'>
                <code className='min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-xs leading-7'>
                  {SYSTEMS[system].install}
                </code>
                <button
                  type='button'
                  onClick={() => void copy(SYSTEMS[system].install)}
                  className='flex-none rounded-lg bg-white/10 px-3 text-xs font-bold hover:bg-white/20'
                >
                  复制
                </button>
              </div>
            </div>

            <label className='flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-200 p-4 dark:border-gray-700'>
              <input
                type='checkbox'
                checked={useCookies}
                onChange={event => setUseCookies(event.target.checked)}
                className='mt-1 h-4 w-4 accent-[var(--heo-color-primary)]'
              />
              <span>
                <span className='block text-sm font-black text-gray-800 dark:text-white'>
                  使用 Chrome 登录状态获取登录专享画质
                </span>
                <span className='mt-1 block text-xs leading-5 text-gray-500 dark:text-gray-400'>
                  登录信息只由你电脑上的下载程序本地读取，不会发送给
                  qcode.im。会员和付费内容仍受原平台权限限制。
                </span>
              </span>
            </label>

            <div>
              <div className='mb-2 text-sm font-black text-gray-800 dark:text-white'>
                3. 开始下载
              </div>
              <div className='rounded-2xl bg-gray-950 p-3 text-gray-100'>
                <code className='block max-h-28 overflow-auto break-all text-xs leading-6'>
                  {command}
                </code>
              </div>
              <div className='mt-3 flex flex-wrap gap-2'>
                <button
                  type='button'
                  onClick={() => void copy(command)}
                  className='min-h-[46px] rounded-xl bg-[var(--heo-color-primary)] px-5 text-sm font-bold text-white shadow-sm'
                >
                  复制最高画质命令
                </button>
                <button
                  type='button'
                  onClick={downloadTask}
                  className='min-h-[46px] rounded-xl border border-gray-200 bg-gray-50 px-5 text-sm font-bold text-gray-700 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
                >
                  下载任务脚本
                </button>
              </div>
              <p className='mt-3 text-xs leading-5 text-gray-500 dark:text-gray-400'>
                安装完成后，可把命令粘贴到终端运行；
                {system === 'windows'
                  ? '也可以双击下载的任务脚本。'
                  : '任务脚本首次运行前需在终端执行 chmod +x。'}
                文件默认保存在“下载”文件夹。
              </p>
            </div>
          </div>
        </div>
      )}

      {!result && !error && (
        <div className='mt-5 grid gap-3 sm:grid-cols-3'>
          {[
            ['①', '复制网址', '从视频分享菜单复制完整链接'],
            ['②', '生成任务', '自动识别直链或视频平台'],
            ['③', '本地保存', '最高画质处理不经过博客服务器']
          ].map(([number, title, description]) => (
            <div
              key={title}
              className='rounded-2xl border border-dashed border-gray-200 p-4 dark:border-gray-700'
            >
              <div className='text-lg font-black text-[var(--heo-color-primary)]'>
                {number}
              </div>
              <div className='mt-1 text-sm font-black text-gray-800 dark:text-white'>
                {title}
              </div>
              <div className='mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400'>
                {description}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className='mt-5 text-center text-xs leading-5 text-gray-400'>
        请只下载你本人拥有、已获授权或平台明确允许保存的视频。
        {classification.type === 'platform' && ' 平台支持情况会随规则变化。'}
      </p>
      {notice && (
        <div className='fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gray-900 px-5 py-3 text-sm font-bold text-white shadow-xl dark:bg-white dark:text-gray-900'>
          {notice}
        </div>
      )}
    </section>
  )
}

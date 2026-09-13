import { useEffect, useMemo, useRef, useState } from 'react'
import NetworkTool from './NetworkTool'
import VideoTool from './VideoTool'

const TOOL_CARDS = [
  {
    id: 'network',
    icon: '🌐',
    title: '网络工程箱',
    description: '计算 IPv4 子网、掩码、地址范围并规划主机容量。',
    category: '网络',
    features: ['子网计算', '主机规划', 'CIDR 速查'],
    featured: true
  },
  {
    id: 'password',
    icon: '🔐',
    title: '口令铸造炉',
    description: '按规则生成高强度随机密码。',
    category: '安全'
  },
  {
    id: 'image',
    icon: '🗜️',
    title: '图片缩骨功',
    description: '本地压缩图片并转换 JPG、PNG、WebP。',
    category: '图片'
  },
  {
    id: 'classroom',
    icon: '🎲',
    title: '课堂点将台',
    description: '随机点名，或把名单快速随机分组。',
    category: '教学'
  },
  {
    id: 'video',
    icon: '🎞️',
    title: '视频取件箱',
    description: '视频直链直接保存，为 B站等平台生成兼容或极致画质下载任务。',
    category: '视频'
  }
]

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB'
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function Section({ title, hint, children }) {
  return (
    <section className='relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.07)] dark:border-gray-700 dark:bg-[var(--heo-color-card-dark)] md:p-7'>
      <div className='absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-orange-400' />
      <div className='mb-5 flex items-start gap-3'>
        <span className='mt-1 h-8 w-1 shrink-0 rounded-full bg-[var(--heo-color-primary)]' />
        <div>
          <h2 className='text-xl font-black text-gray-900 dark:text-white md:text-2xl'>
            {title}
          </h2>
          {hint && (
            <p className='mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400'>
              {hint}
            </p>
          )}
        </div>
      </div>
      {children}
    </section>
  )
}

function ActionButton({
  children,
  onClick,
  primary = false,
  disabled = false
}) {
  return (
    <button
      type='button'
      disabled={disabled}
      onClick={onClick}
      className={`min-h-[44px] rounded-xl px-4 py-2.5 text-sm font-bold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 ${
        primary
          ? 'bg-[var(--heo-color-primary)] text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md'
          : 'border border-gray-200 bg-gray-50 text-gray-700 hover:border-[var(--heo-color-primary)] hover:text-[var(--heo-color-primary)] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
      }`}
    >
      {children}
    </button>
  )
}

function TextArea({ value, onChange, placeholder, rows = 9 }) {
  return (
    <textarea
      value={value}
      onChange={event => onChange(event.target.value)}
      placeholder={placeholder}
      rows={rows}
      spellCheck={false}
      className='w-full resize-y rounded-2xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm leading-6 text-gray-800 outline-none transition focus:border-[var(--heo-color-primary)] focus:ring-2 focus:ring-indigo-100 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-indigo-900'
    />
  )
}

function PasswordTool({ copy }) {
  const [length, setLength] = useState(18)
  const [sets, setSets] = useState({
    lower: true,
    upper: true,
    number: true,
    symbol: true
  })
  const [password, setPassword] = useState('')

  const pools = {
    lower: 'abcdefghijkmnopqrstuvwxyz',
    upper: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
    number: '23456789',
    symbol: '!@#$%^&*_-+=?'
  }
  const enabledSets = Object.keys(sets).filter(key => sets[key])
  const poolLength = enabledSets.reduce(
    (total, key) => total + pools[key].length,
    0
  )
  const entropy = poolLength ? Math.floor(length * Math.log2(poolLength)) : 0
  const strength =
    entropy >= 100
      ? { label: '很强', width: '100%', color: 'bg-emerald-500' }
      : entropy >= 70
        ? { label: '强', width: '75%', color: 'bg-blue-500' }
        : entropy >= 45
          ? { label: '一般', width: '50%', color: 'bg-amber-500' }
          : { label: '较弱', width: '25%', color: 'bg-red-500' }

  const generate = () => {
    const enabled = Object.keys(sets).filter(key => sets[key])
    if (!enabled.length) return setPassword('请至少选择一类字符')
    const pool = enabled.map(key => pools[key]).join('')
    const random = new Uint32Array(length)
    window.crypto.getRandomValues(random)
    const mandatory = enabled.map(
      (key, index) => pools[key][random[index] % pools[key].length]
    )
    const rest = Array.from(
      { length: Math.max(0, length - mandatory.length) },
      (_, index) => pool[random[index + mandatory.length] % pool.length]
    )
    const combined = [...mandatory, ...rest]
    for (let i = combined.length - 1; i > 0; i--) {
      const j = random[i % random.length] % (i + 1)
      ;[combined[i], combined[j]] = [combined[j], combined[i]]
    }
    setPassword(combined.join(''))
  }

  return (
    <Section
      title='🔐 口令铸造炉'
      hint='使用浏览器安全随机数生成；不会保存、上传或记录密码。'
    >
      <div className='rounded-2xl bg-gray-50 p-4 dark:bg-gray-900'>
        <div className='break-all rounded-xl border border-gray-200 bg-white p-4 font-mono text-lg font-bold text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-white'>
          {password || '点击“生成新密码”开始'}
        </div>
        <div className='mt-5'>
          <div className='mb-2 flex justify-between text-sm font-bold text-gray-700 dark:text-gray-200'>
            <span>长度</span>
            <span>{length}</span>
          </div>
          <input
            type='range'
            min='8'
            max='64'
            value={length}
            onChange={event => {
              setLength(Number(event.target.value))
              setPassword('')
            }}
            className='w-full accent-indigo-600'
          />
          <div className='mt-3 flex items-center gap-3'>
            <div className='h-2 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700'>
              <div
                className={`h-full rounded-full transition-all ${strength.color}`}
                style={{ width: strength.width }}
              />
            </div>
            <span className='min-w-[6rem] text-right text-xs font-bold text-gray-500 dark:text-gray-400'>
              {strength.label} · 约 {entropy} bit
            </span>
          </div>
        </div>
        <div className='mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4'>
          {[
            ['lower', '小写字母'],
            ['upper', '大写字母'],
            ['number', '数字'],
            ['symbol', '符号']
          ].map(([key, label]) => (
            <label
              key={key}
              className='flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
            >
              <input
                type='checkbox'
                checked={sets[key]}
                onChange={() => {
                  setSets(current => ({ ...current, [key]: !current[key] }))
                  setPassword('')
                }}
                className='accent-indigo-600'
              />
              {label}
            </label>
          ))}
        </div>
        <div className='mt-5 flex flex-wrap gap-2'>
          <ActionButton primary onClick={generate}>
            生成新密码
          </ActionButton>
          <ActionButton disabled={!password} onClick={() => copy(password)}>
            复制密码
          </ActionButton>
        </div>
      </div>
    </Section>
  )
}

function ImageTool() {
  const inputRef = useRef(null)
  const objectUrlsRef = useRef(new Set())
  const [source, setSource] = useState(null)
  const [result, setResult] = useState(null)
  const [quality, setQuality] = useState(82)
  const [format, setFormat] = useState('image/webp')
  const [maxWidth, setMaxWidth] = useState(1920)
  const [message, setMessage] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(
    () => () => {
      objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url))
      objectUrlsRef.current.clear()
    },
    []
  )

  const createLocalUrl = value => {
    const url = URL.createObjectURL(value)
    objectUrlsRef.current.add(url)
    return url
  }

  const revokeLocalUrl = url => {
    if (!url) return
    URL.revokeObjectURL(url)
    objectUrlsRef.current.delete(url)
  }

  const loadFile = file => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setMessage('请选择图片文件')
      return
    }
    revokeLocalUrl(source?.url)
    revokeLocalUrl(result?.url)
    setSource({ file, url: createLocalUrl(file) })
    setResult(null)
    setMessage('图片只在当前浏览器中处理，不会上传。')
  }

  const chooseFile = event => {
    loadFile(event.target.files?.[0])
    event.target.value = ''
  }

  const clearProcessedResult = () => {
    revokeLocalUrl(result?.url)
    setResult(null)
    if (source) setMessage('参数已改变，请重新处理图片。')
  }

  const compress = () => {
    if (!source) return
    setProcessing(true)
    setMessage('正在处理图片……')
    const image = new Image()
    image.onload = () => {
      const ratio = Math.min(1, maxWidth / image.naturalWidth)
      const width = Math.max(1, Math.round(image.naturalWidth * ratio))
      const height = Math.max(1, Math.round(image.naturalHeight * ratio))
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const context = canvas.getContext('2d')
      if (format === 'image/jpeg') {
        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, width, height)
      }
      context.drawImage(image, 0, 0, width, height)
      canvas.toBlob(
        blob => {
          if (!blob) {
            setProcessing(false)
            return setMessage('当前浏览器无法生成该格式，请换一种格式重试。')
          }
          revokeLocalUrl(result?.url)
          const extension = format.split('/')[1].replace('jpeg', 'jpg')
          setResult({
            blob,
            url: createLocalUrl(blob),
            width,
            height,
            extension
          })
          const saved = source.file.size
            ? Math.round((1 - blob.size / source.file.size) * 100)
            : 0
          setMessage(
            saved > 0
              ? `处理完成，体积减少约 ${saved}%`
              : '处理完成；这张图片已经很紧凑，转换后体积可能略有增加。'
          )
          setProcessing(false)
        },
        format,
        quality / 100
      )
    }
    image.onerror = () => {
      setProcessing(false)
      setMessage('图片读取失败，请换一张图片重试。')
    }
    image.src = source.url
  }

  const download = () => {
    if (!result) return
    const link = document.createElement('a')
    const baseName = source.file.name.replace(/\.[^.]+$/, '')
    link.href = result.url
    link.download = `${baseName}-qcode.${result.extension}`
    link.click()
    link.remove()
  }

  return (
    <Section
      title='🗜️ 图片缩骨功'
      hint='在本地完成压缩、缩放和格式转换，适合文章配图、头像和网页素材。'
    >
      <input
        ref={inputRef}
        type='file'
        accept='image/*'
        onChange={chooseFile}
        className='hidden'
      />
      <div className='grid gap-5 lg:grid-cols-[1.2fr_1fr]'>
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={event => event.preventDefault()}
          onDrop={event => {
            event.preventDefault()
            loadFile(event.dataTransfer.files?.[0])
          }}
          className='flex min-h-[18rem] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center transition hover:border-[var(--heo-color-primary)] dark:border-gray-600 dark:bg-gray-900'
        >
          {source ? (
            <img
              src={result?.url || source.url}
              alt='本地图片预览'
              className='max-h-[28rem] max-w-full rounded-xl object-contain'
            />
          ) : (
            <div>
              <div className='text-5xl'>🖼️</div>
              <div className='mt-3 font-bold text-gray-700 dark:text-gray-200'>
                点击选择或拖入图片
              </div>
              <div className='mt-1 text-sm text-gray-400'>
                JPG、PNG、WebP 等常见格式
              </div>
            </div>
          )}
        </div>
        <div className='space-y-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-900'>
          <label className='block text-sm font-bold text-gray-700 dark:text-gray-200'>
            输出格式
            <select
              value={format}
              onChange={event => {
                setFormat(event.target.value)
                clearProcessedResult()
              }}
              className='mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 dark:border-gray-600 dark:bg-gray-800'
            >
              <option value='image/webp'>WebP（推荐）</option>
              <option value='image/jpeg'>JPG</option>
              <option value='image/png'>PNG</option>
            </select>
          </label>
          <label className='block text-sm font-bold text-gray-700 dark:text-gray-200'>
            最大宽度
            <select
              value={maxWidth}
              onChange={event => {
                setMaxWidth(Number(event.target.value))
                clearProcessedResult()
              }}
              className='mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 dark:border-gray-600 dark:bg-gray-800'
            >
              <option value='1280'>1280 px</option>
              <option value='1920'>1920 px</option>
              <option value='2560'>2560 px</option>
              <option value='4096'>保留大图（最大 4096 px）</option>
            </select>
          </label>
          <label className='block text-sm font-bold text-gray-700 dark:text-gray-200'>
            质量：{quality}%
            <input
              type='range'
              min='35'
              max='100'
              value={quality}
              onChange={event => {
                setQuality(Number(event.target.value))
                clearProcessedResult()
              }}
              className='mt-3 w-full accent-indigo-600'
            />
          </label>
          {source && (
            <div className='rounded-xl border border-gray-200 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'>
              <div>原图：{formatBytes(source.file.size)}</div>
              {result && (
                <div className='mt-1'>
                  结果：{formatBytes(result.blob.size)} · {result.width}×
                  {result.height}
                </div>
              )}
            </div>
          )}
          <div className='flex flex-wrap gap-2'>
            <ActionButton
              primary
              disabled={!source || processing}
              onClick={compress}
            >
              {processing ? '正在处理…' : '开始处理'}
            </ActionButton>
            <ActionButton disabled={!result} onClick={download}>
              下载结果
            </ActionButton>
          </div>
        </div>
      </div>
      {message && (
        <div className='mt-4 rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-200'>
          {message}
        </div>
      )}
    </Section>
  )
}

function ClassroomTool({ copy }) {
  const [names, setNames] = useState('')
  const [groupCount, setGroupCount] = useState(4)
  const [result, setResult] = useState([])
  const list = useMemo(
    () =>
      names
        .split(/[\n,，、]+/)
        .map(name => name.trim())
        .filter(Boolean),
    [names]
  )
  const duplicateCount = list.length - new Set(list).size

  useEffect(() => setResult([]), [names])

  const shuffled = () => {
    const next = [...list]
    const random = new Uint32Array(Math.max(1, next.length))
    window.crypto.getRandomValues(random)
    for (let i = next.length - 1; i > 0; i--) {
      const j = random[i] % (i + 1)
      ;[next[i], next[j]] = [next[j], next[i]]
    }
    return next
  }

  const pickOne = () => {
    if (!list.length) return setResult([])
    setResult([[shuffled()[0]]])
  }

  const makeGroups = () => {
    if (!list.length) return setResult([])
    const count = Math.min(Math.max(1, groupCount), list.length)
    const groups = Array.from({ length: count }, () => [])
    shuffled().forEach((name, index) => groups[index % count].push(name))
    setResult(groups)
  }

  const resultText = result
    .map((group, index) =>
      result.length === 1
        ? group.join('、')
        : `第 ${index + 1} 组：${group.join('、')}`
    )
    .join('\n')

  return (
    <Section
      title='🎲 课堂点将台'
      hint='支持换行、逗号和顿号分隔名单；随机过程在本地完成。'
    >
      <div className='grid gap-5 lg:grid-cols-[1fr_1.1fr]'>
        <div>
          <TextArea
            value={names}
            onChange={setNames}
            placeholder={'每行输入一个名字，例如：\n小橙\n小星\n小球'}
            rows={12}
          />
          <div className='mt-3 flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 text-sm dark:bg-gray-900 dark:text-gray-200'>
            <span>
              名单共 <b>{list.length}</b> 人
            </span>
            <label className='ml-auto flex items-center gap-2'>
              分成
              <input
                type='number'
                min='1'
                max='50'
                value={groupCount}
                onChange={event => setGroupCount(Number(event.target.value))}
                className='w-16 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-center dark:border-gray-600 dark:bg-gray-800'
              />
              组
            </label>
          </div>
          {duplicateCount > 0 && (
            <div className='mt-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-300'>
              检测到 {duplicateCount}{' '}
              个重复名字；为避免同名同学被漏掉，当前仍按原名单参与随机。
            </div>
          )}
          <div className='mt-4 flex flex-wrap gap-2'>
            <ActionButton primary disabled={!list.length} onClick={pickOne}>
              随机点一位
            </ActionButton>
            <ActionButton disabled={!list.length} onClick={makeGroups}>
              随机分组
            </ActionButton>
            <ActionButton
              disabled={!result.length}
              onClick={() => copy(resultText)}
            >
              复制结果
            </ActionButton>
          </div>
        </div>
        <div className='min-h-[18rem] rounded-2xl bg-gray-50 p-4 dark:bg-gray-900'>
          {!result.length ? (
            <div className='flex h-full min-h-[15rem] items-center justify-center text-center text-gray-400'>
              结果会显示在这里
              <br />
              重复操作会重新随机
            </div>
          ) : (
            <div className='grid gap-3 sm:grid-cols-2'>
              {result.map((group, index) => (
                <div
                  key={index}
                  className='rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-600 dark:bg-gray-800'
                >
                  <div className='mb-2 text-sm font-black text-[var(--heo-color-primary)]'>
                    {result.length === 1 ? '本次点名' : `第 ${index + 1} 组`}
                  </div>
                  <div className='leading-7 text-gray-800 dark:text-gray-100'>
                    {group.join('、')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Section>
  )
}

export default function DaVinciToolbox() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('全部')
  const [active, setActive] = useState('network')
  const [notice, setNotice] = useState('')
  const toolAreaRef = useRef(null)
  const categories = ['全部', ...new Set(TOOL_CARDS.map(tool => tool.category))]

  useEffect(() => {
    const syncToolFromLocation = () => {
      const hashTool = window.location.hash.replace(/^#tool=/, '')
      const savedTool = window.localStorage.getItem('qcode-last-tool')
      const nextTool = TOOL_CARDS.some(tool => tool.id === hashTool)
        ? hashTool
        : TOOL_CARDS.some(tool => tool.id === savedTool)
          ? savedTool
          : null
      if (nextTool) setActive(nextTool)
    }
    syncToolFromLocation()
    window.addEventListener('hashchange', syncToolFromLocation)
    return () => window.removeEventListener('hashchange', syncToolFromLocation)
  }, [])

  const filteredTools = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return TOOL_CARDS.filter(tool => {
      const inCategory = category === '全部' || tool.category === category
      const inSearch =
        !keyword ||
        `${tool.title}${tool.description}${tool.category}`
          .toLowerCase()
          .includes(keyword)
      return inCategory && inSearch
    })
  }, [category, query])

  const copy = async value => {
    if (!value) return
    const fallbackCopy = () => {
      const textarea = document.createElement('textarea')
      textarea.value = value
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      const copied = document.execCommand('copy')
      textarea.remove()
      if (!copied) throw new Error('copy failed')
    }
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value)
      } else {
        fallbackCopy()
      }
      setNotice('已复制到剪贴板')
    } catch {
      try {
        fallbackCopy()
        setNotice('已复制到剪贴板')
      } catch {
        setNotice('复制失败，请手动选择内容复制')
      }
    }
    window.setTimeout(() => setNotice(''), 1800)
  }

  const openTool = id => {
    setActive(id)
    window.localStorage.setItem('qcode-last-tool', id)
    const url = new URL(window.location.href)
    url.hash = `tool=${id}`
    window.history.replaceState(window.history.state, '', url)
    window.setTimeout(
      () =>
        toolAreaRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        }),
      30
    )
  }

  const toolPanels = {
    network: <NetworkTool copy={copy} />,
    password: <PasswordTool copy={copy} />,
    image: <ImageTool />,
    classroom: <ClassroomTool copy={copy} />,
    video: <VideoTool />
  }

  return (
    <div className='mx-auto w-full max-w-6xl px-4 pb-16 pt-8 md:px-6 md:pt-12'>
      <header className='relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-orange-400 px-6 py-10 text-white shadow-[0_24px_70px_rgba(79,70,229,0.28)] md:px-10 md:py-14'>
        <div className='absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:32px_32px]' />
        <div className='absolute -right-12 -top-16 h-56 w-56 rounded-full bg-white/15 blur-2xl' />
        <div className='absolute -bottom-20 left-1/3 h-44 w-44 rounded-full bg-orange-200/20 blur-2xl' />
        <div className='relative max-w-3xl'>
          <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-xs font-bold backdrop-blur'>
            <span>🍊</span> QCODE LAB · 全部免费
          </div>
          <h1 className='text-3xl font-black leading-tight md:text-5xl'>
            达闻西实用工具箱
          </h1>
          <p className='mt-4 max-w-2xl text-sm leading-7 text-white/85 md:text-base'>
            不一定改变世界，但可能刚好有用。工具按场景组成套件，全部在浏览器本地运行，不上传你的文字、名单、密码、图片和网络配置。
          </p>
          <div className='mt-6 flex flex-wrap gap-3 text-xs font-bold text-white/90'>
            <span className='rounded-full bg-black/15 px-3 py-2'>
              ✓ 无需登录
            </span>
            <span className='rounded-full bg-black/15 px-3 py-2'>
              ✓ 无需付费
            </span>
            <span className='rounded-full bg-black/15 px-3 py-2'>
              ✓ 本地处理
            </span>
            <span className='rounded-full bg-black/15 px-3 py-2'>
              ✓ 套件式设计
            </span>
          </div>
        </div>
      </header>

      <section className='mt-8'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div>
            <h2 className='text-2xl font-black text-gray-900 dark:text-white'>
              选择一件装备
            </h2>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              现有 {TOOL_CARDS.length} 套工具，功能集中归类，用完即走。
            </p>
          </div>
          <div className='relative w-full md:w-80'>
            <i className='fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder='搜索工具或用途'
              className='h-12 w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-11 text-sm outline-none transition focus:border-[var(--heo-color-primary)] focus:ring-2 focus:ring-indigo-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-indigo-900'
            />
            {query && (
              <button
                type='button'
                onClick={() => setQuery('')}
                aria-label='清除搜索'
                className='absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white'
              >
                ×
              </button>
            )}
          </div>
        </div>
        <div className='mt-4 flex snap-x gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
          {categories.map(item => (
            <button
              key={item}
              type='button'
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={`min-h-[42px] snap-start whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${category === item ? 'bg-[var(--heo-color-primary)] text-white shadow' : 'border border-gray-200 bg-white text-gray-600 hover:border-[var(--heo-color-primary)] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className='mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {filteredTools.map(tool => (
            <button
              key={tool.id}
              type='button'
              onClick={() => openTool(tool.id)}
              aria-pressed={active === tool.id}
              className={`group relative min-h-[242px] overflow-hidden rounded-3xl border p-5 text-left transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 hover:-translate-y-1 hover:shadow-lg ${active === tool.id ? 'border-[var(--heo-color-primary)] bg-indigo-50/70 shadow-md dark:bg-indigo-950/20' : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-[var(--heo-color-card-dark)]'}`}
            >
              {tool.featured && (
                <span className='absolute right-0 top-0 rounded-bl-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-3 py-1.5 text-[11px] font-black text-white'>
                  推荐套件
                </span>
              )}
              <div className='flex items-start justify-between gap-4'>
                <span className='flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-2xl transition group-hover:rotate-6 group-hover:scale-110 dark:bg-gray-800'>
                  {tool.icon}
                </span>
                <span
                  className={`rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-500 dark:bg-gray-800 dark:text-gray-400 ${tool.featured ? 'mr-16' : ''}`}
                >
                  {tool.features
                    ? `${tool.features.length} 项功能`
                    : tool.category}
                </span>
              </div>
              <h3 className='mt-4 text-lg font-black text-gray-900 dark:text-white'>
                {tool.title}
              </h3>
              <p className='mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400'>
                {tool.description}
              </p>
              {tool.features && (
                <div className='mt-3 flex flex-wrap gap-1.5'>
                  {tool.features.map(feature => (
                    <span
                      key={feature}
                      className='rounded-lg bg-sky-50 px-2 py-1 text-[11px] font-bold text-sky-700 dark:bg-sky-950/40 dark:text-sky-300'
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              )}
              <div className='mt-4 text-sm font-bold text-[var(--heo-color-primary)]'>
                立即使用{' '}
                <span className='inline-block transition group-hover:translate-x-1'>
                  →
                </span>
              </div>
            </button>
          ))}
        </div>
        {!filteredTools.length && (
          <div className='mt-5 rounded-2xl border border-dashed border-gray-300 py-12 text-center text-gray-400 dark:border-gray-600'>
            没有找到对应工具，换个关键词试试。
          </div>
        )}
      </section>

      <div ref={toolAreaRef} className='scroll-mt-24 mt-10'>
        <div className='mb-3 flex items-center justify-between gap-3 px-1'>
          <div className='text-sm font-bold text-gray-500 dark:text-gray-400'>
            正在使用：
            <span className='text-gray-900 dark:text-white'>
              {TOOL_CARDS.find(tool => tool.id === active)?.title}
            </span>
          </div>
          <button
            type='button'
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className='min-h-[40px] rounded-xl border border-gray-200 bg-white px-3 text-xs font-bold text-gray-500 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
          >
            ↑ 返回工具列表
          </button>
        </div>
        {Object.entries(toolPanels).map(([id, panel]) => (
          <div key={id} hidden={active !== id} aria-hidden={active !== id}>
            {panel}
          </div>
        ))}
      </div>

      <section className='mt-8 rounded-3xl border border-dashed border-orange-300 bg-orange-50/70 p-6 text-center dark:border-orange-800 dark:bg-orange-950/20'>
        <div className='text-3xl'>🧰</div>
        <h2 className='mt-2 text-lg font-black text-gray-900 dark:text-white'>
          工具会继续增加
        </h2>
        <p className='mx-auto mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-300'>
          后续功能优先收进现有套件，例如网络工程箱可继续加入 DNS、端口与 IPv6
          辅助，保持入口少、能力完整、无需付费。
        </p>
      </section>

      {notice && (
        <div className='fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gray-900 px-5 py-3 text-sm font-bold text-white shadow-xl dark:bg-white dark:text-gray-900'>
          {notice}
        </div>
      )}
    </div>
  )
}

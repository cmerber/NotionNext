import { useEffect, useMemo, useRef, useState } from 'react'

const TOOL_CARDS = [
  {
    id: 'json',
    icon: '🪞',
    title: 'JSON 照妖镜',
    description: '格式化、压缩并定位 JSON 语法错误。',
    category: '开发'
  },
  {
    id: 'text',
    icon: '🧹',
    title: '文本清理器',
    description: '统计字数、去重、去空行和整理空格。',
    category: '文本'
  },
  {
    id: 'time',
    icon: '⏱️',
    title: '时空换算器',
    description: '时间戳与本地日期双向转换。',
    category: '时间'
  },
  {
    id: 'codec',
    icon: '🧬',
    title: '编码转换器',
    description: 'URL 与 Base64 编码、解码。',
    category: '开发'
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
  }
]

const encoder = typeof TextEncoder === 'undefined' ? null : new TextEncoder()
const decoder = typeof TextDecoder === 'undefined' ? null : new TextDecoder()

function bytesToBase64(value) {
  if (!encoder) return ''
  const bytes = encoder.encode(value)
  let binary = ''
  bytes.forEach(byte => {
    binary += String.fromCharCode(byte)
  })
  return window.btoa(binary)
}

function base64ToText(value) {
  if (!decoder) return ''
  const binary = window.atob(value.trim())
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0))
  return decoder.decode(bytes)
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB'
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function nowForDateTimeInput() {
  const date = new Date()
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16)
}

function Section({ title, hint, children }) {
  return (
    <section className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-[var(--heo-color-card-dark)] md:p-7'>
      <div className='mb-5'>
        <h2 className='text-xl font-black text-gray-900 dark:text-white md:text-2xl'>
          {title}
        </h2>
        {hint && (
          <p className='mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400'>
            {hint}
          </p>
        )}
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
      className={`rounded-xl px-4 py-2.5 text-sm font-bold transition duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
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

function JsonTool({ copy }) {
  const [input, setInput] = useState('')
  const [message, setMessage] = useState('')

  const transform = compact => {
    try {
      const parsed = JSON.parse(input)
      setInput(JSON.stringify(parsed, null, compact ? 0 : 2))
      setMessage(compact ? '已压缩 JSON' : '格式正确，已完成格式化')
    } catch (error) {
      setMessage(`语法错误：${error.message}`)
    }
  }

  return (
    <Section
      title='🪞 JSON 照妖镜'
      hint='适合整理接口返回、配置文件和调试数据。内容不会离开当前浏览器。'
    >
      <TextArea
        value={input}
        onChange={setInput}
        placeholder='粘贴 JSON，例如：{"name":"橙子星球","useful":true}'
        rows={13}
      />
      <div className='mt-4 flex flex-wrap gap-2'>
        <ActionButton primary onClick={() => transform(false)}>
          格式化并校验
        </ActionButton>
        <ActionButton onClick={() => transform(true)}>压缩成一行</ActionButton>
        <ActionButton onClick={() => copy(input)}>复制结果</ActionButton>
        <ActionButton
          onClick={() => {
            setInput('')
            setMessage('')
          }}
        >
          清空
        </ActionButton>
      </div>
      {message && (
        <div
          className={`mt-4 rounded-xl px-4 py-3 text-sm ${message.startsWith('语法错误') ? 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-300' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'}`}
        >
          {message}
        </div>
      )}
    </Section>
  )
}

function TextTool({ copy }) {
  const [text, setText] = useState('')
  const stats = useMemo(() => {
    const trimmed = text.trim()
    const chinese = (text.match(/[\u3400-\u9fff]/g) || []).length
    const words = (trimmed.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) || [])
      .length
    return {
      characters: text.length,
      noSpaces: text.replace(/\s/g, '').length,
      paragraphs: trimmed ? text.split(/\n\s*\n/).filter(Boolean).length : 0,
      lines: text ? text.split(/\r?\n/).length : 0,
      reading: Math.max(1, Math.ceil((chinese + words) / 350))
    }
  }, [text])

  const clean = mode => {
    const lines = text.split(/\r?\n/)
    if (mode === 'duplicate') {
      const seen = new Set()
      setText(
        lines
          .filter(line => {
            const key = line.trim()
            if (seen.has(key)) return false
            seen.add(key)
            return true
          })
          .join('\n')
      )
    }
    if (mode === 'blank') setText(lines.filter(line => line.trim()).join('\n'))
    if (mode === 'space') {
      setText(lines.map(line => line.trim().replace(/[ \t]+/g, ' ')).join('\n'))
    }
  }

  return (
    <Section
      title='🧹 文本清理器'
      hint='写作、名单和表格粘贴内容都可以在这里快速整理。'
    >
      <div className='mb-4 grid grid-cols-2 gap-2 sm:grid-cols-5'>
        {[
          ['字符', stats.characters],
          ['不含空格', stats.noSpaces],
          ['行数', stats.lines],
          ['段落', stats.paragraphs],
          ['阅读约', `${stats.reading} 分钟`]
        ].map(([label, value]) => (
          <div
            key={label}
            className='rounded-2xl bg-gray-50 px-3 py-3 text-center dark:bg-gray-800'
          >
            <div className='text-lg font-black text-gray-900 dark:text-white'>
              {value}
            </div>
            <div className='text-xs text-gray-500 dark:text-gray-400'>
              {label}
            </div>
          </div>
        ))}
      </div>
      <TextArea
        value={text}
        onChange={setText}
        placeholder='粘贴需要统计或整理的文字……'
        rows={12}
      />
      <div className='mt-4 flex flex-wrap gap-2'>
        <ActionButton primary onClick={() => clean('space')}>
          整理空格
        </ActionButton>
        <ActionButton onClick={() => clean('blank')}>删除空行</ActionButton>
        <ActionButton onClick={() => clean('duplicate')}>按行去重</ActionButton>
        <ActionButton onClick={() => copy(text)}>复制结果</ActionButton>
        <ActionButton onClick={() => setText('')}>清空</ActionButton>
      </div>
    </Section>
  )
}

function TimeTool({ copy }) {
  const [stamp, setStamp] = useState('')
  const [dateValue, setDateValue] = useState('')

  useEffect(() => {
    setStamp(String(Date.now()))
    setDateValue(nowForDateTimeInput())
  }, [])

  const parsedStamp = useMemo(() => {
    const numeric = Number(stamp)
    if (!Number.isFinite(numeric)) return null
    const milliseconds =
      Math.abs(numeric) < 100000000000 ? numeric * 1000 : numeric
    const date = new Date(milliseconds)
    return Number.isNaN(date.getTime()) ? null : date
  }, [stamp])

  const dateStamp = useMemo(() => {
    const date = new Date(dateValue)
    if (Number.isNaN(date.getTime())) return null
    return {
      seconds: Math.floor(date.getTime() / 1000),
      milliseconds: date.getTime()
    }
  }, [dateValue])

  return (
    <Section
      title='⏱️ 时空换算器'
      hint='自动识别秒级或毫秒级时间戳，结果按你电脑的本地时区显示。'
    >
      <div className='grid gap-5 lg:grid-cols-2'>
        <div className='rounded-2xl bg-gray-50 p-4 dark:bg-gray-900'>
          <label className='mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200'>
            时间戳 → 日期
          </label>
          <input
            value={stamp}
            onChange={event => setStamp(event.target.value)}
            className='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-mono outline-none focus:border-[var(--heo-color-primary)] dark:border-gray-600 dark:bg-gray-800 dark:text-white'
          />
          <div className='mt-3 min-h-[4rem] rounded-xl border border-dashed border-gray-300 p-3 text-sm text-gray-600 dark:border-gray-600 dark:text-gray-300'>
            {parsedStamp ? (
              <>
                <div>{parsedStamp.toLocaleString()}</div>
                <div className='mt-1 text-xs text-gray-400'>
                  {parsedStamp.toISOString()}
                </div>
              </>
            ) : (
              '请输入有效时间戳'
            )}
          </div>
          <div className='mt-3 flex gap-2'>
            <ActionButton onClick={() => setStamp(String(Date.now()))}>
              现在
            </ActionButton>
            <ActionButton
              onClick={() => parsedStamp && copy(parsedStamp.toLocaleString())}
            >
              复制日期
            </ActionButton>
          </div>
        </div>
        <div className='rounded-2xl bg-gray-50 p-4 dark:bg-gray-900'>
          <label className='mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200'>
            日期 → 时间戳
          </label>
          <input
            type='datetime-local'
            value={dateValue}
            onChange={event => setDateValue(event.target.value)}
            className='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[var(--heo-color-primary)] dark:border-gray-600 dark:bg-gray-800 dark:text-white'
          />
          <div className='mt-3 space-y-2 rounded-xl border border-dashed border-gray-300 p-3 font-mono text-sm text-gray-600 dark:border-gray-600 dark:text-gray-300'>
            <div>秒：{dateStamp?.seconds ?? '—'}</div>
            <div>毫秒：{dateStamp?.milliseconds ?? '—'}</div>
          </div>
          <div className='mt-3 flex flex-wrap gap-2'>
            <ActionButton
              onClick={() => dateStamp && copy(String(dateStamp.seconds))}
            >
              复制秒
            </ActionButton>
            <ActionButton
              onClick={() => dateStamp && copy(String(dateStamp.milliseconds))}
            >
              复制毫秒
            </ActionButton>
          </div>
        </div>
      </div>
    </Section>
  )
}

function CodecTool({ copy }) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const run = operation => {
    try {
      const actions = {
        urlEncode: () => encodeURIComponent(input),
        urlDecode: () => decodeURIComponent(input),
        base64Encode: () => bytesToBase64(input),
        base64Decode: () => base64ToText(input)
      }
      setOutput(actions[operation]())
      setError('')
    } catch (err) {
      setError(`转换失败：${err.message}`)
    }
  }

  return (
    <Section title='🧬 编码转换器' hint='支持中文的 URL 与 Base64 双向转换。'>
      <div className='grid gap-4 lg:grid-cols-2'>
        <TextArea
          value={input}
          onChange={setInput}
          placeholder='输入原始内容或已编码内容……'
          rows={10}
        />
        <TextArea
          value={output}
          onChange={setOutput}
          placeholder='转换结果会显示在这里……'
          rows={10}
        />
      </div>
      <div className='mt-4 flex flex-wrap gap-2'>
        <ActionButton primary onClick={() => run('urlEncode')}>
          URL 编码
        </ActionButton>
        <ActionButton onClick={() => run('urlDecode')}>URL 解码</ActionButton>
        <ActionButton onClick={() => run('base64Encode')}>
          Base64 编码
        </ActionButton>
        <ActionButton onClick={() => run('base64Decode')}>
          Base64 解码
        </ActionButton>
        <ActionButton onClick={() => copy(output)}>复制结果</ActionButton>
      </div>
      {error && (
        <div className='mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-300'>
          {error}
        </div>
      )}
    </Section>
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

  const generate = () => {
    const pools = {
      lower: 'abcdefghijkmnopqrstuvwxyz',
      upper: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
      number: '23456789',
      symbol: '!@#$%^&*_-+=?'
    }
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
            onChange={event => setLength(Number(event.target.value))}
            className='w-full accent-indigo-600'
          />
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
                onChange={() =>
                  setSets(current => ({ ...current, [key]: !current[key] }))
                }
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
          <ActionButton onClick={() => copy(password)}>复制密码</ActionButton>
        </div>
      </div>
    </Section>
  )
}

function ImageTool() {
  const inputRef = useRef(null)
  const [source, setSource] = useState(null)
  const [result, setResult] = useState(null)
  const [quality, setQuality] = useState(82)
  const [format, setFormat] = useState('image/webp')
  const [maxWidth, setMaxWidth] = useState(1920)
  const [message, setMessage] = useState('')

  const chooseFile = event => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setMessage('请选择图片文件')
      return
    }
    if (source?.url) URL.revokeObjectURL(source.url)
    if (result?.url) URL.revokeObjectURL(result.url)
    setSource({ file, url: URL.createObjectURL(file) })
    setResult(null)
    setMessage('图片只在当前浏览器中处理，不会上传。')
  }

  const compress = () => {
    if (!source) return
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
          if (!blob)
            return setMessage('当前浏览器无法生成该格式，请换一种格式重试。')
          if (result?.url) URL.revokeObjectURL(result.url)
          const extension = format.split('/')[1].replace('jpeg', 'jpg')
          setResult({
            blob,
            url: URL.createObjectURL(blob),
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
        },
        format,
        quality / 100
      )
    }
    image.onerror = () => setMessage('图片读取失败，请换一张图片重试。')
    image.src = source.url
  }

  const download = () => {
    if (!result) return
    const link = document.createElement('a')
    const baseName = source.file.name.replace(/\.[^.]+$/, '')
    link.href = result.url
    link.download = `${baseName}-qcode.${result.extension}`
    link.click()
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
                点击选择图片
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
              onChange={event => setFormat(event.target.value)}
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
              onChange={event => setMaxWidth(Number(event.target.value))}
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
              onChange={event => setQuality(Number(event.target.value))}
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
            <ActionButton primary disabled={!source} onClick={compress}>
              开始处理
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
  const [active, setActive] = useState('json')
  const [notice, setNotice] = useState('')
  const toolAreaRef = useRef(null)
  const categories = ['全部', ...new Set(TOOL_CARDS.map(tool => tool.category))]

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
    try {
      await navigator.clipboard.writeText(value)
      setNotice('已复制到剪贴板')
    } catch {
      setNotice('复制失败，请手动选择内容复制')
    }
    window.setTimeout(() => setNotice(''), 1800)
  }

  const openTool = id => {
    setActive(id)
    window.setTimeout(
      () =>
        toolAreaRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        }),
      30
    )
  }

  const activeTool = {
    json: <JsonTool copy={copy} />,
    text: <TextTool copy={copy} />,
    time: <TimeTool copy={copy} />,
    codec: <CodecTool copy={copy} />,
    password: <PasswordTool copy={copy} />,
    image: <ImageTool />,
    classroom: <ClassroomTool copy={copy} />
  }[active]

  return (
    <div className='mx-auto w-full max-w-6xl px-4 pb-16 pt-8 md:px-6 md:pt-12'>
      <header className='relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-orange-400 px-6 py-10 text-white shadow-xl md:px-10 md:py-14'>
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
            不一定改变世界，但可能刚好有用。第一批工具全部在浏览器本地运行，不上传你的文字、名单、密码和图片。
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
              现有 {TOOL_CARDS.length} 件，后续会继续加入高频实用工具。
            </p>
          </div>
          <div className='relative w-full md:w-80'>
            <i className='fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder='搜索工具或用途'
              className='w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[var(--heo-color-primary)] focus:ring-2 focus:ring-indigo-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-indigo-900'
            />
          </div>
        </div>
        <div className='mt-4 flex gap-2 overflow-x-auto pb-2'>
          {categories.map(item => (
            <button
              key={item}
              type='button'
              onClick={() => setCategory(item)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${category === item ? 'bg-[var(--heo-color-primary)] text-white shadow' : 'border border-gray-200 bg-white text-gray-600 hover:border-[var(--heo-color-primary)] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}
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
              className={`group rounded-3xl border p-5 text-left transition duration-300 hover:-translate-y-1 hover:shadow-lg ${active === tool.id ? 'border-[var(--heo-color-primary)] bg-indigo-50/70 shadow-md dark:bg-indigo-950/20' : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-[var(--heo-color-card-dark)]'}`}
            >
              <div className='flex items-start justify-between gap-4'>
                <span className='flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-2xl transition group-hover:rotate-6 group-hover:scale-110 dark:bg-gray-800'>
                  {tool.icon}
                </span>
                <span className='rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-500 dark:bg-gray-800 dark:text-gray-400'>
                  {tool.category}
                </span>
              </div>
              <h3 className='mt-4 text-lg font-black text-gray-900 dark:text-white'>
                {tool.title}
              </h3>
              <p className='mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400'>
                {tool.description}
              </p>
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
        {activeTool}
      </div>

      <section className='mt-8 rounded-3xl border border-dashed border-orange-300 bg-orange-50/70 p-6 text-center dark:border-orange-800 dark:bg-orange-950/20'>
        <div className='text-3xl'>🧰</div>
        <h2 className='mt-2 text-lg font-black text-gray-900 dark:text-white'>
          工具会继续增加
        </h2>
        <p className='mx-auto mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-300'>
          下一批可以加入二维码、颜色与渐变、图片裁剪、Markdown
          预览、正则测试等。优先选择高频、免费、无需上传数据的功能。
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

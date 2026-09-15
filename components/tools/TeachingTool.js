import { loadExternalResource } from '@/lib/utils'
import { useEffect, useMemo, useRef, useState } from 'react'

const TABS = [
  ['roll', '🎲', '点名分组'],
  ['seat', '🪑', '座位表'],
  ['timer', '⏱️', '课堂计时'],
  ['grade', '📊', '成绩换算'],
  ['qr', '📱', '课程二维码']
]

const inputClass =
  'min-h-[44px] rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-900'

function Button({ children, onClick, primary = false, disabled = false }) {
  return (
    <button
      type='button'
      disabled={disabled}
      onClick={onClick}
      className={`min-h-[44px] rounded-xl px-4 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-40 ${
        primary
          ? 'bg-[var(--heo-color-primary)] text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md'
          : 'border border-gray-200 bg-white text-gray-700 hover:border-indigo-400 hover:text-indigo-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
      }`}
    >
      {children}
    </button>
  )
}

function Empty({ children }) {
  return (
    <div className='flex min-h-[15rem] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 text-center text-sm leading-7 text-gray-400 dark:border-gray-700 dark:bg-gray-900'>
      {children}
    </div>
  )
}

function parseNames(value) {
  return value
    .split(/[\n,，、;；\t]+/)
    .map(name => name.trim())
    .filter(Boolean)
}

function uniqueNames(value) {
  return [...new Set(parseNames(value))]
}

function shuffle(items) {
  const next = [...items]
  if (typeof window === 'undefined' || next.length < 2) return next
  const random = new Uint32Array(next.length)
  window.crypto.getRandomValues(random)
  for (let index = next.length - 1; index > 0; index--) {
    const target = random[index] % (index + 1)
    ;[next[index], next[target]] = [next[target], next[index]]
  }
  return next
}

function NameEditor({ names, setNames, list, onClean }) {
  const allNames = parseNames(names)
  const duplicateCount = allNames.length - list.length
  return (
    <div>
      <textarea
        value={names}
        onChange={event => setNames(event.target.value)}
        placeholder={'每行输入一个名字，例如：\n小橙\n小星\n小球'}
        rows={10}
        spellCheck={false}
        className='w-full resize-y rounded-2xl border border-gray-200 bg-white p-4 text-sm leading-7 text-gray-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-900'
      />
      <div className='mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400'>
        <span className='rounded-full bg-indigo-50 px-3 py-1.5 font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-200'>
          {list.length} 位同学
        </span>
        {duplicateCount > 0 && (
          <>
            <span className='text-amber-600'>
              发现 {duplicateCount} 个重复名字
            </span>
            <button
              type='button'
              onClick={onClean}
              className='font-bold text-indigo-600 hover:underline dark:text-indigo-300'
            >
              一键去重整理
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function RollCall({ names, setNames, list, copy }) {
  const [groupCount, setGroupCount] = useState(4)
  const [groups, setGroups] = useState([])
  const [picked, setPicked] = useState([])
  const [current, setCurrent] = useState('')

  useEffect(() => {
    setGroups([])
    setPicked([])
    setCurrent('')
  }, [names])

  const pickOne = () => {
    if (!list.length) return
    const available = list.filter(name => !picked.includes(name))
    const pool = available.length ? available : list
    const winner = shuffle(pool)[0]
    setCurrent(winner)
    setGroups([])
    setPicked(available.length ? [...picked, winner] : [winner])
  }

  const makeGroups = () => {
    if (!list.length) return
    const count = Math.min(Math.max(1, groupCount || 1), list.length)
    const next = Array.from({ length: count }, () => [])
    shuffle(list).forEach((name, index) => next[index % count].push(name))
    setCurrent('')
    setGroups(next)
  }

  const resultText = groups
    .map((group, index) => `第 ${index + 1} 组：${group.join('、')}`)
    .join('\n')

  return (
    <div className='grid gap-5 lg:grid-cols-[.9fr_1.1fr]'>
      <div>
        <NameEditor
          names={names}
          setNames={setNames}
          list={list}
          onClean={() => setNames(list.join('\n'))}
        />
        <div className='mt-4 flex flex-wrap items-center gap-2'>
          <Button primary disabled={!list.length} onClick={pickOne}>
            随机点一位
          </Button>
          <label className='flex min-h-[44px] items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-sm dark:border-gray-600 dark:bg-gray-800'>
            分成
            <input
              type='number'
              min='1'
              max='50'
              value={groupCount}
              onChange={event => setGroupCount(Number(event.target.value))}
              className='w-12 bg-transparent text-center outline-none'
            />
            组
          </label>
          <Button disabled={!list.length} onClick={makeGroups}>
            随机分组
          </Button>
          <Button disabled={!groups.length} onClick={() => copy(resultText)}>
            复制分组
          </Button>
        </div>
        {picked.length > 0 && (
          <div className='mt-3 text-xs text-gray-500 dark:text-gray-400'>
            本轮已点 {picked.length}/{list.length}{' '}
            人；全部点完后自动开启新一轮。
          </div>
        )}
      </div>
      <div>
        {current ? (
          <div className='flex min-h-[15rem] flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-orange-400 p-8 text-white shadow-lg'>
            <div className='text-sm font-bold tracking-[.3em] text-white/75'>
              本次点名
            </div>
            <div className='mt-5 break-all text-center text-4xl font-black md:text-6xl'>
              {current}
            </div>
          </div>
        ) : groups.length ? (
          <div className='grid gap-3 sm:grid-cols-2'>
            {groups.map((group, index) => (
              <div
                key={index}
                className='rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800'
              >
                <div className='text-sm font-black text-indigo-600 dark:text-indigo-300'>
                  第 {index + 1} 组 · {group.length} 人
                </div>
                <div className='mt-2 leading-7 text-gray-700 dark:text-gray-200'>
                  {group.join('、')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty>点名和分组结果会显示在这里</Empty>
        )}
      </div>
    </div>
  )
}

function Seating({ names, setNames, list, copy }) {
  const [columns, setColumns] = useState(6)
  const [seats, setSeats] = useState(/** @type {string[]} */ ([]))

  useEffect(() => setSeats([]), [names])

  const seatText = seats
    .map((name, index) => `${index + 1}. ${name}`)
    .join('\n')

  return (
    <div className='grid gap-5 lg:grid-cols-[.75fr_1.25fr]'>
      <div>
        <NameEditor
          names={names}
          setNames={setNames}
          list={list}
          onClean={() => setNames(list.join('\n'))}
        />
        <div className='mt-4 flex flex-wrap gap-2'>
          <label className='flex min-h-[44px] items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-sm dark:border-gray-600 dark:bg-gray-800'>
            每排
            <input
              type='number'
              min='2'
              max='12'
              value={columns}
              onChange={event => setColumns(Number(event.target.value))}
              className='w-12 bg-transparent text-center outline-none'
            />
            座
          </label>
          <Button
            primary
            disabled={!list.length}
            onClick={() => setSeats(shuffle(list))}
          >
            随机排座
          </Button>
          <Button disabled={!seats.length} onClick={() => copy(seatText)}>
            复制座次
          </Button>
        </div>
      </div>
      <div>
        {seats.length ? (
          <div className='rounded-2xl bg-gray-50 p-4 dark:bg-gray-900'>
            <div className='mx-auto mb-5 max-w-sm rounded-lg bg-gray-800 py-2 text-center text-sm font-bold tracking-[.35em] text-white shadow-md'>
              讲 台
            </div>
            <div
              className='grid gap-2'
              style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
              }}
            >
              {seats.map((name, index) => (
                <div
                  key={`${name}-${index}`}
                  className='min-w-0 rounded-xl border border-indigo-100 bg-white px-2 py-3 text-center text-xs font-bold text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 sm:text-sm'
                >
                  <span className='mr-1 text-[10px] text-gray-400'>
                    {index + 1}
                  </span>
                  <span className='break-all'>{name}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Empty>设置每排座位数，生成可直接投屏的随机座位表</Empty>
        )}
      </div>
    </div>
  )
}

function TimerTool() {
  const [minutes, setMinutes] = useState(10)
  const [total, setTotal] = useState(600)
  const [remaining, setRemaining] = useState(600)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => {
      setRemaining(value => {
        if (value > 1) return value - 1
        setRunning(false)
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext
          const context = new AudioContext()
          const oscillator = context.createOscillator()
          oscillator.frequency.value = 880
          oscillator.connect(context.destination)
          oscillator.start()
          oscillator.stop(context.currentTime + 0.45)
        } catch (error) {
          // 浏览器禁用提示音时，仍保留视觉提醒。
        }
        window.navigator.vibrate?.([180, 100, 180])
        return 0
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [running])

  const chooseTime = nextMinutes => {
    const seconds = Math.max(1, Math.round(nextMinutes * 60))
    setMinutes(nextMinutes)
    setTotal(seconds)
    setRemaining(seconds)
    setRunning(false)
  }

  const display = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(
    remaining % 60
  ).padStart(2, '0')}`
  const progress = total ? ((total - remaining) / total) * 100 : 0

  return (
    <div className='grid gap-5 lg:grid-cols-[.7fr_1.3fr]'>
      <div className='rounded-2xl bg-gray-50 p-5 dark:bg-gray-900'>
        <div className='text-sm font-black text-gray-800 dark:text-white'>
          快捷时长
        </div>
        <div className='mt-3 grid grid-cols-2 gap-2'>
          {[5, 10, 15, 45].map(value => (
            <Button key={value} onClick={() => chooseTime(value)}>
              {value} 分钟
            </Button>
          ))}
        </div>
        <label className='mt-4 block text-sm text-gray-600 dark:text-gray-300'>
          自定义分钟数
          <input
            type='number'
            min='0.1'
            max='300'
            step='0.5'
            value={minutes}
            onChange={event => setMinutes(Number(event.target.value))}
            className={`${inputClass} mt-2 w-full`}
          />
        </label>
        <Button
          disabled={!minutes || minutes <= 0}
          onClick={() => chooseTime(minutes)}
        >
          应用自定义时长
        </Button>
      </div>
      <div
        className={`flex min-h-[20rem] flex-col items-center justify-center rounded-3xl p-6 text-center transition ${
          remaining === 0
            ? 'animate-pulse bg-orange-500 text-white'
            : 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white'
        }`}
      >
        <div className='text-sm font-bold tracking-[.35em] text-white/70'>
          {remaining === 0 ? '时间到' : running ? '计时进行中' : '课堂倒计时'}
        </div>
        <div className='my-5 font-mono text-6xl font-black tabular-nums md:text-8xl'>
          {display}
        </div>
        <div className='mb-6 h-2 w-full max-w-md overflow-hidden rounded-full bg-white/20'>
          <div
            className='h-full rounded-full bg-white transition-all'
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className='flex flex-wrap justify-center gap-2'>
          <button
            type='button'
            onClick={() => remaining > 0 && setRunning(value => !value)}
            className='min-h-[44px] rounded-xl bg-white px-5 py-2 font-black text-indigo-700 shadow'
          >
            {running ? '暂停' : '开始'}
          </button>
          <button
            type='button'
            onClick={() => {
              setRunning(false)
              setRemaining(total)
            }}
            className='min-h-[44px] rounded-xl border border-white/40 px-5 py-2 font-bold text-white'
          >
            重置
          </button>
        </div>
      </div>
    </div>
  )
}

function parseGrades(value) {
  const rows = []
  let invalid = 0
  value.split('\n').forEach(line => {
    const text = line.trim()
    if (!text) return
    const parts = text.split(/[,，\t ]+/).filter(Boolean)
    const score = Number(parts.pop())
    const name = parts.join(' ')
    if (!name || !Number.isFinite(score) || score < 0 || score > 100) {
      invalid += 1
      return
    }
    rows.push({ name, score })
  })
  return { rows, invalid }
}

function GradeTool({ copy }) {
  const [value, setValue] = useState('')
  const { rows, invalid } = useMemo(() => parseGrades(value), [value])
  const graded = rows.map(item => ({
    ...item,
    grade:
      item.score >= 90
        ? 'A 优秀'
        : item.score >= 80
          ? 'B 良好'
          : item.score >= 70
            ? 'C 中等'
            : item.score >= 60
              ? 'D 及格'
              : 'F 不及格'
  }))
  const scores = rows.map(item => item.score)
  const average = scores.length
    ? (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1)
    : '—'
  const passRate = scores.length
    ? `${((scores.filter(score => score >= 60).length / scores.length) * 100).toFixed(1)}%`
    : '—'
  const resultText = graded
    .map(item => `${item.name}\t${item.score}\t${item.grade}`)
    .join('\n')

  return (
    <div className='grid gap-5 lg:grid-cols-[.85fr_1.15fr]'>
      <div>
        <textarea
          value={value}
          onChange={event => setValue(event.target.value)}
          placeholder={
            '每行输入“姓名 分数”，例如：\n小橙 92\n小星, 86\n小球，59'
          }
          rows={13}
          spellCheck={false}
          className='w-full resize-y rounded-2xl border border-gray-200 bg-white p-4 font-mono text-sm leading-7 text-gray-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-900'
        />
        <div className='mt-3 flex flex-wrap items-center gap-2'>
          <Button
            disabled={!rows.length}
            primary
            onClick={() => copy(`姓名\t分数\t等级\n${resultText}`)}
          >
            复制结果到表格
          </Button>
          {invalid > 0 && (
            <span className='text-xs text-amber-600'>
              已忽略 {invalid} 行无效数据
            </span>
          )}
        </div>
        <p className='mt-3 text-xs leading-6 text-gray-400'>
          默认规则：90/80/70/60 分对应 A/B/C/D，低于 60 分为 F。
        </p>
      </div>
      <div>
        {rows.length ? (
          <>
            <div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
              {[
                ['人数', rows.length],
                ['平均分', average],
                ['最高分', Math.max(...scores)],
                ['及格率', passRate]
              ].map(([label, result]) => (
                <div
                  key={label}
                  className='rounded-2xl bg-indigo-50 p-3 text-center dark:bg-indigo-950/30'
                >
                  <div className='text-xs text-gray-500'>{label}</div>
                  <div className='mt-1 text-xl font-black text-indigo-700 dark:text-indigo-200'>
                    {result}
                  </div>
                </div>
              ))}
            </div>
            <div className='mt-3 max-h-80 overflow-auto rounded-2xl border border-gray-200 dark:border-gray-700'>
              {graded.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className='grid grid-cols-[1fr_4rem_6rem] gap-2 border-b border-gray-100 px-4 py-3 text-sm last:border-0 dark:border-gray-700'
                >
                  <span className='truncate font-bold'>{item.name}</span>
                  <span className='text-center tabular-nums'>{item.score}</span>
                  <span className='text-right text-indigo-600 dark:text-indigo-300'>
                    {item.grade}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <Empty>粘贴成绩后，自动显示平均分、最高分、及格率和等级</Empty>
        )}
      </div>
    </div>
  )
}

function QrTool() {
  const [value, setValue] = useState('https://qcode.im')
  const [error, setError] = useState('')
  const containerRef = useRef(null)
  const qrCodeCDN =
    process.env.NEXT_PUBLIC_QR_CODE_CDN ||
    'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'

  useEffect(() => {
    let active = true
    if (!containerRef.current) return
    containerRef.current.innerHTML = ''
    setError('')
    if (!value.trim()) return
    loadExternalResource(qrCodeCDN, 'js')
      .then(() => {
        if (!active || !containerRef.current || !window.QRCode) return
        containerRef.current.innerHTML = ''
        new window.QRCode(containerRef.current, {
          text: value.trim(),
          width: 240,
          height: 240,
          colorDark: '#111827',
          colorLight: '#ffffff',
          correctLevel: window.QRCode.CorrectLevel.H
        })
      })
      .catch(() => active && setError('二维码组件加载失败，请检查网络后重试。'))
    return () => {
      active = false
    }
  }, [qrCodeCDN, value])

  const download = () => {
    const canvas = containerRef.current?.querySelector('canvas')
    const image = containerRef.current?.querySelector('img')
    const url = canvas?.toDataURL('image/png') || image?.src
    if (!url) return
    const link = document.createElement('a')
    link.download = 'qcode-course-qrcode.png'
    link.href = url
    link.click()
  }

  return (
    <div className='grid gap-5 lg:grid-cols-[1fr_.8fr]'>
      <div>
        <label className='text-sm font-black text-gray-800 dark:text-white'>
          课程链接或文字
        </label>
        <textarea
          value={value}
          onChange={event => setValue(event.target.value)}
          rows={8}
          placeholder='粘贴课件、问卷、签到页面或课程资料链接'
          className='mt-3 w-full resize-y rounded-2xl border border-gray-200 bg-white p-4 text-sm leading-7 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-indigo-900'
        />
        <p className='mt-3 rounded-xl bg-emerald-50 px-4 py-3 text-xs leading-6 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-200'>
          内容在浏览器里生成二维码，不会保存到本站服务器。首次使用需要联网加载免费的二维码组件。
        </p>
      </div>
      <div className='flex min-h-[20rem] flex-col items-center justify-center rounded-2xl bg-gray-50 p-5 dark:bg-gray-900'>
        {error ? (
          <div className='text-center text-sm text-red-500'>{error}</div>
        ) : value.trim() ? (
          <>
            <div
              className='rounded-2xl bg-white p-4 shadow-sm'
              ref={containerRef}
            />
            <div className='mt-4'>
              <Button onClick={download}>下载 PNG 二维码</Button>
            </div>
          </>
        ) : (
          <Empty>输入内容后生成二维码</Empty>
        )}
      </div>
    </div>
  )
}

export default function TeachingTool({ copy }) {
  const [active, setActive] = useState('roll')
  const [names, setNames] = useState('')
  const list = useMemo(() => uniqueNames(names), [names])

  const panels = {
    roll: (
      <RollCall names={names} setNames={setNames} list={list} copy={copy} />
    ),
    seat: <Seating names={names} setNames={setNames} list={list} copy={copy} />,
    timer: <TimerTool />,
    grade: <GradeTool copy={copy} />,
    qr: <QrTool />
  }

  return (
    <section className='relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.07)] dark:border-gray-700 dark:bg-[var(--heo-color-card-dark)] md:p-7'>
      <div className='absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-orange-400' />
      <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
        <div>
          <div className='text-xs font-black tracking-[.25em] text-indigo-500'>
            TEACHING KIT
          </div>
          <h2 className='mt-2 text-2xl font-black text-gray-900 dark:text-white md:text-3xl'>
            🧰 教学百宝箱
          </h2>
          <p className='mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400'>
            从备课到课堂互动，一处完成；名单和成绩仅在当前浏览器中处理。
          </p>
        </div>
        <div className='rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-200'>
          免费 · 无需登录 · 本地处理
        </div>
      </div>
      <div className='mt-6 flex gap-2 overflow-x-auto pb-2'>
        {TABS.map(([id, icon, label]) => (
          <button
            key={id}
            type='button'
            onClick={() => setActive(id)}
            className={`min-h-[44px] shrink-0 rounded-xl px-4 py-2 text-sm font-bold transition ${
              active === id
                ? 'bg-[var(--heo-color-primary)] text-white shadow-sm'
                : 'border border-gray-200 bg-gray-50 text-gray-600 hover:border-indigo-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300'
            }`}
          >
            <span className='mr-1.5'>{icon}</span>
            {label}
          </button>
        ))}
      </div>
      <div className='mt-5'>{panels[active]}</div>
    </section>
  )
}

import { useMemo, useState } from 'react'

const QUICK_PREFIXES = [
  8, 12, 16, 20, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32
]

function parseIPv4(value) {
  const parts = String(value).trim().split('.')
  if (parts.length !== 4) return null
  if (parts.some(part => !/^\d{1,3}$/.test(part) || Number(part) > 255)) {
    return null
  }
  return parts.reduce((result, part) => result * 256 + Number(part), 0) >>> 0
}

function numberToIPv4(value) {
  const unsigned = Number(value) >>> 0
  return [24, 16, 8, 0].map(shift => (unsigned >>> shift) & 255).join('.')
}

function prefixToMask(prefix) {
  if (prefix === 0) return 0
  return (0xffffffff << (32 - prefix)) >>> 0
}

function maskToPrefix(mask) {
  const maskNumber = parseIPv4(mask)
  if (maskNumber === null) return null
  const wildcard = ~maskNumber >>> 0
  if ((wildcard & (wildcard + 1)) !== 0) return null
  return maskNumber.toString(2).replace(/0/g, '').length
}

function getAddressType(ipNumber) {
  const first = ipNumber >>> 24
  const second = (ipNumber >>> 16) & 255
  const third = (ipNumber >>> 8) & 255

  if (first === 10) return '私有地址 · 10.0.0.0/8'
  if (first === 172 && second >= 16 && second <= 31) {
    return '私有地址 · 172.16.0.0/12'
  }
  if (first === 192 && second === 168) return '私有地址 · 192.168.0.0/16'
  if (first === 127) return '本机回环地址'
  if (first === 169 && second === 254) return '链路本地地址'
  if (first === 100 && second >= 64 && second <= 127) return '运营商级 NAT 地址'
  if (first >= 224 && first <= 239) return '组播地址'
  if (first === 0 || first >= 240) return '保留地址'
  if (
    (first === 192 && second === 0 && third === 2) ||
    (first === 198 && second === 51 && third === 100) ||
    (first === 203 && second === 0 && third === 113)
  ) {
    return '文档示例保留地址'
  }
  return '公网地址'
}

function hostCapacity(prefix) {
  const total = 2 ** (32 - prefix)
  if (prefix === 32) return { total, usable: 1 }
  if (prefix === 31) return { total, usable: 2 }
  return { total, usable: Math.max(0, total - 2) }
}

function formatNumber(value) {
  return new Intl.NumberFormat('zh-CN').format(value)
}

function Field({ label, hint, children }) {
  return (
    <label className='block'>
      <span className='mb-2 flex items-center justify-between gap-3 text-sm font-bold text-gray-700 dark:text-gray-200'>
        {label}
        {hint && (
          <span className='text-xs font-normal text-gray-400'>{hint}</span>
        )}
      </span>
      {children}
    </label>
  )
}

function ResultItem({ label, value, accent = false, onCopy }) {
  const content = (
    <>
      <div className='text-xs font-bold uppercase tracking-wider text-gray-400'>
        {label}
      </div>
      <div className='mt-1 break-all font-mono text-sm font-black text-gray-900 dark:text-white md:text-base'>
        {value}
      </div>
      {onCopy && (
        <div className='mt-2 text-[11px] font-bold text-indigo-500 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100'>
          点击复制
        </div>
      )}
    </>
  )
  const className = `group w-full rounded-2xl border p-4 text-left transition ${
    accent
      ? 'border-indigo-200 bg-indigo-50/80 dark:border-indigo-800 dark:bg-indigo-950/30'
      : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
  } ${onCopy ? 'cursor-pointer hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400' : ''}`

  if (onCopy) {
    return (
      <button type='button' onClick={onCopy} className={className}>
        {content}
      </button>
    )
  }

  return (
    <div
      className={`rounded-2xl border p-4 ${
        accent
          ? 'border-indigo-200 bg-indigo-50/80 dark:border-indigo-800 dark:bg-indigo-950/30'
          : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
      }`}
    >
      {content}
    </div>
  )
}

function SubnetCalculator({ copy }) {
  const [ip, setIp] = useState('192.168.1.100')
  const [prefix, setPrefix] = useState(24)
  const [mask, setMask] = useState('255.255.255.0')
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const clearResult = () => {
    setResult(null)
    setError('')
  }

  const setIpValue = value => {
    const cidrInput = value.trim().match(/^(.+)\/(\d{1,2})$/)
    if (cidrInput) {
      setIp(cidrInput[1])
      setPrefixValue(cidrInput[2])
      return
    }
    setIp(value)
    clearResult()
  }

  const setPrefixValue = value => {
    clearResult()
    const next = Number(value)
    setPrefix(value)
    if (Number.isInteger(next) && next >= 0 && next <= 32) {
      setMask(numberToIPv4(prefixToMask(next)))
    }
  }

  const setMaskValue = value => {
    clearResult()
    setMask(value)
    const nextPrefix = maskToPrefix(value)
    if (nextPrefix !== null) setPrefix(nextPrefix)
  }

  const calculate = () => {
    const ipNumber = parseIPv4(ip)
    const prefixNumber = Number(prefix)
    if (ipNumber === null) {
      setResult(null)
      return setError('IP 地址格式不正确，请输入 4 段 0–255 的数字。')
    }
    if (
      !Number.isInteger(prefixNumber) ||
      prefixNumber < 0 ||
      prefixNumber > 32
    ) {
      setResult(null)
      return setError('CIDR 前缀需要是 0–32 之间的整数。')
    }
    if (maskToPrefix(mask) !== prefixNumber) {
      setResult(null)
      return setError('子网掩码不是连续掩码，或与 CIDR 前缀不一致。')
    }

    const maskNumber = prefixToMask(prefixNumber)
    const network = (ipNumber & maskNumber) >>> 0
    const broadcast = (network | (~maskNumber >>> 0)) >>> 0
    const capacity = hostCapacity(prefixNumber)
    const first = prefixNumber >= 31 ? network : network + 1
    const last = prefixNumber >= 31 ? broadcast : broadcast - 1
    setError('')
    setResult({
      cidr: `${numberToIPv4(network)}/${prefixNumber}`,
      mask: numberToIPv4(maskNumber),
      wildcard: numberToIPv4(~maskNumber >>> 0),
      network: numberToIPv4(network),
      broadcast: numberToIPv4(broadcast),
      range: `${numberToIPv4(first)} – ${numberToIPv4(last)}`,
      total: formatNumber(capacity.total),
      usable: formatNumber(capacity.usable),
      type: getAddressType(ipNumber)
    })
  }

  const copyResult = () => {
    if (!result) return
    copy(
      [
        `CIDR：${result.cidr}`,
        `子网掩码：${result.mask}`,
        `网络地址：${result.network}`,
        `广播地址：${result.broadcast}`,
        `可用范围：${result.range}`,
        `可用主机：${result.usable}`
      ].join('\n')
    )
  }

  return (
    <div>
      <div className='grid gap-4 lg:grid-cols-[1.2fr_0.7fr_1fr]'>
        <Field label='IPv4 地址' hint='也可粘贴 IP/24'>
          <input
            value={ip}
            onChange={event => setIpValue(event.target.value)}
            onKeyDown={event => event.key === 'Enter' && calculate()}
            className='h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 font-mono text-sm outline-none transition focus:border-[var(--heo-color-primary)] focus:ring-2 focus:ring-indigo-100 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-indigo-900'
            inputMode='decimal'
          />
        </Field>
        <Field label='CIDR 前缀' hint='0–32'>
          <div className='flex h-12 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 focus-within:border-[var(--heo-color-primary)] dark:border-gray-600 dark:bg-gray-900'>
            <span className='flex items-center pl-4 font-mono text-gray-400'>
              /
            </span>
            <input
              type='number'
              min='0'
              max='32'
              value={prefix}
              onChange={event => setPrefixValue(event.target.value)}
              onKeyDown={event => event.key === 'Enter' && calculate()}
              className='min-w-0 flex-1 bg-transparent px-2 font-mono text-sm outline-none dark:text-white'
            />
          </div>
        </Field>
        <Field label='子网掩码' hint='自动同步'>
          <input
            value={mask}
            onChange={event => setMaskValue(event.target.value)}
            onKeyDown={event => event.key === 'Enter' && calculate()}
            className='h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 font-mono text-sm outline-none transition focus:border-[var(--heo-color-primary)] focus:ring-2 focus:ring-indigo-100 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-indigo-900'
            inputMode='decimal'
          />
        </Field>
      </div>

      <div className='mt-4 flex flex-wrap items-center gap-2'>
        <button
          type='button'
          onClick={calculate}
          className='min-h-[44px] rounded-xl bg-[var(--heo-color-primary)] px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md'
        >
          开始计算
        </button>
        {[16, 24, 30].map(item => (
          <button
            key={item}
            type='button'
            onClick={() => setPrefixValue(item)}
            className='min-h-[44px] rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-600 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
          >
            常用 /{item}
          </button>
        ))}
        {result && (
          <button
            type='button'
            onClick={copyResult}
            className='min-h-[44px] rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-600 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 lg:ml-auto'
          >
            复制完整配置
          </button>
        )}
      </div>

      {error && (
        <div className='mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:bg-red-950/30 dark:text-red-300'>
          {error}
        </div>
      )}

      {!result && !error && (
        <div className='mt-6 rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 px-5 py-8 text-center text-sm leading-6 text-gray-400 dark:border-gray-700 dark:bg-gray-900/50'>
          填写设备 IP 后点击「开始计算」
          <br />
          CIDR 和子网掩码修改任意一个，另一个会自动同步。
        </div>
      )}

      {result && (
        <div className='mt-6'>
          <div className='mb-3 flex flex-wrap items-center justify-between gap-2'>
            <h3 className='font-black text-gray-900 dark:text-white'>
              计算结果
            </h3>
            <span className='rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'>
              {result.type}
            </span>
          </div>
          <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
            <ResultItem
              label='CIDR 网段'
              value={result.cidr}
              accent
              onCopy={() => copy(result.cidr)}
            />
            <ResultItem
              label='子网掩码'
              value={result.mask}
              onCopy={() => copy(result.mask)}
            />
            <ResultItem
              label='网络地址'
              value={result.network}
              onCopy={() => copy(result.network)}
            />
            <ResultItem
              label='广播地址'
              value={result.broadcast}
              onCopy={() => copy(result.broadcast)}
            />
            <div className='sm:col-span-2'>
              <ResultItem
                label='可用主机范围'
                value={result.range}
                accent
                onCopy={() => copy(result.range)}
              />
            </div>
            <ResultItem label='地址总数' value={result.total} />
            <ResultItem label='可用主机数' value={result.usable} />
            <ResultItem label='反掩码 / Wildcard' value={result.wildcard} />
          </div>
          {Number(prefix) >= 31 && (
            <p className='mt-3 text-xs leading-5 text-gray-400'>
              /31 常用于点到点链路；/32
              表示单个主机，因此不采用传统“减去网络和广播地址”的算法。
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function HostPlanner({ copy }) {
  const [hosts, setHosts] = useState(50)
  const plan = useMemo(() => {
    const requested = Math.min(
      1000000,
      Math.max(1, Math.floor(Number(hosts) || 0))
    )
    const hostBits = Math.min(
      32,
      Math.max(2, Math.ceil(Math.log2(requested + 2)))
    )
    const prefix = 32 - hostBits
    const capacity = hostCapacity(prefix)
    return {
      requested,
      prefix,
      mask: numberToIPv4(prefixToMask(prefix)),
      total: capacity.total,
      usable: capacity.usable,
      spare: capacity.usable - requested
    }
  }, [hosts])

  return (
    <div className='grid gap-6 lg:grid-cols-[0.8fr_1.2fr]'>
      <div>
        <Field label='需要容纳多少台设备？' hint='1–1,000,000'>
          <input
            type='number'
            min='1'
            max='1000000'
            value={hosts}
            onChange={event => setHosts(event.target.value)}
            className='h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-lg font-black outline-none transition focus:border-[var(--heo-color-primary)] focus:ring-2 focus:ring-indigo-100 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-indigo-900'
          />
        </Field>
        <p className='mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400'>
          适合在配置路由器、交换机 VLAN 或实验室网络前，快速估算最小子网。
        </p>
      </div>
      <div className='rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 p-5 text-white shadow-lg md:p-6'>
        <div className='text-xs font-bold uppercase tracking-[0.2em] text-white/70'>
          推荐方案
        </div>
        <div className='mt-3 flex flex-wrap items-end gap-x-5 gap-y-2'>
          <div className='text-4xl font-black'>/{plan.prefix}</div>
          <div className='pb-1 font-mono text-sm text-white/85'>
            {plan.mask}
          </div>
        </div>
        <div className='mt-5 grid grid-cols-3 gap-2 text-center'>
          {[
            ['可用主机', plan.usable],
            ['地址总数', plan.total],
            ['预留余量', plan.spare]
          ].map(([label, value]) => (
            <div key={label} className='rounded-2xl bg-white/10 px-2 py-3'>
              <div className='text-xs text-white/70'>{label}</div>
              <div className='mt-1 text-lg font-black'>
                {formatNumber(value)}
              </div>
            </div>
          ))}
        </div>
        <button
          type='button'
          onClick={() =>
            copy(
              `需求：${plan.requested} 台设备\n推荐：/${plan.prefix}\n掩码：${plan.mask}\n可用主机：${plan.usable}`
            )
          }
          className='mt-5 min-h-[44px] w-full rounded-xl bg-white px-4 text-sm font-black text-indigo-700 transition hover:bg-indigo-50'
        >
          复制规划结果
        </button>
      </div>
    </div>
  )
}

function CidrReference() {
  return (
    <div>
      <div className='mb-4 rounded-2xl bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300'>
        可用主机数按常规局域网算法计算；/31 和 /32
        分别按点到点链路、单主机用途展示。
      </div>
      <div className='overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700'>
        <table className='w-full min-w-[580px] text-left text-sm'>
          <thead className='bg-gray-50 text-xs uppercase tracking-wider text-gray-500 dark:bg-gray-900 dark:text-gray-400'>
            <tr>
              <th className='px-4 py-3'>CIDR</th>
              <th className='px-4 py-3'>子网掩码</th>
              <th className='px-4 py-3'>地址总数</th>
              <th className='px-4 py-3'>可用主机</th>
              <th className='px-4 py-3'>常见用途</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100 dark:divide-gray-700'>
            {QUICK_PREFIXES.map(prefix => {
              const capacity = hostCapacity(prefix)
              const usage =
                prefix === 24
                  ? '常见局域网'
                  : prefix === 30
                    ? '小型链路'
                    : prefix === 31
                      ? '点到点链路'
                      : prefix === 32
                        ? '单个主机'
                        : '子网规划'
              return (
                <tr
                  key={prefix}
                  className={`${prefix === 24 ? 'bg-indigo-50/60 dark:bg-indigo-950/20' : 'bg-white dark:bg-gray-800'} hover:bg-gray-50 dark:hover:bg-gray-700`}
                >
                  <td className='px-4 py-3 font-black text-indigo-600 dark:text-indigo-300'>
                    /{prefix}
                  </td>
                  <td className='px-4 py-3 font-mono text-gray-700 dark:text-gray-200'>
                    {numberToIPv4(prefixToMask(prefix))}
                  </td>
                  <td className='px-4 py-3 text-gray-600 dark:text-gray-300'>
                    {formatNumber(capacity.total)}
                  </td>
                  <td className='px-4 py-3 font-bold text-gray-800 dark:text-gray-100'>
                    {formatNumber(capacity.usable)}
                  </td>
                  <td className='px-4 py-3 text-gray-500 dark:text-gray-400'>
                    {usage}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function NetworkTool({ copy }) {
  const [tab, setTab] = useState('subnet')
  const tabs = [
    { id: 'subnet', icon: '🧮', name: '子网计算' },
    { id: 'planner', icon: '📐', name: '主机数规划' },
    { id: 'reference', icon: '📋', name: 'CIDR 速查' }
  ]

  return (
    <section className='overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] dark:border-gray-700 dark:bg-[var(--heo-color-card-dark)]'>
      <div className='border-b border-gray-100 bg-gradient-to-r from-sky-50 via-white to-indigo-50 px-5 py-6 dark:border-gray-700 dark:from-sky-950/30 dark:via-gray-900 dark:to-indigo-950/30 md:px-7'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div>
            <div className='mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-sky-600 dark:text-sky-300'>
              <span className='h-2 w-2 rounded-full bg-sky-500 shadow-[0_0_0_5px_rgba(14,165,233,0.12)]' />
              Network Suite
            </div>
            <h2 className='text-xl font-black text-gray-900 dark:text-white md:text-2xl'>
              🌐 网络工程箱
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400'>
              IP、子网掩码和容量规划集中在一个工具套件中，全程本地计算。
            </p>
          </div>
          <span className='w-fit rounded-full border border-sky-200 bg-white px-3 py-1.5 text-xs font-bold text-sky-700 shadow-sm dark:border-sky-800 dark:bg-gray-900 dark:text-sky-300'>
            3 项网络功能
          </span>
        </div>
      </div>

      <div className='p-5 md:p-7'>
        <div className='mb-6 grid grid-cols-3 gap-1 rounded-2xl bg-gray-100 p-1.5 dark:bg-gray-900'>
          {tabs.map(item => (
            <button
              key={item.id}
              type='button'
              onClick={() => setTab(item.id)}
              className={`min-h-[46px] rounded-xl px-2 text-xs font-black transition sm:text-sm ${
                tab === item.id
                  ? 'bg-white text-indigo-700 shadow-sm dark:bg-gray-700 dark:text-indigo-200'
                  : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <span className='mr-1 hidden sm:inline'>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </div>

        {tab === 'subnet' && <SubnetCalculator copy={copy} />}
        {tab === 'planner' && <HostPlanner copy={copy} />}
        {tab === 'reference' && <CidrReference />}
      </div>
    </section>
  )
}

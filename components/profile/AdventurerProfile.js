import { useEffect } from 'react'

const Stat = ({ value, label, suffix = '' }) => (
  <div className='rounded-2xl border border-gray-100 bg-white/80 px-4 py-4 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900/70'>
    <div className='text-2xl font-black text-gray-900 dark:text-white'>
      {value}
      <span className='ml-0.5 text-xs font-bold text-gray-400'>{suffix}</span>
    </div>
    <div className='mt-1 text-xs text-gray-500 dark:text-gray-400'>{label}</div>
  </div>
)

const MonthlyTrend = ({ months }) => {
  const maxXp = Math.max(...months.map(item => item.xp), 1)
  return (
    <div className='mt-6 flex h-48 items-end gap-2 md:gap-4'>
      {months.map(item => {
        const height = item.xp ? Math.max(12, (item.xp / maxXp) * 100) : 4
        return (
          <div
            key={item.key}
            className='flex h-full min-w-0 flex-1 flex-col items-center justify-end'
          >
            <div className='mb-2 text-[10px] font-black text-gray-400'>
              {item.xp ? `${item.xp} XP` : '—'}
            </div>
            <div className='flex h-32 w-full items-end overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800'>
              <div
                className='w-full rounded-xl bg-gradient-to-t from-indigo-500 via-violet-500 to-orange-400 transition-all duration-1000'
                style={{ height: `${height}%` }}
              />
            </div>
            <div className='mt-2 text-[11px] font-bold text-gray-500 dark:text-gray-400'>
              {item.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const RadarChart = ({ dimensions }) => {
  const centerX = 210
  const centerY = 176
  const radius = 112
  const labelRadius = 148
  const angleFor = index => (Math.PI * 2 * index) / dimensions.length - Math.PI / 2
  const pointAt = (index, distance) => {
    const angle = angleFor(index)
    return [
      centerX + Math.cos(angle) * distance,
      centerY + Math.sin(angle) * distance
    ]
  }
  const pointsFor = factor =>
    dimensions
      .map((_, index) => pointAt(index, radius * factor).join(','))
      .join(' ')
  const abilityPoints = dimensions
    .map((item, index) =>
      pointAt(index, radius * Math.max(item.score, 8) / 100).join(',')
    )
    .join(' ')

  return (
    <div className='relative mx-auto w-full max-w-[460px]'>
      <svg
        viewBox='0 0 420 360'
        role='img'
        aria-label={`六维能力雷达图：${dimensions
          .map(item => `${item.label} ${item.xp} XP，Lv.${item.level}`)
          .join('，')}`}
        className='h-auto w-full overflow-visible text-gray-300 dark:text-gray-700'
      >
        <defs>
          <linearGradient id='qcode-profile-radar' x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0%' stopColor='#6366f1' />
            <stop offset='55%' stopColor='#8b5cf6' />
            <stop offset='100%' stopColor='#fb923c' />
          </linearGradient>
          <filter id='qcode-profile-radar-glow' x='-30%' y='-30%' width='160%' height='160%'>
            <feGaussianBlur stdDeviation='4' result='blur' />
            <feMerge>
              <feMergeNode in='blur' />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>
        </defs>

        {[0.2, 0.4, 0.6, 0.8, 1].map(factor => (
          <polygon
            key={factor}
            points={pointsFor(factor)}
            fill={factor % 0.4 === 0 ? 'rgba(99,102,241,.025)' : 'none'}
            stroke='currentColor'
            strokeWidth={factor === 1 ? 1.5 : 1}
          />
        ))}
        {dimensions.map((item, index) => {
          const [x, y] = pointAt(index, radius)
          return (
            <line
              key={item.key}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke='currentColor'
              strokeWidth='1'
            />
          )
        })}

        <polygon
          points={abilityPoints}
          fill='url(#qcode-profile-radar)'
          fillOpacity='.24'
          stroke='url(#qcode-profile-radar)'
          strokeWidth='3'
          strokeLinejoin='round'
          filter='url(#qcode-profile-radar-glow)'
        />
        {dimensions.map((item, index) => {
          const [x, y] = pointAt(
            index,
            radius * Math.max(item.score, 8) / 100
          )
          const [labelX, labelY] = pointAt(index, labelRadius)
          return (
            <g key={item.key}>
              <circle
                cx={x}
                cy={y}
                r='5'
                fill={item.color}
                stroke='white'
                strokeWidth='2'
              >
                <title>{`${item.label}：${item.xp} XP，Lv.${item.level}`}</title>
              </circle>
              <text
                x={labelX}
                y={labelY - 3}
                textAnchor='middle'
                className='fill-gray-700 text-[13px] font-bold dark:fill-gray-200'
              >
                {item.icon} {item.label}
              </text>
              <text
                x={labelX}
                y={labelY + 14}
                textAnchor='middle'
                className='fill-gray-400 text-[11px] font-black dark:fill-gray-500'
              >
                Lv.{item.level}
              </text>
            </g>
          )
        })}
      </svg>
      <div className='pointer-events-none absolute inset-x-0 bottom-3 text-center text-[10px] font-bold tracking-[0.16em] text-gray-300 dark:text-gray-600'>
        独立累计 · 500 XP 成长里程
      </div>
    </div>
  )
}

export default function AdventurerProfile({ profile }) {
  useEffect(() => {
    const key = 'qcode-adventurer-level'
    const previous = Number(window.localStorage.getItem(key) || 0)
    const message =
      previous > 0 && profile.level > previous
        ? `升级啦！现在是 Lv.${profile.level} 🎉`
        : `冒险者档案已就绪，当前 Lv.${profile.level} 🧭`
    window.localStorage.setItem(key, String(profile.level))
    window.dispatchEvent(
      new CustomEvent('qcode:pet-message', { detail: message })
    )
  }, [profile.level])

  return (
    <div className='qcode-profile-page px-4 py-8 md:px-0 md:py-12'>
      <section className='relative overflow-hidden rounded-[2rem] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-orange-50 p-6 shadow-lg dark:border-indigo-900/70 dark:from-indigo-950/50 dark:via-gray-900 dark:to-orange-950/30 md:p-10'>
        <div className='absolute -right-16 -top-16 h-56 w-56 rounded-full bg-orange-300/20 blur-3xl' />
        <div className='absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-indigo-400/15 blur-3xl' />
        <div className='relative grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-center'>
          <div>
            <div className='mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/70 px-3 py-1 text-xs font-black tracking-[0.18em] text-indigo-600 dark:border-indigo-800 dark:bg-gray-900/60 dark:text-indigo-300'>
              QCODE · ADVENTURER FILE
            </div>
            <h1 className='text-3xl font-black leading-tight text-gray-950 dark:text-white md:text-5xl'>
              橙子星球
              <span className='block bg-gradient-to-r from-indigo-600 to-orange-500 bg-clip-text text-transparent'>
                冒险者档案
              </span>
            </h1>
            <p className='mt-4 max-w-xl text-sm leading-7 text-gray-600 dark:text-gray-300 md:text-base'>
              不一定改变世界，但可能刚好有用。这里不展示私密复盘，只把每一次行动沉淀成看得见的能力与进度。
            </p>
            <div className='mt-6 flex flex-wrap gap-2'>
              <span className='rounded-full bg-indigo-100 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-200'>
                当前专精 · {profile.strongest}
              </span>
              <span className='rounded-full bg-orange-100 px-3 py-1.5 text-xs font-bold text-orange-700 dark:bg-orange-900/50 dark:text-orange-200'>
                {profile.active} 项任务进行中
              </span>
              <span className='rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200'>
                数据来自只读 Notion
              </span>
            </div>
          </div>

          <div className='rounded-[1.75rem] border border-white/80 bg-white/75 p-5 shadow-xl backdrop-blur dark:border-gray-700 dark:bg-gray-900/75'>
            <div className='flex items-end justify-between'>
              <div>
                <div className='text-xs font-black uppercase tracking-[0.2em] text-gray-400'>
                  CURRENT LEVEL
                </div>
                <div className='mt-1 text-5xl font-black text-gray-950 dark:text-white'>
                  Lv.{profile.level}
                </div>
              </div>
              <div className='text-right'>
                <div className='text-2xl'>🍊</div>
                <div className='text-xs font-bold text-gray-500'>
                  {profile.totalXp} XP
                </div>
              </div>
            </div>
            <div className='mt-5 h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800'>
              <div
                className='h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-orange-400 transition-all duration-1000'
                style={{ width: `${profile.levelXp}%` }}
              />
            </div>
            <div className='mt-2 flex justify-between text-xs text-gray-400'>
              <span>本级 {profile.levelXp} XP</span>
              <span>距离升级还差 {profile.xpToNext} XP</span>
            </div>
          </div>
        </div>
      </section>

      <section className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6'>
        <Stat value={profile.records} label='成长记录' />
        <Stat value={profile.completed} label='已完成' />
        <Stat value={profile.active} label='进行中' />
        <Stat value={profile.recent90} label='近 90 天记录' />
        <Stat value={profile.momentum30} label='30 天动能' suffix=' XP' />
        <Stat value={profile.streak} label='连续完成' suffix=' 天' />
      </section>

      <section className='mt-6 grid gap-6 lg:grid-cols-[1.25fr_.75fr]'>
        <div className='rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-8'>
          <div className='flex items-end justify-between gap-4'>
            <div>
              <div className='text-xs font-black uppercase tracking-[0.18em] text-indigo-500'>
                ABILITY MAP
              </div>
              <h2 className='mt-1 text-2xl font-black text-gray-900 dark:text-white'>
                六维能力画像
              </h2>
            </div>
            <span className='text-right text-xs leading-5 text-gray-400'>
              独立累计经验
              <br />
              不会被其他能力稀释
            </span>
          </div>
          <div className='mt-5 grid items-center gap-4 md:grid-cols-[minmax(0,1.08fr)_minmax(210px,.92fr)]'>
            <RadarChart dimensions={profile.dimensions} />
            <div className='space-y-4'>
              {profile.dimensions.map(item => (
                <div key={item.key}>
                  <div className='mb-1.5 flex items-center justify-between gap-3 text-sm'>
                    <span className='font-bold text-gray-700 dark:text-gray-200'>
                      <span className='mr-2' style={{ color: item.color }}>
                        {item.icon}
                      </span>
                      {item.label}
                    </span>
                    <span className='whitespace-nowrap font-black text-gray-500 dark:text-gray-300'>
                      Lv.{item.level}
                      <span className='ml-1 text-[10px] font-bold text-gray-400'>
                        {item.xp} XP
                      </span>
                    </span>
                  </div>
                  <div className='h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800'>
                    <div
                      className='h-full rounded-full transition-all duration-1000'
                      style={{
                        width: `${item.levelXp}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                  <div className='mt-1 flex justify-between text-[10px] text-gray-400'>
                    <span>
                      近30天 {item.recentXp > 0 ? `+${item.recentXp}` : '0'} XP
                    </span>
                    <span>距升级 {item.xpToNext} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='space-y-6'>
          <div className='rounded-[2rem] border border-orange-100 bg-orange-50/60 p-6 dark:border-orange-900/60 dark:bg-orange-950/20'>
            <div className='text-xs font-black uppercase tracking-[0.18em] text-orange-500'>
              QUEST BOARD
            </div>
            <h2 className='mt-1 text-xl font-black text-gray-900 dark:text-white'>
              任务概览
            </h2>
            <div className='mt-5 space-y-3'>
              {profile.questTypes.map(item => (
                <div
                  key={item.name}
                  className='flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 dark:bg-gray-900/70'
                >
                  <span className='text-sm font-bold text-gray-700 dark:text-gray-200'>
                    {item.name}
                  </span>
                  <span className='rounded-full bg-orange-100 px-2.5 py-1 text-xs font-black text-orange-600 dark:bg-orange-900/60 dark:text-orange-200'>
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className='rounded-[2rem] border border-indigo-100 bg-indigo-50/60 p-6 dark:border-indigo-900/60 dark:bg-indigo-950/20'>
            <div className='text-xs font-black uppercase tracking-[0.18em] text-indigo-500'>
              BADGES
            </div>
            <h2 className='mt-1 text-xl font-black text-gray-900 dark:text-white'>
              已经点亮
            </h2>
            <div className='mt-4 grid gap-3'>
              {profile.badges.map(badge => (
                <div
                  key={badge.name}
                  className='flex items-center gap-3 rounded-2xl bg-white/80 p-3 dark:bg-gray-900/70'
                >
                  <span className='flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-orange-100 text-xl dark:from-indigo-900 dark:to-orange-900'>
                    {badge.icon}
                  </span>
                  <div>
                    <div className='text-sm font-black text-gray-800 dark:text-white'>
                      {badge.name}
                    </div>
                    <div className='text-xs text-gray-400'>{badge.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className='mt-6 grid gap-6 lg:grid-cols-[1.25fr_.75fr]'>
        <div className='rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-8'>
          <div className='text-xs font-black uppercase tracking-[0.18em] text-violet-500'>
            GROWTH TREND
          </div>
          <div className='mt-1 flex flex-wrap items-end justify-between gap-2'>
            <h2 className='text-2xl font-black text-gray-900 dark:text-white'>
              近六个月成长趋势
            </h2>
            <span className='text-xs text-gray-400'>按记录日期汇总经验</span>
          </div>
          <MonthlyTrend months={profile.monthlyTrend} />
        </div>

        <div className='rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-indigo-50 p-6 dark:border-emerald-900/60 dark:from-emerald-950/25 dark:to-indigo-950/25 md:p-8'>
          <div className='text-xs font-black uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400'>
            MONTHLY REPORT
          </div>
          <h2 className='mt-1 text-2xl font-black text-gray-900 dark:text-white'>
            本月成长报告
          </h2>
          <div className='mt-6 rounded-2xl bg-white/80 p-5 dark:bg-gray-900/70'>
            <div className='text-4xl font-black text-gray-950 dark:text-white'>
              +{profile.momentum30}
              <span className='ml-1 text-sm text-gray-400'>XP</span>
            </div>
            <div className='mt-1 text-xs text-gray-500'>近30天成长动能</div>
          </div>
          <div className='mt-3 grid grid-cols-2 gap-3'>
            <div className='rounded-2xl bg-white/70 p-4 dark:bg-gray-900/60'>
              <div className={`text-lg font-black ${profile.momentumDelta >= 0 ? 'text-emerald-600' : 'text-orange-500'}`}>
                {profile.momentumDelta >= 0 ? '+' : ''}
                {profile.momentumDelta}
              </div>
              <div className='mt-1 text-[11px] text-gray-400'>较前30天</div>
            </div>
            <div className='rounded-2xl bg-white/70 p-4 dark:bg-gray-900/60'>
              <div className='truncate text-lg font-black text-indigo-600 dark:text-indigo-300'>
                {profile.fastestGrowing?.label || '积蓄中'}
              </div>
              <div className='mt-1 text-[11px] text-gray-400'>提升最快能力</div>
            </div>
          </div>
          {profile.fastestGrowing && (
            <div className='mt-4 text-sm leading-6 text-gray-600 dark:text-gray-300'>
              最近30天，{profile.fastestGrowing.label} 获得了{' '}
              <span className='font-black text-emerald-600'>
                {profile.fastestGrowing.xp} XP
              </span>
              ，是当前提升最快的方向。
            </div>
          )}
        </div>
      </section>

      <div className='mt-6 text-center text-xs leading-6 text-gray-400'>
        页面只展示聚合结果，不公开任务名称与复盘正文 · 数据会定时刷新
      </div>
    </div>
  )
}

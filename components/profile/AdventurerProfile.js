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
            <span className='text-xs text-gray-400'>优先统计近 90 天</span>
          </div>
          <div className='mt-7 space-y-5'>
            {profile.dimensions.map(item => (
              <div key={item.key}>
                <div className='mb-2 flex items-center justify-between text-sm'>
                  <span className='font-bold text-gray-700 dark:text-gray-200'>
                    <span className='mr-2' style={{ color: item.color }}>
                      {item.icon}
                    </span>
                    {item.label}
                  </span>
                  <span className='font-black text-gray-400'>{item.score}</span>
                </div>
                <div className='h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800'>
                  <div
                    className='h-full rounded-full transition-all duration-1000'
                    style={{
                      width: `${item.score}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            ))}
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

      <div className='mt-6 text-center text-xs leading-6 text-gray-400'>
        页面只展示聚合结果，不公开任务名称与复盘正文 · 数据会定时刷新
      </div>
    </div>
  )
}

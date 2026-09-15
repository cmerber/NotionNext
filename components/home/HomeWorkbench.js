import SmartLink from '@/components/SmartLink'

const entries = [
  {
    href: '/tools',
    eyebrow: 'QCODE LAB',
    title: '达闻西工具箱',
    description: '网络、密码、图片、课堂与视频，免费且尽量本地处理。',
    icon: '🧰',
    color: 'from-indigo-600 to-violet-600'
  },
  {
    href: '/projects',
    eyebrow: 'PROJECT ATLAS',
    title: '作品与项目',
    description: '集中查看做过的工具、教学实践、研究与公开成果。',
    icon: '🗺️',
    color: 'from-orange-500 to-rose-500'
  },
  {
    href: '/profile',
    eyebrow: 'ADVENTURER FILE',
    title: '冒险者档案',
    description: '从 Notion 成长记录生成等级、六维能力与成就。',
    icon: '🧭',
    color: 'from-emerald-500 to-cyan-500'
  }
]

const suggestedTools = [
  { icon: '🌐', name: '算一段子网', href: '/tools#tool=network' },
  { icon: '🗜️', name: '压缩一张图片', href: '/tools#tool=image' },
  { icon: '🎲', name: '课堂随机分组', href: '/tools#tool=classroom' },
  { icon: '🎞️', name: '生成视频任务', href: '/tools#tool=video' }
]

export default function HomeWorkbench({ profile, projects = [], postCount = 0 }) {
  const latestProjects = projects.slice(0, 3)
  return (
    <section className='mb-7 space-y-6'>
      <div className='relative overflow-hidden rounded-[2rem] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-orange-50 p-7 shadow-lg dark:border-indigo-900/70 dark:from-indigo-950/50 dark:via-gray-900 dark:to-orange-950/30 md:p-10'>
        <div className='absolute -right-16 -top-20 h-64 w-64 rounded-full bg-orange-300/20 blur-3xl' />
        <div className='absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-indigo-400/15 blur-3xl' />
        <div className='relative grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-center'>
          <div>
            <div className='inline-flex rounded-full border border-indigo-200 bg-white/70 px-3 py-1 text-xs font-black tracking-[0.18em] text-indigo-600 dark:border-indigo-800 dark:bg-gray-900/60 dark:text-indigo-300'>
              QCODE · PERSONAL LAB
            </div>
            <h1 className='mt-4 text-4xl font-black leading-tight text-gray-950 dark:text-white md:text-6xl'>
              学习、创造，<span className='block bg-gradient-to-r from-indigo-600 to-orange-500 bg-clip-text text-transparent'>然后留下点东西</span>
            </h1>
            <p className='mt-5 max-w-2xl text-sm leading-7 text-gray-600 dark:text-gray-300 md:text-base'>
              这里是橙子星球的个人实验室：写下思考、做点工具、整理作品，也记录一个普通人持续升级的过程。
            </p>
            <p className='mt-3 text-sm font-black text-indigo-600 dark:text-indigo-300'>
              不一定改变世界，但可能刚好有用。
            </p>
          </div>
          <div className='grid grid-cols-2 gap-3'>
            {[
              [5, '实用工具'],
              [projects.length, '公开项目'],
              [postCount, '学习文章'],
              [`Lv.${profile?.level || 1}`, '当前等级']
            ].map(([value, label]) => (
              <div key={label} className='rounded-2xl border border-white/80 bg-white/75 p-5 text-center shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-900/70'>
                <div className='text-2xl font-black text-gray-950 dark:text-white'>{value}</div>
                <div className='mt-1 text-xs text-gray-400'>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        {entries.map(entry => (
          <SmartLink key={entry.href} href={entry.href} className='group block'>
            <article className='h-full rounded-[1.6rem] border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900 dark:hover:border-indigo-700'>
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${entry.color} text-2xl shadow-md transition group-hover:rotate-6 group-hover:scale-110`}>
                {entry.icon}
              </div>
              <div className='mt-5 text-[10px] font-black tracking-[0.18em] text-gray-400'>{entry.eyebrow}</div>
              <h2 className='mt-1 text-xl font-black text-gray-950 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300'>{entry.title}</h2>
              <p className='mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400'>{entry.description}</p>
              <div className='mt-5 text-sm font-black text-indigo-600 dark:text-indigo-300'>进入 →</div>
            </article>
          </SmartLink>
        ))}
      </div>

      <div className='grid gap-5 lg:grid-cols-[1.1fr_.9fr]'>
        <div className='rounded-[1.75rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 md:p-7'>
          <div className='flex items-center justify-between gap-4'>
            <div>
              <div className='text-[10px] font-black tracking-[0.18em] text-orange-500'>MAYBE USEFUL TODAY</div>
              <h2 className='mt-1 text-xl font-black text-gray-950 dark:text-white'>今天可能刚好有用</h2>
            </div>
            <span className='text-3xl'>🎒</span>
          </div>
          <div className='mt-5 grid grid-cols-2 gap-3'>
            {suggestedTools.map(tool => (
              <SmartLink key={tool.href} href={tool.href} className='rounded-2xl bg-gray-50 p-4 text-sm font-bold text-gray-700 transition hover:bg-indigo-50 hover:text-indigo-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-indigo-950/50'>
                <span className='mr-2'>{tool.icon}</span>{tool.name}
              </SmartLink>
            ))}
          </div>
        </div>

        <SmartLink href='/profile' className='block'>
          <article className='h-full rounded-[1.75rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-indigo-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-emerald-900/60 dark:from-emerald-950/25 dark:to-indigo-950/25 md:p-7'>
            <div className='text-[10px] font-black tracking-[0.18em] text-emerald-600 dark:text-emerald-400'>CURRENT MOMENTUM</div>
            <h2 className='mt-1 text-xl font-black text-gray-950 dark:text-white'>最近正在升级</h2>
            <div className='mt-5 flex items-end justify-between'>
              <div>
                <div className='text-4xl font-black text-gray-950 dark:text-white'>+{profile?.momentum30 || 0}<span className='ml-1 text-sm text-gray-400'>XP</span></div>
                <div className='mt-1 text-xs text-gray-500'>近 30 天成长动能</div>
              </div>
              <div className='rounded-2xl bg-white/80 px-4 py-3 text-right dark:bg-gray-900/70'>
                <div className='text-xs text-gray-400'>当前专精</div>
                <div className='font-black text-indigo-600 dark:text-indigo-300'>{profile?.strongest || '行动力'}</div>
              </div>
            </div>
            <div className='mt-5 text-sm font-black text-emerald-600 dark:text-emerald-300'>查看完整画像 →</div>
          </article>
        </SmartLink>
      </div>

      {latestProjects.length > 0 && (
        <div className='rounded-[1.75rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 md:p-7'>
          <div className='flex items-center justify-between gap-4'>
            <div>
              <div className='text-[10px] font-black tracking-[0.18em] text-violet-500'>RECENT COORDINATES</div>
              <h2 className='mt-1 text-xl font-black text-gray-950 dark:text-white'>作品与项目</h2>
            </div>
            <SmartLink href='/projects' className='text-sm font-black text-indigo-600 dark:text-indigo-300'>查看全部 →</SmartLink>
          </div>
          <div className='mt-5 grid gap-3 md:grid-cols-3'>
            {latestProjects.map(project => (
              <SmartLink key={project.id} href={project.href} className='group rounded-2xl bg-gray-50 p-4 transition hover:bg-indigo-50 dark:bg-gray-800 dark:hover:bg-indigo-950/40'>
                <div className='text-2xl'>{project.icon}</div>
                <div className='mt-2 line-clamp-1 font-black text-gray-800 group-hover:text-indigo-600 dark:text-gray-100'>{project.title}</div>
                <div className='mt-1 text-xs text-gray-400'>{project.kind} · {project.status}</div>
              </SmartLink>
            ))}
          </div>
        </div>
      )}

      <div className='flex items-center gap-3 px-1 pt-2'>
        <div className='h-px flex-1 bg-gray-200 dark:bg-gray-700' />
        <span className='text-xs font-black tracking-[0.14em] text-gray-400'>LATEST NOTES · 最新文章</span>
        <div className='h-px flex-1 bg-gray-200 dark:bg-gray-700' />
      </div>
    </section>
  )
}

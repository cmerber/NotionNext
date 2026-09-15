import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import { useMemo, useState } from 'react'

const accents = {
  indigo: 'from-indigo-600 via-violet-600 to-blue-500',
  orange: 'from-orange-500 via-amber-500 to-rose-500',
  emerald: 'from-emerald-500 via-teal-500 to-cyan-500',
  violet: 'from-violet-600 via-fuchsia-500 to-pink-500'
}

const ProjectCard = ({ project, index }) => (
  <article className='group overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900 dark:hover:border-indigo-700'>
    <SmartLink href={project.href} className='block h-full'>
      <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${accents[project.accent] || accents.indigo}`}>
        {project.cover ? (
          <LazyImage
            priority={index < 2}
            src={project.cover}
            alt={project.title}
            className='h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-75'
          />
        ) : (
          <div className='flex h-full items-center justify-center text-7xl transition duration-500 group-hover:rotate-6 group-hover:scale-110'>
            {project.icon}
          </div>
        )}
        <div className='absolute inset-x-0 top-0 flex items-center justify-between p-4'>
          <span className='rounded-full bg-black/25 px-3 py-1 text-xs font-black text-white backdrop-blur'>
            {project.kind}
          </span>
          <span className='rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-gray-700'>
            {project.status}
          </span>
        </div>
      </div>
      <div className='flex min-h-[230px] flex-col p-6'>
        <div className='text-3xl'>{project.icon}</div>
        <h2 className='mt-3 text-xl font-black text-gray-950 transition group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300'>
          {project.title}
        </h2>
        <p className='mt-3 line-clamp-3 text-sm leading-7 text-gray-500 dark:text-gray-400'>
          {project.summary}
        </p>
        <div className='mt-auto flex flex-wrap gap-2 pt-5'>
          {project.tags.map(tag => (
            <span key={tag} className='rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-500 dark:bg-gray-800 dark:text-gray-400'>
              {tag}
            </span>
          ))}
        </div>
        <div className='mt-5 flex items-center justify-between border-t border-gray-100 pt-4 text-sm dark:border-gray-800'>
          <span className='text-xs text-gray-400'>
            {project.source === 'notion' ? '内容来自 Notion' : 'QCODE 自建项目'}
          </span>
          <span className='font-black text-indigo-600 dark:text-indigo-300'>查看项目 →</span>
        </div>
      </div>
    </SmartLink>
  </article>
)

export default function ProjectGallery({ projects = [] }) {
  const [filter, setFilter] = useState('全部')
  const filters = useMemo(
    () => ['全部', ...new Set(projects.map(item => item.kind))],
    [projects]
  )
  const visibleProjects = filter === '全部'
    ? projects
    : projects.filter(item => item.kind === filter)

  return (
    <div className='px-4 py-8 md:px-0 md:py-12'>
      <section className='relative overflow-hidden rounded-[2rem] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-orange-50 p-7 shadow-lg dark:border-indigo-900/70 dark:from-indigo-950/50 dark:via-gray-900 dark:to-orange-950/30 md:p-11'>
        <div className='absolute -right-16 -top-20 h-64 w-64 rounded-full bg-orange-300/20 blur-3xl' />
        <div className='relative max-w-3xl'>
          <div className='inline-flex rounded-full border border-indigo-200 bg-white/70 px-3 py-1 text-xs font-black tracking-[0.18em] text-indigo-600 dark:border-indigo-800 dark:bg-gray-900/60 dark:text-indigo-300'>
            QCODE · PROJECT ATLAS
          </div>
          <h1 className='mt-4 text-4xl font-black leading-tight text-gray-950 dark:text-white md:text-6xl'>
            做过的事，<span className='bg-gradient-to-r from-indigo-600 to-orange-500 bg-clip-text text-transparent'>留下坐标</span>
          </h1>
          <p className='mt-5 max-w-2xl text-sm leading-7 text-gray-600 dark:text-gray-300 md:text-base'>
            这里集中展示工具、教学、实训与研究成果。只读取已经公开的内容，私人任务与复盘不会出现在作品馆。
          </p>
          <div className='mt-6 flex flex-wrap gap-2 text-xs font-bold'>
            <span className='rounded-full bg-indigo-100 px-3 py-1.5 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-200'>{projects.length} 个公开项目</span>
            <span className='rounded-full bg-emerald-100 px-3 py-1.5 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200'>Notion 自动同步</span>
            <span className='rounded-full bg-orange-100 px-3 py-1.5 text-orange-700 dark:bg-orange-900/50 dark:text-orange-200'>持续更新</span>
          </div>
        </div>
      </section>

      <section className='mt-8'>
        <div className='flex flex-wrap gap-2'>
          {filters.map(item => (
            <button
              key={item}
              type='button'
              onClick={() => setFilter(item)}
              aria-pressed={filter === item}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${filter === item ? 'bg-indigo-600 text-white shadow-md' : 'border border-gray-200 bg-white text-gray-500 hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300'}`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className='mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
          {visibleProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </section>

      <div className='mt-8 rounded-3xl border border-dashed border-gray-300 bg-white/60 p-6 text-center text-sm leading-7 text-gray-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-400'>
        后续在 Notion 发布内容并添加“作品”或“项目”标签，就可以继续加入作品馆。
      </div>
    </div>
  )
}


import SmartLink from '@/components/SmartLink'

export default function ToolboxPromo() {
  return (
    <SmartLink href='/tools' className='block'>
      <section className='group mb-5 overflow-hidden rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-600 via-violet-600 to-orange-400 p-[1px] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-indigo-800'>
        <div className='relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-white/95 px-5 py-6 dark:bg-gray-900/95 md:px-8'>
          <div className='absolute -right-8 -top-10 h-32 w-32 rounded-full bg-orange-300/20 blur-2xl' />
          <div className='relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between'>
            <div className='flex items-start gap-4'>
              <span className='flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-orange-100 text-3xl transition duration-300 group-hover:rotate-6 group-hover:scale-110 dark:from-indigo-950 dark:to-orange-950'>
                🧰
              </span>
              <div>
                <div className='mb-1 text-xs font-black uppercase tracking-[0.18em] text-[var(--heo-color-primary)]'>
                  QCODE LAB
                </div>
                <h2 className='text-xl font-black text-gray-900 dark:text-white md:text-2xl'>
                  达闻西实用工具箱
                </h2>
                <p className='mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400'>
                  JSON、文本清理、时间戳、编码、密码、图片压缩、课堂分组 ·
                  免费且本地处理
                </p>
              </div>
            </div>
            <div className='ml-[4.5rem] flex-none rounded-full bg-[var(--heo-color-primary)] px-5 py-2.5 text-sm font-bold text-white transition group-hover:px-6 md:ml-0'>
              打开工具箱 →
            </div>
          </div>
        </div>
      </section>
    </SmartLink>
  )
}

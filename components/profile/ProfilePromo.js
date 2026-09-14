import SmartLink from '@/components/SmartLink'

export default function ProfilePromo() {
  return (
    <SmartLink href='/profile' className='block'>
      <section className='group mb-5 overflow-hidden rounded-3xl border border-orange-200 bg-gradient-to-r from-orange-400 via-amber-400 to-indigo-500 p-[1px] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-orange-900'>
        <div className='relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-white/95 px-5 py-6 dark:bg-gray-900/95 md:px-8'>
          <div className='absolute -right-8 -top-10 h-32 w-32 rounded-full bg-indigo-300/20 blur-2xl' />
          <div className='relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between'>
            <div className='flex items-start gap-4'>
              <span className='flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-indigo-100 text-3xl transition duration-300 group-hover:-rotate-6 group-hover:scale-110 dark:from-orange-950 dark:to-indigo-950'>
                🧭
              </span>
              <div>
                <div className='mb-1 text-xs font-black uppercase tracking-[0.18em] text-orange-500'>
                  ADVENTURER FILE
                </div>
                <h2 className='text-xl font-black text-gray-900 dark:text-white md:text-2xl'>
                  橙子星球 · 冒险者档案
                </h2>
                <p className='mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400'>
                  从 Notion 成长记录生成的等级、能力画像与成就
                </p>
              </div>
            </div>
            <div className='ml-[4.5rem] flex-none rounded-full bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition group-hover:px-6 md:ml-0'>
              查看画像 →
            </div>
          </div>
        </div>
      </section>
    </SmartLink>
  )
}

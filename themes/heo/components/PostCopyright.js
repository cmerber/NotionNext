import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import useIsHydrated from '@/hooks/useIsHydrated'
import CONFIG from '../config'
import NotByAI from '@/components/NotByAI'
import { resolveArticleCopyrightText } from '@/lib/utils/articleCopyright'

/**
 * 版权声明
 * @returns
 */
export default function PostCopyright({ post }) {
  const hydrated = useIsHydrated()
  // Static article HTML has no preview query. Use the serialized post URL on
  // both sides first; only show the actual browser address after hydration.
  const articlePath = post?.href || `/${(post?.slug || post?.id || '').replace(/^\/+/, '')}`
  const path = hydrated
    ? window.location.href
    : new URL(articlePath, siteConfig('LINK')).href

  const { locale } = useGlobal()
  const copyrightText = resolveArticleCopyrightText({
    post,
    locale,
    mode: siteConfig('HEO_ARTICLE_COPYRIGHT', null, CONFIG)
  })

  if (!copyrightText) {
    return <></>
  }

  return (
    <section className='dark:text-gray-300 mt-6 mx-1 '>
      <ul className='overflow-x-auto whitespace-nowrap text-sm dark:bg-gray-900 bg-gray-100 p-5 leading-8 border-l-2 border-[var(--heo-color-border)]'>
        <li>
          <strong className='mr-2'>{locale.COMMON.AUTHOR}:</strong>
          <SmartLink href={'/about'} className='hover:underline'>
            {siteConfig('AUTHOR')}
          </SmartLink>
        </li>
        <li>
          <strong className='mr-2'>{locale.COMMON.URL}:</strong>
          <a
            className='whitespace-normal break-words hover:underline'
            href={path}
          >
            {path}
          </a>
        </li>
        <li>
          <strong className='mr-2'>{locale.COMMON.COPYRIGHT}:</strong>
          {copyrightText}
        </li>
        {siteConfig('HEO_ARTICLE_NOT_BY_AI', false, CONFIG) && (
          <li>
            <NotByAI />
          </li>
        )}
      </ul>
    </section>
  )
}

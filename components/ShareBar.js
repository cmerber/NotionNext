import { siteConfig } from '@/lib/config'
import OwnerLinks from './OwnerLinks'
import { useState } from 'react'

/**
 * 分享栏
 * @param {} param0
 * @returns
 */
const ShareBar = ({ post }) => {
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  if (
    !JSON.parse(siteConfig('POST_SHARE_BAR_ENABLE')) ||
    !post ||
    post?.type !== 'Post'
  ) {
    return <></>
  }

  return (
    <div className='my-6 space-y-3 border-t pt-5'>
      <OwnerLinks />
      <button
        type='button'
        className='rounded-full border px-3 py-1.5 text-sm hover:opacity-70'
        onClick={async () => {
          try {
            const url = new URL(window.location.href)
            url.search = ''
            url.hash = ''
            await navigator.clipboard.writeText(url.href)
            setCopied(true)
            setCopyFailed(false)
          } catch {
            setCopyFailed(true)
          }
        }}>
        {copied ? '已复制文章链接' : '复制文章链接'}
      </button>
      {copyFailed && <p role='status' className='text-sm'>请从浏览器地址栏复制文章链接。</p>}
    </div>
  )
}
export default ShareBar

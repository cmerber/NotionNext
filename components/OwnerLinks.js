import { siteConfig } from '@/lib/config'

const channels = [
  ['GitHub', 'CONTACT_GITHUB', 'fab fa-github'],
  ['CSDN', 'CONTACT_CSDN', 'fas fa-code'],
  ['微信', 'CONTACT_WEHCHAT_PUBLIC', 'fab fa-weixin'],
  ['B站', 'CONTACT_BILIBILI', 'fas fa-play'],
  ['微博', 'CONTACT_WEIBO', 'fab fa-weibo'],
  ['X', 'CONTACT_TWITTER', 'fab fa-x-twitter'],
  ['Telegram', 'CONTACT_TELEGRAM', 'fab fa-telegram-plane'],
  ['掘金', 'CONTACT_JUEJIN', 'fas fa-layer-group']
]

export default function OwnerLinks({ compact = false }) {
  return (
    <nav aria-label='找到成' className='flex flex-wrap items-center gap-2'>
      {!compact && <span className='mr-1 text-sm opacity-60'>找到我</span>}
      {channels.filter((_, index) => !compact || index < 2).map(([label, key, icon]) => {
        const href = siteConfig(key) || '#'
        const unavailable = href === '#'
        return (
          <a
            key={key}
            href={href}
            target={unavailable ? undefined : '_blank'}
            rel={unavailable ? undefined : 'noopener noreferrer'}
            aria-disabled={unavailable || undefined}
            aria-label={unavailable ? `${label}，暂未设置` : label}
            title={unavailable ? `${label} · 暂未设置` : label}
            onClick={unavailable ? event => event.preventDefault() : undefined}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm ${unavailable ? 'cursor-default opacity-40' : 'hover:opacity-70'}`}>
            <i className={icon} aria-hidden='true' />
            <span>{label}</span>
          </a>
        )
      })}
    </nav>
  )
}

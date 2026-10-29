const OWNER_LINKS = {
  CONTACT_GITHUB: 'https://github.com/cmerber',
  CONTACT_CSDN: 'https://blog.csdn.net/weixin_43614987'
}

function isLegacyOwnerLink(value) {
  if (typeof value !== 'string') return false
  try {
    const url = new URL(value)
    return (
      /(^|\.)tangly1024\.com$/i.test(url.hostname) ||
      /^tanghh\.notion\.site$/i.test(url.hostname) ||
      (url.hostname === 'github.com' && /^\/tangly1024(?:\/|$)/i.test(url.pathname)) ||
      (url.hostname === 't.me' && /^\/tangly_1024(?:\/|$)/i.test(url.pathname))
    )
  } catch {
    return false
  }
}

// Apply only to identity/configuration links. Article citations keep their sources.
function resolveOwnerConfig(key, value) {
  if (OWNER_LINKS[key]) return OWNER_LINKS[key]
  if (key === 'CLARITY_ID' && value === 'mitvq51ouk') return 'z5a818jas2'
  if (key === 'LINK' && isLegacyOwnerLink(value)) return 'https://qcode.im'
  if (key.startsWith('CONTACT_') && isLegacyOwnerLink(value)) return ''
  return value
}

function ownerMenuHref(href) {
  return isLegacyOwnerLink(href) ? '#' : href
}

module.exports = { OWNER_LINKS, isLegacyOwnerLink, resolveOwnerConfig, ownerMenuHref }

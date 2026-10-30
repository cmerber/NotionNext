export function lyricScrollTop(box, line) {
  const boxRect = box.getBoundingClientRect()
  const lineRect = line.getBoundingClientRect()
  return Math.max(
    0,
    box.scrollTop +
      lineRect.top -
      boxRect.top -
      box.clientHeight / 2 +
      lineRect.height / 2
  )
}

export function shareUrl(track, target, origin) {
  if (target === 'qq') {
    for (const link of track.platforms || []) {
      try {
        const url = new URL(link.url)
        if (
          url.protocol === 'https:' &&
          url.hostname === 'y.qq.com' &&
          /\/songDetail\//.test(url.pathname)
        )
          return url.href
      } catch {
        /* Ignore malformed optional platform links. */
      }
    }
  }
  return `${origin}/music#${encodeURIComponent(track.id)}`
}

export async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return
    }
  } catch {
    /* Older browsers and restricted webviews can use the selection fallback. */
  }
  const previousFocus = document.activeElement
  const field = document.createElement('textarea')
  field.value = text
  field.setAttribute('readonly', '')
  field.style.cssText =
    'position:fixed;top:0;left:0;opacity:0;pointer-events:none'
  document.body.appendChild(field)
  try {
    field.focus()
    field.select()
    field.setSelectionRange(0, text.length)
    if (!document.execCommand?.('copy'))
      throw new Error('Clipboard unavailable')
  } finally {
    field.remove()
    previousFocus?.focus?.({ preventScroll: true })
  }
}

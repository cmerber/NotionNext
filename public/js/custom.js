// QCODE.IM 轻量交互增强；不依赖第三方脚本。
;(function initQCodeEnhancements() {
  if (window.__qcodeEnhancementsLoaded) return
  window.__qcodeEnhancementsLoaded = true

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches

  const progress = document.createElement('div')
  progress.id = 'qcode-scroll-progress'
  progress.setAttribute('aria-hidden', 'true')
  document.body.appendChild(progress)

  let ticking = false
  const updateProgress = () => {
    const root = document.documentElement
    const maxScroll = root.scrollHeight - root.clientHeight
    const ratio = maxScroll > 0 ? Math.min(1, root.scrollTop / maxScroll) : 0
    progress.style.transform = `scaleX(${ratio})`
    progress.classList.toggle('is-visible', ratio > 0.01)
    ticking = false
  }

  const requestProgressUpdate = () => {
    if (!ticking) {
      ticking = true
      window.requestAnimationFrame(updateProgress)
    }
  }

  window.addEventListener('scroll', requestProgressUpdate, { passive: true })
  window.addEventListener('resize', requestProgressUpdate, { passive: true })
  updateProgress()

  if (reducedMotion || window.matchMedia('(pointer: coarse)').matches) return

  const words = ['QCODE', '灵感', '代码', '分享', '探索', '创造']
  let wordIndex = 0

  document.addEventListener('click', event => {
    if (event.button !== 0) return
    if (
      event.target.closest(
        'a, button, input, textarea, select, canvas, [role="button"]'
      )
    ) {
      return
    }

    const popup = document.createElement('span')
    popup.className = 'qcode-click-pop'
    popup.textContent = words[wordIndex % words.length]
    popup.style.left = `${event.clientX}px`
    popup.style.top = `${event.clientY}px`
    popup.style.setProperty('--qcode-pop-hue', `${(wordIndex * 47) % 360}`)
    wordIndex += 1

    document.body.appendChild(popup)
    popup.addEventListener('animationend', () => popup.remove(), { once: true })
  })
})()

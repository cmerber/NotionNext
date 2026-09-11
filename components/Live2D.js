/* eslint-disable no-undef */
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isMobile, loadExternalResource } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

const LIVE2D_SCRIPT =
  'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@34b27cc8bcbac20e56344429e890b9bad885d002/live2d.min.js'
const PET_MESSAGES = [
  '欢迎来到橙子星球 🍊',
  '今天也要保持好奇呀',
  '轻点我会打招呼',
  '双击可以切换明暗模式',
  '读累了就休息一下吧',
  '发现新知识啦 ✨'
]

/**
 * 网页动画
 * @returns
 */
export default function Live2D() {
  const { switchTheme, toggleDarkMode } = useGlobal()
  const showPet = JSON.parse(siteConfig('WIDGET_PET'))
  const petLink = siteConfig('WIDGET_PET_LINK')
  const petSwitchTheme =
    String(siteConfig('WIDGET_PET_SWITCH_THEME')) === 'true'
  const petDoubleClickDarkMode =
    String(siteConfig('WIDGET_PET_DOUBLE_CLICK_DARK_MODE')) !== 'false'
  const [message, setMessage] = useState('')
  const [hidden, setHidden] = useState(false)
  const clickTimerRef = useRef(null)
  const messageTimerRef = useRef(null)

  useEffect(() => {
    if (!showPet || isMobile()) {
      return
    }

    setHidden(window.localStorage.getItem('qcode-pet-hidden') === 'true')

    const loadPet = () => {
      loadExternalResource(LIVE2D_SCRIPT, 'js').then(() => {
        if (typeof window?.loadlive2d !== 'undefined') {
          try {
            loadlive2d('live2d', petLink)
          } catch (error) {
            console.error('读取PET模型', error)
          }
        }
      })
    }

    const idleId = window.requestIdleCallback
      ? window.requestIdleCallback(loadPet, { timeout: 2500 })
      : window.setTimeout(loadPet, 1200)

    return () => {
      if (window.cancelIdleCallback && typeof idleId === 'number') {
        window.cancelIdleCallback(idleId)
      } else {
        window.clearTimeout(idleId)
      }
      window.clearTimeout(clickTimerRef.current)
      window.clearTimeout(messageTimerRef.current)
    }
  }, [petLink, showPet])

  const showMessage = () => {
    const nextMessage =
      PET_MESSAGES[Math.floor(Math.random() * PET_MESSAGES.length)]
    setMessage(nextMessage)
    window.clearTimeout(messageTimerRef.current)
    messageTimerRef.current = window.setTimeout(() => setMessage(''), 2600)
  }

  function handleClick() {
    window.clearTimeout(clickTimerRef.current)
    clickTimerRef.current = window.setTimeout(() => {
      showMessage()
      if (petSwitchTheme) switchTheme()
    }, 220)
  }

  function handleDoubleClick() {
    window.clearTimeout(clickTimerRef.current)
    showMessage()
    if (petDoubleClickDarkMode) toggleDarkMode()
  }

  function hidePet() {
    setHidden(true)
    window.localStorage.setItem('qcode-pet-hidden', 'true')
  }

  function restorePet() {
    setHidden(false)
    window.localStorage.removeItem('qcode-pet-hidden')
    window.setTimeout(showMessage, 50)
  }

  if (!showPet) {
    return <></>
  }

  if (hidden) {
    return (
      <button
        type='button'
        className='qcode-pet-restore'
        onClick={restorePet}
        title='召回小狗'
        aria-label='召回小狗'
      >
        🐶
      </button>
    )
  }

  return (
    <div className='qcode-pet-widget'>
      <button
        type='button'
        className='qcode-pet-close'
        onClick={hidePet}
        title='暂时隐藏小狗'
        aria-label='暂时隐藏小狗'
      >
        ×
      </button>
      {message && (
        <div className='qcode-pet-message' role='status' aria-live='polite'>
          {message}
        </div>
      )}
      <canvas
        id='live2d'
        width='280'
        height='250'
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        title='轻点互动，双击切换明暗模式'
        aria-label='橙子星球互动小狗'
        className='cursor-grab'
        onMouseDown={e => e.target.classList.add('cursor-grabbing')}
        onMouseUp={e => e.target.classList.remove('cursor-grabbing')}
      />
      <div className='qcode-pet-hint'>轻点互动 · 双击切换明暗</div>
    </div>
  )
}

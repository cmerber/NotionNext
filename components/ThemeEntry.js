import dynamic from 'next/dynamic'
import { useState } from 'react'

const ThemePanel = dynamic(() => import('./ThemeSwitch'), { ssr: false })

// Load the gallery only on request; mounting it open also handles the first click.
export default function ThemeEntry({ className = '' }) {
  const [mounted, setMounted] = useState(false)
  return (
    <>
      <button
        type='button'
        className={className}
        aria-label='切换主题'
        title='切换主题'
        onClick={() => {
          if (mounted)
            window.dispatchEvent(new Event('notionnext:open-theme-panel'))
          else setMounted(true)
        }}
      >
        <svg
          width='17'
          height='17'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.4'
          aria-hidden='true'
        >
          <rect x='3' y='3' width='7' height='7' rx='1.5' />
          <rect x='14' y='3' width='7' height='7' rx='1.5' />
          <rect x='3' y='14' width='7' height='7' rx='1.5' />
          <rect x='14' y='14' width='7' height='7' rx='1.5' />
        </svg>
      </button>
      {mounted && <ThemePanel hideFloating initiallyOpen />}
    </>
  )
}

import { startTransition, useEffect, useState } from 'react'

// URL-driven updates must wait for any server-rendered Suspense boundaries to
// hydrate. A synchronous external-store update would discard their server HTML.
export default function useIsHydrated() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    startTransition(() => setHydrated(true))
  }, [])
  return hydrated
}

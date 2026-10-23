import { useRouter } from 'next/router'
import { getQueryParam } from '@/lib/utils'
import useIsHydrated from './useIsHydrated'

// Static HTML uses the site's configured theme. Defer preview overrides until
// hydration completes so the base and page layouts start from the same markup.
export default function useThemeQuery() {
  const router = useRouter()
  const hydrated = useIsHydrated()
  return hydrated ? getQueryParam(router.asPath, 'theme') || '' : ''
}

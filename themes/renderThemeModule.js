export const ThemeLoading = () => (
  <div className='min-h-screen w-full bg-[#f6f6f1] dark:bg-black' />
)

export const getThemeExport = (mod, exportName) => {
  if (mod?.[exportName]) return mod[exportName]
  if (mod?.default?.[exportName]) return mod.default[exportName]
  if (exportName === 'LayoutBase' && typeof mod?.default === 'function') {
    return mod.default
  }
  return null
}

export function renderThemeModule(mod) {
  return function ThemeModule({ __layoutName, __fallback: Fallback, ...props }) {
    const Layout = getThemeExport(mod, __layoutName) ||
      (__layoutName !== 'LayoutBase' && getThemeExport(mod, 'LayoutSlug'))
    if (Layout) return <Layout {...props} />
    if (Fallback) return <Fallback {...props} />
    return __layoutName === 'LayoutBase' ? <>{props.children}</> : null
  }
}

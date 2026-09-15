import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import { MenuItemCollapse } from './MenuItemCollapse'

export const MenuListSide = props => {
  const { customNav, customMenu } = props
  const { locale } = useGlobal()

  let links = [
    {
      icon: 'fas fa-archive',
      name: locale.NAV.ARCHIVE,
      href: '/archive',
      show: siteConfig('HEO_MENU_ARCHIVE', null, CONFIG)
    },
    {
      icon: 'fas fa-search',
      name: locale.NAV.SEARCH,
      href: '/search',
      show: siteConfig('HEO_MENU_SEARCH', null, CONFIG)
    },
    {
      icon: 'fas fa-folder',
      name: locale.COMMON.CATEGORY,
      href: '/category',
      show: siteConfig('HEO_MENU_CATEGORY', null, CONFIG)
    },
    {
      icon: 'fas fa-tag',
      name: locale.COMMON.TAGS,
      href: '/tag',
      show: siteConfig('HEO_MENU_TAG', null, CONFIG)
    }
  ]

  if (customNav) {
    links = customNav.concat(links)
  }

  // 如果 开启自定义菜单，则覆盖Page生成的菜单
  if (siteConfig('CUSTOM_MENU')) {
    links = customMenu
  }

  const qcodeLinks = [
    {
      id: 'qcode-profile',
      icon: 'fas fa-compass',
      name: '冒险档案',
      href: '/profile',
      show: true
    },
    {
      id: 'qcode-projects',
      icon: 'fas fa-map',
      name: '作品馆',
      href: '/projects',
      show: true
    },
    {
      id: 'qcode-toolbox',
      icon: 'fas fa-toolbox',
      name: '实用工具',
      href: '/tools',
      show: true
    }
  ]
  links = [
    ...qcodeLinks.filter(item => !links?.some(link => link?.href === item.href)),
    ...(links || [])
  ]

  if (!links || links.length === 0) {
    return null
  }

  return (
    <nav className='flex-col space-y-1'>
      {links?.map((link, index) => (
        <MenuItemCollapse key={index} link={link} />
      ))}
    </nav>
  )
}

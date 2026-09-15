const PROJECT_META = {
  '网页设计与制作': {
    icon: '🧑‍🏫',
    kind: '教学项目',
    status: '持续更新',
    accent: 'indigo',
    summary: '课程备课、课堂讲授与网页设计学习内容的持续沉淀。'
  },
  'OPPO电商网站实训': {
    icon: '🛍️',
    kind: '实训项目',
    status: '已完成',
    accent: 'orange',
    summary: '围绕电商网站展开的网页设计、页面制作与实践训练。'
  },
  'Modern Educational': {
    icon: '📚',
    kind: '学习资源',
    status: '持续整理',
    accent: 'emerald',
    summary: '面向教学与学习场景整理的现代教育资源入口。'
  },
  '何为粒计算': {
    icon: '🔬',
    kind: '研究项目',
    status: '研究中',
    accent: 'violet',
    summary: '关于粒计算概念、方法与研究方向的学习记录。'
  }
}

const tagNames = page => [
  ...(Array.isArray(page?.tags) ? page.tags : []),
  ...(Array.isArray(page?.tagItems)
    ? page.tagItems.map(item => item?.name)
    : [])
]
  .filter(Boolean)
  .map(String)

const isPublicProject = page => {
  if (page?.type !== 'Post' || page?.status !== 'Published') return false
  if (PROJECT_META[page.title]) return true
  const tags = tagNames(page)
  return page.category === '作品' || tags.some(tag => /作品|项目|project/i.test(tag))
}

const toProject = page => {
  const meta = PROJECT_META[page.title] || {}
  const tags = tagNames(page).filter(tag => !/作品|项目|project/i.test(tag))
  return {
    id: page.id || page.slug || page.title,
    title: page.title,
    href: page.href || `/article/${page.slug}`,
    cover: page.pageCoverThumbnail || page.pageCover || '',
    summary: page.summary || meta.summary || '查看这个项目的公开介绍与最新进展。',
    icon: meta.icon || '🧪',
    kind: meta.kind || page.category || '个人项目',
    status: meta.status || '持续更新',
    accent: meta.accent || 'indigo',
    date: page.publishDay || page.lastEditedDay || '',
    tags: tags.slice(0, 3),
    source: 'notion'
  }
}

const TOOLBOX_PROJECT = {
  id: 'qcode-toolbox',
  title: '达闻西实用工具箱',
  href: '/tools',
  cover: '',
  summary: '把网络、密码、图片、课堂和视频能力装进一个免费、无需登录的浏览器工具箱。',
  icon: '🧰',
  kind: '工具作品',
  status: '持续更新',
  accent: 'indigo',
  date: '',
  tags: ['本地处理', '免费实用', '5 套工具'],
  source: 'site'
}

export function buildPublicProjects(pages = []) {
  const notionProjects = pages.filter(isPublicProject).map(toProject)
  return [TOOLBOX_PROJECT, ...notionProjects]
}


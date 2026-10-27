export const PLACES = [
  {
    id: 'library',
    number: '01',
    title: '风声书屋',
    label: '文章与笔记',
    icon: '▤',
    href: '/archive',
    action: '推门，读一页',
    text: '把学到的、想明白的，慢慢放进书里。',
    position: [-3.4, 0, -2],
    door: [-3.4, -0.45]
  },
  {
    id: 'workshop',
    number: '02',
    title: '玻璃工坊',
    label: '实用工具',
    icon: '⌘',
    href: '/tools',
    action: '去工坊试一试',
    text: '图片、网络和课堂里的小问题，都有顺手的工具。',
    position: [2.6, 0, -2.3],
    door: [2.6, -0.7]
  },
  {
    id: 'observatory',
    number: '03',
    title: '星野观测站',
    label: '成长与档案',
    icon: '✧',
    href: '/profile',
    action: '打开冒险档案',
    text: '从这里，看见每一次行动积累的微光。',
    position: [4.7, 0, 2.2],
    door: [4.7, 3.8]
  },
  {
    id: 'home',
    number: '04',
    title: '山丘居所',
    label: '关于我与小岛',
    icon: '⌂',
    href: '/about',
    action: '来认识一下',
    text: '你好，我是成。写代码、做研究，也认真过日子。',
    position: [-3.4, 0, 3.1],
    door: [-3.4, 4.45]
  }
]

export const WALK_ROUTES = {
  library: [
    [0, 0.6],
    [-1.2, 0.4],
    [-3.4, 0.4],
    [-3.4, -0.45]
  ],
  workshop: [
    [0, 0.6],
    [1.2, 0.4],
    [2.6, 0.4],
    [2.6, -0.7]
  ],
  observatory: [
    [0, 0.6],
    [1.4, 1.6],
    [2.7, 3.8],
    [4.7, 3.8]
  ],
  home: [
    [0, 0.6],
    [-1.4, 1.6],
    [-1.4, 4.45],
    [-3.4, 4.45]
  ]
}

export const postHref = post =>
  post.href ||
  (String(post.slug || '').startsWith('article/')
    ? `/${post.slug}`
    : `/article/${post.slug || post.id}`)

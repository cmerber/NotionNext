const NOTION_VERSION = '2026-03-11'

const DIMENSIONS = [
  { key: 'tech', label: '技术力', icon: '⌘', color: '#6366f1' },
  { key: 'teaching', label: '教学力', icon: '✦', color: '#0ea5e9' },
  { key: 'creative', label: '创造力', icon: '◈', color: '#f97316' },
  { key: 'expression', label: '表达力', icon: '✎', color: '#ec4899' },
  { key: 'action', label: '行动力', icon: '➜', color: '#22c55e' },
  { key: 'vitality', label: '生命力', icon: '☀', color: '#eab308' }
]

const KEYWORDS = {
  tech: [
    '代码',
    '编程',
    '算法',
    '模型',
    '系统',
    '数据',
    '网络',
    '开发',
    'detection',
    'algorithm',
    'model',
    'code',
    'granularity',
    'entropy'
  ],
  teaching: [
    '教学',
    '课堂',
    '课程',
    '学生',
    '备课',
    '讲授',
    '教案',
    'education'
  ],
  creative: [
    '设计',
    '创作',
    '作品',
    '研究',
    '论文',
    '实验',
    '创新',
    'research',
    'paper',
    'novel'
  ],
  expression: [
    '写作',
    '文章',
    '分享',
    '演讲',
    '汇报',
    '复盘',
    '表达',
    'writing'
  ],
  action: ['完成', '发布', '部署', '上线', '实践', '计划', '项目', 'project'],
  vitality: ['运动', '跑步', '健身', '旅行', '生活', '阅读', '休息', '健康']
}

const getPlainText = property => {
  const values = property?.title || property?.rich_text || []
  return values
    .map(item => item?.plain_text || '')
    .join('')
    .trim()
}

const getNumber = property => {
  if (typeof property?.number === 'number') return property.number
  if (typeof property?.formula?.number === 'number')
    return property.formula.number
  return 0
}

const getName = property =>
  property?.select?.name ||
  property?.status?.name ||
  property?.formula?.string ||
  ''

const getDimensionNames = property => {
  if (property?.multi_select)
    return property.multi_select.map(item => item.name)
  if (property?.select?.name) return [property.select.name]
  return []
}

const getDate = property => property?.date?.end || property?.date?.start || null

const isCompleted = status => /已完成|完成|done|complete/i.test(status)
const isActive = status => /进行中|正在|doing|progress/i.test(status)

function inferDimensions(properties) {
  const explicit = getDimensionNames(properties['领域'])
  const explicitKeys = DIMENSIONS.filter(item =>
    explicit.includes(item.label)
  ).map(item => item.key)
  if (explicitKeys.length) return explicitKeys

  const searchable = `${getPlainText(properties['名称'])} ${getPlainText(
    properties['复盘']
  )}`.toLowerCase()
  const matches = Object.entries(KEYWORDS)
    .map(([key, words]) => ({
      key,
      hits: words.reduce(
        (count, word) => count + (searchable.includes(word) ? 1 : 0),
        0
      )
    }))
    .filter(item => item.hits > 0)
    .sort((a, b) => b.hits - a.hits)

  return matches.length ? matches.slice(0, 2).map(item => item.key) : ['action']
}

function parseRecord(page) {
  const properties = page?.properties || {}
  const title = getPlainText(properties['名称'])
  // Notion 数据库里偶尔会残留未命名的新建行；它不是一次真实成长，
  // 不应因为默认等级而产生经验值或影响画像。
  if (!title || page?.archived || page?.in_trash) return null
  const level = Math.max(1, getNumber(properties['等级']) || 1)
  const difficulty = getName(properties['难度'])
  const difficultyWeight = /困难|hard/i.test(difficulty)
    ? 1.5
    : /极难|boss|史诗/i.test(difficulty)
      ? 2
      : /简单|easy/i.test(difficulty)
        ? 0.8
        : 1
  const xp = Math.max(
    0,
    Math.round(getNumber(properties['经验值']) || level * 10 * difficultyWeight)
  )
  const status = getName(properties['状态'])

  return {
    xp,
    status,
    completed: isCompleted(status),
    active: isActive(status),
    date: getDate(properties['日期']),
    type: getName(properties['类型']) || '成长记录',
    dimensions: inferDimensions(properties)
  }
}

const daysAgo = (date, days, now) => {
  if (!date) return false
  const timestamp = new Date(date).getTime()
  return (
    Number.isFinite(timestamp) &&
    timestamp >= now - days * 86400000 &&
    timestamp <= now
  )
}

function calculateStreak(records) {
  const days = [
    ...new Set(
      records
        .filter(item => item.completed && item.date)
        .map(item => item.date.slice(0, 10))
    )
  ]
    .sort()
    .reverse()
  if (!days.length) return 0

  let streak = 1
  for (let index = 1; index < days.length; index++) {
    const previous = new Date(days[index - 1]).getTime()
    const current = new Date(days[index]).getTime()
    const gap = Math.round((previous - current) / 86400000)
    if (gap > 1) break
    streak += 1
  }
  return streak
}

function buildProfile(records, source = 'notion') {
  const now = Date.now()
  const totalXp = records.reduce((sum, item) => sum + item.xp, 0)
  const level = Math.floor(totalXp / 100) + 1
  const levelXp = totalXp % 100
  const recentRecords = records.filter(item => daysAgo(item.date, 90, now))
  const scoringRecords = recentRecords.length ? recentRecords : records
  const dimensionXp = Object.fromEntries(DIMENSIONS.map(item => [item.key, 0]))

  scoringRecords.forEach(record => {
    const share = record.xp / Math.max(record.dimensions.length, 1)
    record.dimensions.forEach(key => {
      dimensionXp[key] = (dimensionXp[key] || 0) + share
    })
  })

  const maxDimensionXp = Math.max(...Object.values(dimensionXp), 1)
  const dimensions = DIMENSIONS.map(item => ({
    ...item,
    score: Math.round((dimensionXp[item.key] / maxDimensionXp) * 100)
  }))
  const strongest = [...dimensions].sort((a, b) => b.score - a.score)[0]
  const typeCounts = records.reduce((result, item) => {
    result[item.type] = (result[item.type] || 0) + 1
    return result
  }, {})

  const badges = [
    records.length >= 1 && {
      icon: '🧭',
      name: '启程者',
      note: '留下第一条成长记录'
    },
    totalXp >= 100 && { icon: '🔥', name: '百炼成章', note: '累计获得 100 XP' },
    records.some(item => item.completed) && {
      icon: '🏁',
      name: '任务终结者',
      note: '完成至少一项挑战'
    },
    strongest?.score >= 80 && {
      icon: '💎',
      name: `${strongest.label}专精`,
      note: `当前最鲜明的能力方向`
    }
  ].filter(Boolean)

  return {
    source,
    generatedAt: new Date(now).toISOString(),
    level,
    totalXp,
    levelXp,
    xpToNext: 100 - levelXp,
    records: records.length,
    completed: records.filter(item => item.completed).length,
    active: records.filter(item => item.active).length,
    recent90: recentRecords.length,
    momentum30: records
      .filter(item => daysAgo(item.date, 30, now))
      .reduce((sum, item) => sum + item.xp, 0),
    streak: calculateStreak(records),
    dimensions,
    strongest: strongest?.label || '行动力',
    questTypes: Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count })),
    badges
  }
}

const fallbackProfile = () =>
  buildProfile(
    [
      {
        xp: 20,
        status: '已完成',
        completed: true,
        active: false,
        date: null,
        type: '主线',
        dimensions: ['tech', 'creative']
      },
      {
        xp: 50,
        status: '进行中',
        completed: false,
        active: true,
        date: null,
        type: '主线',
        dimensions: ['tech', 'creative']
      },
      {
        xp: 50,
        status: '进行中',
        completed: false,
        active: true,
        date: null,
        type: '主线',
        dimensions: ['tech', 'creative']
      }
    ],
    'preview'
  )

async function notionRequest(path, options = {}) {
  const token = process.env.NOTION_PROFILE_TOKEN
  if (!token) throw new Error('NOTION_PROFILE_TOKEN is missing')

  const response = await fetch(`https://api.notion.com/v1${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  })

  if (!response.ok) {
    throw new Error(`Notion profile request failed with ${response.status}`)
  }
  return response.json()
}

async function queryAllRecords(dataSourceId) {
  const records = []
  let cursor

  do {
    const body = { page_size: 100 }
    if (cursor) body.start_cursor = cursor
    const response = await notionRequest(
      `/data_sources/${dataSourceId}/query`,
      {
        method: 'POST',
        body: JSON.stringify(body)
      }
    )
    records.push(...(response.results || []))
    cursor = response.has_more ? response.next_cursor : null
  } while (cursor)

  return records
}

export async function getAdventurerProfile() {
  const databaseId = process.env.NOTION_PROFILE_DATABASE_ID
  if (!process.env.NOTION_PROFILE_TOKEN || !databaseId) return fallbackProfile()

  try {
    const database = await notionRequest(`/databases/${databaseId}`)
    const dataSourceId = database?.data_sources?.[0]?.id
    if (!dataSourceId) throw new Error('Notion data source not found')
    const pages = await queryAllRecords(dataSourceId)
    return buildProfile(pages.map(parseRecord).filter(Boolean), 'notion')
  } catch (error) {
    console.error(
      '[profile] Failed to build adventurer profile:',
      error.message
    )
    return fallbackProfile()
  }
}

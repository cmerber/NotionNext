import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
require('./translate/load-env').loadEnv()

const DASHBOARD_NAME = '橙子星球｜运营展板'
const rt = text => [{ type: 'text', text: { content: String(text).slice(0, 1900) } }]
const paragraph = text => ({ object: 'block', type: 'paragraph', paragraph: { rich_text: rt(text) } })
const number = value => ({ number: value })
const rich = value => ({ rich_text: rt(value) })
const heading = text => ({ object: 'block', type: 'heading_2', heading_2: { rich_text: rt(text) } })
const display = value => value === null ? '待获取' : String(value)
const snapshotSchema = {
  名称: { title: {} }, 同步键: { rich_text: {} }, 采集时间: { date: {} }, 统计窗口: { date: {} },
  会话数: { number: { format: 'number' } }, 访客数: { number: { format: 'number' } },
  机器人会话: { number: { format: 'number' } }, 每会话页面数: { number: { format: 'number' } },
  活跃秒数: { number: { format: 'number' } }, 滚动深度: { number: { format: 'number' } },
  项目: { rich_text: {} }, 来源: { url: {} }
}

export function schemaPatch(properties) {
  const title = Object.entries(properties).find(([, field]) => field.type === 'title')
  if (!title) throw new Error('快照库缺少标题字段。')
  const patch = {}
  if (title[0] !== '名称') {
    if (properties.名称) throw new Error('名称字段已被其他类型占用；未更改结构。')
    patch[title[0]] = { name: '名称' }
  }
  for (const [name, definition] of Object.entries(snapshotSchema)) {
    if (name === '名称') continue
    if (!properties[name]) patch[name] = definition
    else if (properties[name].type !== Object.keys(definition)[0]) {
      throw new Error(`快照库的 ${name} 字段类型不匹配；未更改结构。`)
    }
  }
  return patch
}

export function numeric(value) {
  if (value === null || value === undefined || value === '') return null
  const result = Number(value)
  return Number.isFinite(result) && result >= 0 ? result : null
}

function firstNumber(row, keys) {
  for (const key of keys) {
    const value = numeric(row?.[key])
    if (value !== null) return value
  }
  return null
}

export function normalizeClarity(payload, pagesPayload = []) {
  if (!Array.isArray(payload)) throw new Error('Clarity 返回的不是指标数组；保留现有展板。')
  const rows = name => payload.find(item => item.metricName === name)?.information || []
  const traffic = rows('Traffic')
  // An unsegmented response has one total row. Never sum distinct users across dimensions.
  if (traffic.length !== 1) throw new Error('Clarity 总览缺少唯一汇总行；保留现有展板。')
  const total = traffic[0]
  const sessions = firstNumber(total, ['totalSessionCount'])
  if (sessions === null) throw new Error('Clarity 总览缺少有效会话数；保留现有展板。')
  const urlTraffic = Array.isArray(pagesPayload)
    ? pagesPayload.find(item => item.metricName === 'Traffic')?.information || []
    : []
  const pages = urlTraffic.map(row => {
    const url = row.URL || row.Url || row.url
    if (typeof url !== 'string') return null
    try {
      const parsed = new URL(url)
      if (parsed.origin !== 'https://qcode.im') return null
      return { url: parsed.origin + parsed.pathname, sessions: firstNumber(row, ['totalSessionCount']) }
    } catch { return null }
  }).filter(row => row && row.sessions !== null)
  // Query strings may produce several rows for a path; summing sessions would double count.
  const uniquePages = new Map()
  for (const row of pages) {
    const previous = uniquePages.get(row.url)
    if (!previous || row.sessions > previous.sessions) uniquePages.set(row.url, row)
  }
  return {
    sessions,
    users: firstNumber(total, ['distantUserCount', 'distinctUserCount']),
    bots: firstNumber(total, ['totalBotSessionCount']),
    pagesPerSession: firstNumber(total, ['PagesPerSessionPercentage']),
    activeSeconds: firstNumber(rows('EngagementTime')[0], ['activeTime']),
    scrollDepth: firstNumber(rows('ScrollDepth')[0], ['averageScrollDepth']),
    pages: [...uniquePages.values()].sort((a, b) => b.sessions - a.sessions).slice(0, 10)
  }
}

export function snapshotKey(projectId, time) {
  if (!/^[a-z0-9]+$/i.test(projectId || '')) throw new Error('需要有效的 CLARITY_PROJECT_ID。')
  return `${projectId}:${new Date(time).toISOString().slice(0, 10)}:rolling24h`
}

export function snapshotProperties(projectId, time, metrics) {
  const end = new Date(time).toISOString()
  const start = new Date(new Date(time).getTime() - 86400000).toISOString()
  return {
    名称: { title: rt(`${end.slice(0, 10)} · 最近24小时`) },
    同步键: rich(snapshotKey(projectId, time)),
    采集时间: { date: { start: end } },
    统计窗口: { date: { start, end } },
    会话数: number(metrics.sessions),
    访客数: number(metrics.users),
    机器人会话: number(metrics.bots),
    每会话页面数: number(metrics.pagesPerSession),
    活跃秒数: number(metrics.activeSeconds),
    滚动深度: number(metrics.scrollDepth),
    项目: rich(projectId),
    来源: { url: `https://clarity.microsoft.com/projects/view/${projectId}/dashboard` }
  }
}

export class NotionAPI {
  constructor(token, fetcher = fetch) {
    if (!token) throw new Error('尚未配置 NOTION_TOKEN。')
    this.token = token
    this.fetcher = fetcher
    this.nextRequestAt = 0
  }

  async request(method, endpoint, body) {
    const wait = this.nextRequestAt - Date.now()
    if (wait > 0) await new Promise(resolve => setTimeout(resolve, wait))
    this.nextRequestAt = Date.now() + 350
    const response = await this.fetcher(`https://api.notion.com/v1/${endpoint}`, {
      method,
      headers: { Authorization: `Bearer ${this.token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(25000)
    })
    if (!response.ok) {
      // Do not echo request bodies, tokens or full service error responses into logs.
      throw new Error(`Notion ${method} ${endpoint.split('/')[0]} 失败（HTTP ${response.status}）。未删除现有数据。`)
    }
    return response.json()
  }

  async query(databaseId, filter) {
    return this.request('POST', `databases/${databaseId}/query`, { filter, page_size: 2 })
  }

  async children(id) {
    const results = []
    let cursor
    do {
      const page = await this.request('GET', `blocks/${id}/children?page_size=100${cursor ? `&start_cursor=${cursor}` : ''}`)
      results.push(...page.results)
      cursor = page.has_more ? page.next_cursor : null
    } while (cursor)
    return results
  }
}

export async function upsertSnapshot(api, databaseId, properties) {
  const key = properties.同步键.rich_text[0].text.content
  const found = await api.query(databaseId, { property: '同步键', rich_text: { equals: key } })
  if (found.results.length > 1 || found.has_more) throw new Error('检测到重复统计记录，请先核对；未覆盖。')
  if (found.results.length) {
    return api.request('PATCH', `pages/${found.results[0].id}`, { properties })
  }
  return api.request('POST', 'pages', { parent: { database_id: databaseId }, properties })
}

async function ensureDashboard(api, notesId, pageId) {
  let note
  if (pageId) {
    note = await api.request('GET', `pages/${pageId}`)
  } else {
    const source = await api.request('GET', `databases/${notesId}`)
    const titleKey = Object.entries(source.properties).find(([, value]) => value.type === 'title')?.[0]
    if (!titleKey) throw new Error('笔记库缺少标题字段。')
    const existing = await api.query(notesId, { property: titleKey, title: { equals: DASHBOARD_NAME } })
    if (existing.results.length > 1 || existing.has_more) throw new Error('存在多个同名展板，请先核对。')
    note = existing.results[0]
    if (!note) {
      note = await api.request('POST', 'pages', {
        parent: { database_id: notesId }, icon: { type: 'emoji', emoji: '📊' },
        properties: { [titleKey]: { title: rt(DASHBOARD_NAME) } }
      })
    }
  }
  let blocks = await api.children(note.id)
  if (!blocks.some(block => block.type === 'callout')) {
    await api.request('PATCH', `blocks/${note.id}/children`, { children: [
      { object: 'block', type: 'callout', callout: { icon: { type: 'emoji', emoji: '🍊' }, rich_text: rt('尚未同步真实数据。会话数、访客数和热门页面将在首次成功同步后显示。') } },
      paragraph('口径：Clarity 最近24小时滚动窗口；按 UTC 采集日期保留一条快照，不等同于自然日统计。缺失指标显示“待获取”。'),
      { object: 'block', type: 'bookmark', bookmark: { url: 'https://qcode.im', caption: rt('橙子星球') } },
      { object: 'block', type: 'bookmark', bookmark: { url: 'https://clarity.microsoft.com/', caption: rt('热力图与访问回放') } },
      heading('最近快照'),
      heading('热门页面 · 会话数'),
      paragraph('热门页面：尚未同步')
    ] })
    blocks = await api.children(note.id)
  }
  if (!blocks.some(block => block.type === 'paragraph' && block.paragraph.rich_text?.some(t => (t.plain_text || t.text?.content || '').startsWith('热门页面：')))) {
    await api.request('PATCH', `blocks/${note.id}/children`, { children: [
      heading('热门页面 · 会话数'), paragraph('热门页面：尚未同步')
    ] })
    blocks = await api.children(note.id)
  }
  const databaseTitle = '橙子星球｜访问快照'
  let database = blocks.find(block => block.type === 'child_database' && block.child_database.title === databaseTitle)
  if (!database) {
    database = await api.request('POST', 'databases', {
      parent: { type: 'page_id', page_id: note.id }, is_inline: true,
      title: rt(databaseTitle), properties: snapshotSchema
    })
  } else {
    const existingSchema = await api.request('GET', `databases/${database.id}`)
    const patch = schemaPatch(existingSchema.properties)
    if (Object.keys(patch).length) {
      await api.request('PATCH', `databases/${database.id}`, { properties: patch })
    }
  }
  return { note, database, summary: blocks.find(block => block.type === 'callout'), popular: blocks.find(block => block.type === 'paragraph' && block.paragraph.rich_text?.some(t => t.plain_text?.startsWith('热门页面：') || t.text?.content?.startsWith('热门页面：'))) }
}

async function fetchClarity(token, dimension) {
  if (!token) throw new Error('尚未配置 CLARITY_API_TOKEN。')
  const url = new URL('https://www.clarity.ms/export-data/api/v1/project-live-insights')
  url.searchParams.set('numOfDays', '1')
  if (dimension) url.searchParams.set('dimension1', dimension)
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(30000) })
  if (!response.ok) throw new Error(`Clarity 导出失败（HTTP ${response.status}）。保留现有展板，不自动重试以免耗尽每日配额。`)
  return response.json()
}

export async function main(argv = process.argv.slice(2)) {
  if (argv.includes('--help')) {
    console.log('node scripts/clarity-notion.mjs --init | --dry-run | --sync [--refresh]\n需要 NOTION_TOKEN、CLARITY_PROJECT_ID、CLARITY_API_TOKEN；--init 仅需 Notion。默认不执行操作。')
    return
  }
  const modes = argv.filter(a => ['--init', '--dry-run', '--sync'].includes(a))
  if (modes.length !== 1 || argv.some(a => !['--init', '--dry-run', '--sync', '--refresh'].includes(a))) {
    throw new Error('请只指定一种模式：--init、--dry-run 或 --sync，可选 --refresh。')
  }
  const projectId = process.env.CLARITY_PROJECT_ID
  const notesId = process.env.NOTION_ANALYTICS_NOTES_DATABASE_ID
  const pageId = process.env.NOTION_ANALYTICS_PAGE_ID
  if (!argv.includes('--dry-run') && !/^[0-9a-f-]{32,36}$/i.test(pageId || notesId || '')) {
    throw new Error('需要有效的 NOTION_ANALYTICS_PAGE_ID 或 NOTION_ANALYTICS_NOTES_DATABASE_ID。')
  }
  if (argv.includes('--init')) {
    const api = new NotionAPI(process.env.NOTION_TOKEN)
    const dashboard = await ensureDashboard(api, notesId, pageId)
    console.log(`展板已就绪：${dashboard.note.url}；尚未获取统计数据。`)
    return
  }
  const api = argv.includes('--sync') ? new NotionAPI(process.env.NOTION_TOKEN) : null
  const collectedAt = new Date().toISOString()
  const key = snapshotKey(projectId, collectedAt)
  const cacheDir = path.resolve('.tmp/clarity')
  const cacheFile = path.join(cacheDir, key.replaceAll(':', '-') + '.json')
  let payload
  if (!argv.includes('--refresh')) {
    try { payload = JSON.parse(await fs.readFile(cacheFile, 'utf8')) } catch (error) { if (error.code !== 'ENOENT') throw error }
  }
  if (!payload) {
    const overview = await fetchClarity(process.env.CLARITY_API_TOKEN)
    const pages = await fetchClarity(process.env.CLARITY_API_TOKEN, 'URL')
    normalizeClarity(overview, pages)
    payload = { collectedAt, overview, pages }
    await fs.mkdir(cacheDir, { recursive: true })
    await fs.writeFile(cacheFile, JSON.stringify(payload), { mode: 0o600 })
  }
  const metrics = normalizeClarity(payload.overview, payload.pages)
  const properties = snapshotProperties(projectId, payload.collectedAt, metrics)
  if (argv.includes('--dry-run')) {
    console.log(JSON.stringify({ mode: '只读预览，未写入 Notion', collectedAt: payload.collectedAt, metrics }, null, 2))
    return
  }
  const dashboard = await ensureDashboard(api, notesId, pageId)
  await upsertSnapshot(api, dashboard.database.id, properties)
  await api.request('PATCH', `blocks/${dashboard.summary.id}`, { callout: { rich_text: rt(
    `最近24小时：会话 ${display(metrics.sessions)}　访客 ${display(metrics.users)}　机器人会话 ${display(metrics.bots)}\n采集：${new Date(payload.collectedAt).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false })}（北京时间）· Clarity`
  ) } })
  if (dashboard.popular) await api.request('PATCH', `blocks/${dashboard.popular.id}`, { paragraph: { rich_text: rt(
    '热门页面：\n' + (metrics.pages.map(p => `${p.sessions} · ${p.url}`).join('\n') || '接口暂未返回可识别的页面数据')
  ) } })
  console.log(`同步完成：${dashboard.note.url}。同一项目、同一 UTC 采集日期更新原记录。`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1 })
}

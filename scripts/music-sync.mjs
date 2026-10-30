import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseLrc } from '../lib/music/lyrics.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const version = '2026-03-11'
const plain = prop =>
  (prop?.title || prop?.rich_text || [])
    .map(t => t.plain_text || t.text?.content || '')
    .join('')
    .trim()
const fileUrl = prop =>
  prop?.files?.[0]?.file?.url ||
  prop?.files?.[0]?.external?.url ||
  prop?.url ||
  ''

async function notion(route, body) {
  const response = await fetch(`https://api.notion.com/v1${route}`, {
    method: body ? 'POST' : 'GET',
    headers: {
      Authorization: `Bearer ${process.env.NOTION_MUSIC_TOKEN}`,
      'Notion-Version': version,
      'Content-Type': 'application/json'
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(30000)
  })
  if (!response.ok) throw new Error(`Notion music API: HTTP ${response.status}`)
  return response.json()
}

// Files are copied before publication: Notion attachment URLs expire.
async function asset(url, maxBytes) {
  const parsed = new URL(url)
  if (
    parsed.protocol !== 'https:' ||
    !/(^|\.)(notion\.so|notion\.com|amazonaws\.com)$/.test(parsed.hostname)
  )
    throw new Error('音乐附件请直接上传到 Notion，不能使用未知外部文件地址。')
  const response = await fetch(url, {
    redirect: 'error',
    signal: AbortSignal.timeout(60000)
  })
  if (!response.ok) throw new Error(`Music attachment: HTTP ${response.status}`)
  if (Number(response.headers.get('content-length')) > maxBytes)
    throw new Error('音乐附件过大')
  const chunks = []
  let size = 0
  for await (const chunk of response.body) {
    size += chunk.length
    if (size > maxBytes) throw new Error('音乐附件过大')
    chunks.push(chunk)
  }
  return Buffer.concat(chunks)
}

export function platformLinks(properties) {
  return [
    ['QQ音乐', 'QQ音乐', /(^|\.)(qq\.com)$/],
    ['酷狗音乐', '酷狗音乐', /(^|\.)kugou\.com$/],
    ['网易云音乐', '网易云音乐', /(^|\.)music\.163\.com$/],
    ['B站', 'B站', /(^|\.)(bilibili\.com|b23\.tv)$/]
  ].flatMap(([name, key, hosts]) => {
    const value = properties[key]?.url
    if (!value) return []
    const url = new URL(value)
    if (url.protocol !== 'https:' || !hosts.test(url.hostname))
      throw new Error(`${name} 链接域名不匹配`)
    return [{ name, url: url.href }]
  })
}

export async function syncMusic() {
  if (!process.env.NOTION_MUSIC_TOKEN || !process.env.NOTION_MUSIC_DATABASE_ID)
    throw new Error('请设置 NOTION_MUSIC_TOKEN 和 NOTION_MUSIC_DATABASE_ID。')
  const target = path.join(root, 'public/music')
  const existing = JSON.parse(
    await fs.readFile(path.join(target, 'catalog.json'), 'utf8')
  )
  const database = await notion(
    `/databases/${process.env.NOTION_MUSIC_DATABASE_ID}`
  )
  const source = database.data_sources?.[0]?.id
  if (!source) throw new Error('音乐库缺少 data source')
  const pages = []
  let cursor
  do {
    const result = await notion(`/data_sources/${source}/query`, {
      page_size: 100,
      ...(cursor ? { start_cursor: cursor } : {})
    })
    pages.push(...result.results)
    cursor = result.has_more ? result.next_cursor : null
  } while (cursor)
  const files = []
  const tracks = []
  for (const page of pages.filter(
    x => !x.archived && !x.in_trash && x.properties['发布']?.checkbox
  )) {
    const p = page.properties
    const title = plain(p['歌名'])
    const key = plain(p['歌曲ID']) || page.id.replaceAll('-', '')
    if (!title || !/^[a-z0-9-]{1,80}$/.test(key))
      throw new Error('缺少歌名或歌曲ID格式不正确')
    if (tracks.some(t => t.id === key)) throw new Error('歌曲ID重复')
    const previous = existing.tracks.find(t => t.id === key)
    const audioUrl = fileUrl(p['音频'])
    if (!audioUrl)
      throw new Error(`${title} 缺少音频；本次同步已停止，保留网站原内容。`)
    const bytes = await asset(audioUrl, 32 * 1024 * 1024)
    if (
      bytes.subarray(0, 3).toString() !== 'ID3' &&
      !(bytes[0] === 255 && (bytes[1] & 224) === 224)
    )
      throw new Error(`${title} 需要 MP3 文件`)
    const audioPath = `notion/${key}.mp3`
    files.push([audioPath, bytes])
    let lrcText = plain(p['歌词文本'])
    const lyricUrl = fileUrl(p['LRC歌词'])
    if (lyricUrl)
      lrcText = (await asset(lyricUrl, 512 * 1024))
        .toString('utf8')
        .replace(/^\uFEFF/, '')
    if (lrcText && !parseLrc(lrcText).length)
      throw new Error(`${title} 的歌词需要逐句 LRC 时间戳`)
    const lyricPath = `notion/${key}.lrc`
    if (lrcText) files.push([lyricPath, Buffer.from(lrcText)])
    const coverUrl = fileUrl(p['封面'])
    let cover = previous?.cover || '/music/wan-dian.jpg'
    if (coverUrl) {
      const image = await asset(coverUrl, 8 * 1024 * 1024)
      const png = image
        .subarray(0, 8)
        .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      const jpg = image[0] === 255 && image[1] === 216
      if (!png && !jpg) throw new Error('封面请上传 PNG 或 JPG')
      const coverPath = `notion/${key}.${png ? 'png' : 'jpg'}`
      files.push([coverPath, image])
      cover = `/music/${coverPath}`
    }
    const links = platformLinks(p)
    const declaredDuration = p['时长（秒）']?.number
    if (!Number.isFinite(declaredDuration) || declaredDuration <= 0)
      throw new Error(`${title} 需要有效的时长（秒）`)
    const lines = parseLrc(lrcText)
    if (lines.some(l => l.time > declaredDuration + 1))
      throw new Error(`${title} 的歌词超出歌曲时长`)
    tracks.push({
      id: key,
      title,
      artist: plain(p['音乐人']) || '晴岑来',
      duration: declaredDuration,
      audio: `/music/${audioPath}`,
      cover,
      lrc: lrcText ? `/music/${lyricPath}` : '',
      lrcText,
      tag: p['标签']?.select?.name || '小岛作品',
      description: plain(p['创作手记']),
      shortNote: plain(p['一句话']),
      tone: p['色调']?.select?.name || previous?.tone || 'dusk',
      platforms: links,
      order: p['排序']?.number || 0
    })
  }
  tracks.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
  const catalog = { ...existing, tracks }
  // Validate every published row and download every asset before touching the catalog.
  for (const [name, content] of files) {
    const output = path.join(target, name)
    await fs.mkdir(path.dirname(output), { recursive: true })
    await fs.writeFile(output, content)
  }
  const output = path.join(target, 'catalog.json')
  await fs.writeFile(`${output}.tmp`, JSON.stringify(catalog, null, 2) + '\n')
  await fs.rename(`${output}.tmp`, output)
  console.log(`已同步 ${tracks.length} 首公开歌曲。`)
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  syncMusic().catch(error => {
    console.error(error.message)
    process.exitCode = 1
  })

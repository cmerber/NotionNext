import assert from 'node:assert/strict'
import { test } from 'node:test'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { parseLrc, activeLyricIndex } from '../../lib/music/lyrics.js'

test('LRC preserves repeated timestamps, offset and exact line boundaries', () => {
  const lines = parseLrc(
    '[ar:晴岑来]\n[offset:-100]\n[00:01.20][01:02.345]同一句\n[00:03]下一句\n无时间戳'
  )
  assert.equal(lines.length, 3)
  assert.ok(Math.abs(lines[0].time - 1.3) < 1e-9)
  assert.equal(lines[2].time, 62.445)
  assert.equal(activeLyricIndex(lines, 0), -1)
  assert.equal(activeLyricIndex(lines, 1.3), 0)
  assert.equal(activeLyricIndex(lines, 3.1), 1)
  assert.equal(activeLyricIndex([], 20), -1)
})

test('both real songs have strictly increasing, in-range lyrics and local media', async () => {
  const catalog = JSON.parse(
    await fs.readFile(
      new URL('../../public/music/catalog.json', import.meta.url),
      'utf8'
    )
  )
  assert.equal(catalog.tracks.length, 2)
  for (const song of catalog.tracks) {
    assert.equal(song.artist, '晴岑来')
    const lines = parseLrc(song.lrcText)
    assert.ok(lines.length >= 47)
    for (let i = 1; i < lines.length; i++)
      assert.ok(lines[i].time > lines[i - 1].time)
    assert.ok(lines.at(-1).time < song.duration)
    for (const asset of [song.audio, song.cover, song.lrc])
      assert.ok(
        (await fs.stat(new URL('../../public' + asset, import.meta.url))).size >
          0
      )
  }
})

test('Notion sync copies attachments, excludes private rows and preserves catalog on a failed download', async () => {
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'qcode-music-test-'))
  const originalFetch = globalThis.fetch
  const oldToken = process.env.NOTION_MUSIC_TOKEN,
    oldId = process.env.NOTION_MUSIC_DATABASE_ID
  try {
    await fs.mkdir(path.join(temp, 'scripts'), { recursive: true })
    await fs.mkdir(path.join(temp, 'lib/music'), { recursive: true })
    await fs.mkdir(path.join(temp, 'public/music'), { recursive: true })
    await fs.writeFile(path.join(temp, 'package.json'), ' {"type":"module"}')
    for (const file of ['scripts/music-sync.mjs', 'lib/music/lyrics.js'])
      await fs.copyFile(
        new URL('../../' + file, import.meta.url),
        path.join(temp, file)
      )
    const initial = JSON.stringify({ platforms: [], tracks: [] })
    await fs.writeFile(path.join(temp, 'public/music/catalog.json'), initial)
    const rich = value => ({ rich_text: [{ plain_text: value }] })
    const row = {
      id: 'page-one',
      properties: {
        发布: { checkbox: true },
        歌名: { title: [{ plain_text: '测试歌曲' }] },
        歌曲ID: rich('test-song'),
        音乐人: rich('晴岑来'),
        '时长（秒）': { number: 60 },
        音频: {
          files: [{ file: { url: 'https://file.notion.so/audio.mp3' } }]
        },
        LRC歌词: {
          files: [{ file: { url: 'https://file.notion.so/lyrics.lrc' } }]
        },
        QQ音乐: { url: 'https://y.qq.com/n/ryqq_v2/singer/verified' }
      }
    }
    const privateRow = {
      id: 'private',
      properties: {
        发布: { checkbox: false },
        歌名: { title: [{ plain_text: 'PRIVATE NEVER PUBLISH' }] }
      }
    }
    let fail = false
    globalThis.fetch = async (url, options = {}) => {
      if (url.endsWith('/databases/library'))
        return Response.json({ data_sources: [{ id: 'source' }] })
      if (url.endsWith('/data_sources/source/query'))
        return Response.json({ results: [row, privateRow], has_more: false })
      assert.equal(
        options.headers?.Authorization,
        undefined,
        'attachment requests must not receive the token'
      )
      if (url.endsWith('audio.mp3'))
        return fail
          ? new Response('', { status: 503 })
          : new Response(Buffer.from('ID3TESTAUDIO'))
      if (url.endsWith('lyrics.lrc'))
        return new Response('[00:01.50]测试歌词\n[00:04.00]下一句')
      throw Error('Unexpected network request')
    }
    process.env.NOTION_MUSIC_TOKEN = 'test-only-token'
    process.env.NOTION_MUSIC_DATABASE_ID = 'library'
    const { syncMusic } = await import(
      pathToFileURL(path.join(temp, 'scripts/music-sync.mjs')).href
    )
    await syncMusic()
    const synced = await fs.readFile(
      path.join(temp, 'public/music/catalog.json'),
      'utf8'
    )
    const catalog = JSON.parse(synced)
    assert.equal(catalog.tracks.length, 1)
    assert.equal(catalog.tracks[0].audio, '/music/notion/test-song.mp3')
    assert.equal(catalog.tracks[0].platforms[0].name, 'QQ音乐')
    assert.ok(!synced.includes('PRIVATE'))
    assert.ok(!synced.includes('test-only-token'))
    assert.equal(
      await fs.readFile(
        path.join(temp, 'public/music/notion/test-song.mp3'),
        'utf8'
      ),
      'ID3TESTAUDIO'
    )
    fail = true
    await assert.rejects(syncMusic(), /HTTP 503/)
    assert.equal(
      await fs.readFile(path.join(temp, 'public/music/catalog.json'), 'utf8'),
      synced
    )
    fail = false
    row.properties['QQ音乐'].url = 'https://untrusted.example/song'
    await assert.rejects(syncMusic(), /域名不匹配/)
    assert.equal(
      await fs.readFile(path.join(temp, 'public/music/catalog.json'), 'utf8'),
      synced
    )
  } finally {
    globalThis.fetch = originalFetch
    if (oldToken === undefined) delete process.env.NOTION_MUSIC_TOKEN
    else process.env.NOTION_MUSIC_TOKEN = oldToken
    if (oldId === undefined) delete process.env.NOTION_MUSIC_DATABASE_ID
    else process.env.NOTION_MUSIC_DATABASE_ID = oldId
    // Only the freshly created test directory is removed.
    await fs.rm(temp, { recursive: true, force: true })
  }
})

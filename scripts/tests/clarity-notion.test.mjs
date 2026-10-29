import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeClarity, numeric, snapshotKey, snapshotProperties, upsertSnapshot, NotionAPI, main } from '../clarity-notion.mjs'
import ownerLinks from '../../lib/ownerLinks.js'

const overview = [{ metricName: 'Traffic', information: [{ totalSessionCount: '12', distantUserCount: '9', totalBotSessionCount: '2', PagesPerSessionPercentage: 1.5 }] }]

test('reads totals without inventing missing metrics', () => {
  assert.deepEqual(normalizeClarity(overview), { sessions: 12, users: 9, bots: 2, pagesPerSession: 1.5, activeSeconds: null, scrollDepth: null, pages: [] })
})
test('preserves real zero and rejects invalid numbers', () => {
  for (const value of [undefined, null, '', 'unknown', -1, Infinity]) assert.equal(numeric(value), null)
  assert.equal(numeric('0'), 0)
})
test('does not sum segmented visitor totals', () => {
  assert.throws(() => normalizeClarity([{ metricName: 'Traffic', information: [{ totalSessionCount: '2' }, { totalSessionCount: '3' }] }]), /唯一汇总行/)
})
test('rejects failed and malformed exports before writing', () => {
  for (const value of [{ error: 'unauthorized' }, [], [{ metricName: 'Traffic', information: [{}] }]]) assert.throws(() => normalizeClarity(value))
})
test('only ranks own pages and avoids adding overlapping session counts', () => {
  const pages = [{ metricName: 'Traffic', information: [
    { URL: 'https://qcode.im/article/a?theme=orange', totalSessionCount: '4' },
    { URL: 'https://qcode.im/article/a', totalSessionCount: '3' },
    { URL: 'https://tangly1024.com/article/b', totalSessionCount: '100' },
    { URL: 'javascript:alert(1)', totalSessionCount: '10' }
  ] }]
  assert.deepEqual(normalizeClarity(overview, pages).pages, [{ url: 'https://qcode.im/article/a', sessions: 4 }])
})
test('uses UTC collection date with a rolling-window label', () => {
  const time = '2026-10-29T01:00:00+08:00'
  assert.equal(snapshotKey('ownproject', time), 'ownproject:2026-10-28:rolling24h')
  const props = snapshotProperties('ownproject', time, normalizeClarity(overview))
  assert.equal(props.统计窗口.date.start, '2026-10-27T17:00:00.000Z')
  assert.equal(props.活跃秒数.number, null)
  assert.match(props.名称.title[0].text.content, /最近24小时/)
})
test('updates an existing daily record instead of duplicating it', async () => {
  const calls = []
  const api = { query: async () => ({ results: [{ id: 'old' }] }), request: async (...args) => calls.push(args) }
  await upsertSnapshot(api, 'database', snapshotProperties('ownproject', '2026-10-29', normalizeClarity(overview)))
  assert.equal(calls[0][0], 'PATCH')
  assert.equal(calls[0][1], 'pages/old')
})
test('creates only when no matching record exists', async () => {
  const calls = []
  const api = { query: async () => ({ results: [] }), request: async (...args) => calls.push(args) }
  await upsertSnapshot(api, 'database', snapshotProperties('ownproject', '2026-10-29', normalizeClarity(overview)))
  assert.equal(calls[0][0], 'POST')
  assert.equal(calls[0][2].parent.database_id, 'database')
})
test('stops on duplicate records without overwriting', async () => {
  const api = { query: async () => ({ results: [{}, {}] }), request: async () => assert.fail('must not write') }
  await assert.rejects(upsertSnapshot(api, 'database', snapshotProperties('ownproject', '2026-10-29', normalizeClarity(overview))), /重复统计/)
})
test('does not leak credentials or server bodies on errors', async () => {
  const api = new NotionAPI('secret-test', async () => ({ ok: false, status: 403, json: async () => ({ secret: 'private' }) }))
  await assert.rejects(api.request('GET', 'databases/db'), error => error.message.includes('403') && !/secret-test|private/.test(error.message))
})
test('keeps identity links on the owner accounts', () => {
  assert.equal(ownerLinks.resolveOwnerConfig('CONTACT_GITHUB', 'https://github.com/tangly1024'), 'https://github.com/cmerber')
  assert.equal(ownerLinks.resolveOwnerConfig('CONTACT_CSDN', ''), 'https://blog.csdn.net/weixin_43614987')
  assert.equal(ownerLinks.resolveOwnerConfig('LINK', 'https://blog.tangly1024.com'), 'https://qcode.im')
  assert.equal(ownerLinks.resolveOwnerConfig('CONTACT_TELEGRAM', 'https://t.me/tangly_1024'), '')
  assert.equal(ownerLinks.ownerMenuHref('https://tangly1024.com'), '#')
  assert.equal(ownerLinks.ownerMenuHref('/about'), '/about')
})
test('does not match a domain containing the author name as a prefix', () => {
  assert.equal(ownerLinks.isLegacyOwnerLink('https://tangly1024.com.example.org'), false)
})

test('conflicting or unknown modes never write to Notion', async () => {
  await assert.rejects(main(['--init', '--dry-run']), /只指定一种模式/)
  await assert.rejects(main(['--unknown']), /只指定一种模式/)
})

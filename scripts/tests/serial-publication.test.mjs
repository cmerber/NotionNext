import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { test } from 'node:test'

const require = createRequire(import.meta.url)
const { appendSerialPublicationVersion } = require(
  '../../lib/db/notion/serialPublicationVersion.js'
)

test('a new serial release invalidates blocks even when Notion edit time is unchanged', () => {
  const previous = { abcd: { revision: 202610300001 } }
  const next = { abcd: { revision: 202610310002 } }
  const before = appendSerialPublicationVersion('AB-CD', '1793000000000', previous)
  const after = appendSerialPublicationVersion('ab-cd', '1793000000000', next)
  assert.notEqual(before, after)
  assert.equal(
    after,
    appendSerialPublicationVersion('abcd', '1793000000000', next)
  )
  assert.match(after, /^1793000000000_\d{10,}$/)
})

test('other pages and malformed release metadata keep their existing cache version', () => {
  const releases = { abcd: { revision: 'invalid' } }
  assert.equal(appendSerialPublicationVersion('other', 'old', releases), 'old')
  assert.equal(appendSerialPublicationVersion('abcd', '', releases), '')
  assert.equal(appendSerialPublicationVersion(undefined, 'old', releases), 'old')
})

test('the registered Kouxuan release also versions direct page reads without edit metadata', () => {
  assert.match(
    appendSerialPublicationVersion('409c2c42-b276-80be-8c4a-df97e2768d39', ''),
    /^\d{12}(?:\d{2})?$/
  )
})

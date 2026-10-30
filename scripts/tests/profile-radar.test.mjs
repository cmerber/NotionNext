import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

const source = fs.readFileSync(
  new URL('../../lib/profile/radar.js', import.meta.url),
  'utf8'
)
const { radarScale, radarRatio } = await import(
  `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`
)

test('early progress uses a readable 100 XP scale instead of a 500 XP range', () => {
  assert.equal(radarScale([57, 40, 57, 80, 57, 0]), 100)
  assert.equal(radarRatio(80, 100), 0.8)
})

test('larger XP totals fit a shared labelled scale without clipping', () => {
  for (const [value, expected] of [
    [112, 150],
    [207, 300],
    [700, 1000],
    [1001, 1500],
    [6400, 10000]
  ]) {
    assert.equal(radarScale([value, 40, 0]), expected)
    assert.ok(radarRatio(value, expected) <= 1)
  }
})

test('zero XP stays at the origin and small values are not inflated', () => {
  assert.equal(radarRatio(0, 100), 0)
  assert.equal(radarRatio(1, 100), 0.01)
  assert.equal(radarRatio(-20, 100), 0)
})

test('empty and invalid data still yield a finite readable scale', () => {
  assert.equal(radarScale([]), 100)
  assert.equal(radarScale([0, NaN, Infinity, undefined]), 100)
  assert.equal(radarRatio(undefined, 100), 0)
})

test('changing the display scale does not mutate earned XP', () => {
  const xp = [112, 40, 107, 80, 112, 0]
  const before = [...xp]
  xp.forEach(value => radarRatio(value, radarScale(xp)))
  assert.deepEqual(xp, before)
})

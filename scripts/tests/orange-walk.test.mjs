import test from 'node:test'
import assert from 'node:assert/strict'
import {
  createHostWalk,
  WALK_STATIONS
} from '../../themes/orange/scene/hostWalk.js'

function clearAisle({ x, z }) {
  assert.ok(Math.abs(x) < 3.8 && Math.abs(z) < 2.9)
  // Desk, relocated chair, sofa and coffee table, including body clearance.
  for (const [left, right, back, front] of [
    [-0.46, 2.92, -2.46, -0.635],
    [1.21, 2.49, -0.52, 0.65],
    [-3.6, -2.0, -0.84, 2.08]
  ])
    assert.ok(
      !(x > left && x < right && z > back && z < front),
      `blocked at ${x},${z}`
    )
  assert.ok(Math.hypot(x + 1.5, z - 1.1) > 0.89)
}
test('all destinations and interrupted routes stay in the room and avoid furniture', () => {
  const walk = createHostWalk()
  for (const place of [
    'journal',
    'tools',
    'profile',
    'about',
    'journal',
    'profile'
  ]) {
    walk.select(place)
    for (let i = 0; i < 600; i++) clearAisle(walk.update(1 / 30))
    assert.ok(
      Math.hypot(
        walk.state.x - WALK_STATIONS[place][0],
        walk.state.z - WALK_STATIONS[place][1]
      ) < 0.001
    )
  }
  walk.select('journal')
  for (let i = 0; i < 20; i++) walk.update(1 / 30)
  const previous = [walk.state.x, walk.state.z]
  walk.select('tools')
  assert.deepEqual([walk.state.x, walk.state.z], previous)
  for (let i = 0; i < 600; i++) clearAisle(walk.update(1 / 30))
  assert.ok(Math.abs(walk.state.x - WALK_STATIONS.tools[0]) < 0.001)
})
test('idle exploration actually travels, and reduced motion and manual selections remain still', () => {
  const walk = createHostWalk()
  for (let i = 0; i < 300; i++) walk.update(1 / 30)
  assert.equal(walk.state.destination, 'journal')
  assert.notEqual(walk.state.x, WALK_STATIONS.about[0])
  const previous = [walk.state.x, walk.state.z]
  for (let i = 0; i < 100; i++) walk.update(0.1, true)
  assert.deepEqual([walk.state.x, walk.state.z], previous)
  walk.select('tools')
  for (let i = 0; i < 1200; i++) walk.update(1 / 30)
  assert.equal(walk.state.destination, 'tools')
  walk.release()
  for (let i = 0; i < 180; i++) walk.update(1 / 30)
  assert.notEqual(walk.state.destination, 'tools')
})

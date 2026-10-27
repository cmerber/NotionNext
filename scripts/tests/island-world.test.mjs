import test from 'node:test'
import assert from 'node:assert/strict'
import * as THREE from 'three'
import { createModelKit } from '../../themes/island/scene/modelKit.js'
import { createTerrain } from '../../themes/island/scene/terrain.js'
import { createBuildings } from '../../themes/island/scene/buildings.js'
import { createAnimals } from '../../themes/island/scene/animals.js'
import { createCharacter } from '../../themes/island/scene/createCharacter.js'
import { createWalker } from '../../themes/island/scene/walker.js'
import { batchScene } from '../../themes/island/scene/batchScene.js'
import { PLACES } from '../../themes/island/places.js'

test('the complete village keeps finite geometry, colored terrain, instanced flowers and actionable doors after batching', () => {
  const scene = new THREE.Scene(),
    kit = createModelKit(scene)
  const terrain = createTerrain(kit),
    buildings = createBuildings(kit),
    animals = createAnimals(kit),
    character = createCharacter(kit)
  const before = new THREE.Box3().setFromObject(scene)
  const stats = batchScene(
    scene,
    [
      character.root,
      ...terrain.moving,
      ...animals.moving,
      ...buildings.doors.map(d => d.pivot)
    ],
    g => kit.geometries.add(g)
  )
  assert.ok(stats.before > 600)
  assert.ok(stats.after < 80)
  assert.equal(buildings.roots.length, 4)
  assert.deepEqual(
    buildings.doors.map(d => d.id).sort(),
    PLACES.map(p => p.id).sort()
  )
  let colored = 0,
    instances = 0
  scene.traverse(item => {
    if (item.isInstancedMesh) instances++
    if (!item.geometry) return
    assert.ok(
      [...item.geometry.attributes.position.array].every(Number.isFinite)
    )
    if (item.material.vertexColors) {
      assert.ok(item.geometry.attributes.color)
      colored++
    }
  })
  assert.ok(colored >= 2)
  assert.equal(instances, 3)
  const after = new THREE.Box3().setFromObject(scene)
  assert.ok(
    before.min.distanceTo(after.min) < 1e-4 &&
      before.max.distanceTo(after.max) < 1e-4
  )
  assert.ok(after.min.y < -4.9)
  let disposed = 0
  kit.textures.forEach(t => t.addEventListener('dispose', () => disposed++))
  kit.dispose()
  assert.equal(disposed, kit.textures.size)
})

function clearPath({ x, z }) {
  for (const [left, right, back, front] of [
    [-4.85, -1.95, -3.2, -0.75],
    [0.9, 4.3, -3.6, -0.95],
    [-4.85, -1.95, 1.9, 4.15],
    [3.5, 5.9, 1, 3.5]
  ])
    assert.ok(
      !(x > left && x < right && z > back && z < front),
      `blocked ${x},${z}`
    )
  assert.ok(Math.abs(x) < 7.3 && Math.abs(z) < 5.8)
}
test('walking reaches every door and interrupted journeys remain on clear paths without teleporting', () => {
  const walker = createWalker()
  for (const place of [...PLACES, ...PLACES.slice().reverse()]) {
    walker.select(place.id)
    for (let i = 0; i < 1000; i++) clearPath(walker.update(1 / 30))
    assert.ok(
      Math.hypot(
        walker.state.x - place.door[0],
        walker.state.z - place.door[1]
      ) < 0.001
    )
  }
  walker.select('library')
  for (let i = 0; i < 70; i++) walker.update(1 / 30)
  const previous = [walker.state.x, walker.state.z]
  walker.select('workshop')
  assert.deepEqual([walker.state.x, walker.state.z], previous)
  for (let i = 0; i < 1000; i++) clearPath(walker.update(1 / 30))
  assert.equal(walker.state.walking, false)
  walker.release()
  for (let i = 0; i < 190; i++) walker.update(1 / 30)
  assert.equal(walker.state.walking, true)
  const still = [walker.state.x, walker.state.z]
  walker.update(3, true)
  assert.deepEqual([walker.state.x, walker.state.z], still)
})
test('cats, sheep and birds animate, greet, and stop travelling for reduced motion', () => {
  const kit = createModelKit(new THREE.Scene()),
    animals = createAnimals(kit)
  const initial = animals.animals.map(a => a.root.position.clone())
  animals.update(30)
  animals.animals.forEach((a, i) =>
    assert.ok(a.root.position.distanceTo(initial[i]) > 0.1)
  )
  const positions = animals.animals.map(a => a.root.position.clone())
  animals.update(100, true)
  animals.animals.forEach((a, i) =>
    assert.ok(Math.abs(a.root.position.x - positions[i].x) < 0.001)
  )
  animals.greet()
  animals.update(30.25)
  assert.notEqual(animals.animals[0].body.position.y, 0)
  for (let t = 0; t < 200; t++) {
    animals.update(t)
    for (const animal of animals.animals) {
      assert.ok(Number.isFinite(animal.root.position.y))
      if (!animal.cat) assert.ok(animal.root.position.x < 0.6)
    }
  }
  kit.dispose()
})

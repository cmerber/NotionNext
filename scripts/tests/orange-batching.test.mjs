import assert from 'node:assert/strict'
import test from 'node:test'
import * as THREE from 'three'
import { batchScene } from '../../themes/orange/scene/batchScene.js'

test('furniture batching preserves world bounds, picking destinations and animated subtrees', () => {
  const root = new THREE.Scene()
  const wood = new THREE.MeshStandardMaterial()
  const shelf = new THREE.Group()
  shelf.position.set(2, 1, 0)
  shelf.userData.place = 'journal'
  root.add(shelf)
  const originals = []
  for (let i = 0; i < 8; i++) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), wood)
    mesh.position.set(i, 0, 0)
    shelf.add(mesh)
    originals.push(mesh.geometry)
  }
  const animated = new THREE.Group()
  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1, 0.2), wood)
  animated.add(arm)
  root.add(animated)
  const before = new THREE.Box3().setFromObject(root)
  const owned = []
  const result = batchScene(root, [animated], geometry => owned.push(geometry))
  assert.deepEqual(result, { before: 8, after: 1 })
  assert.equal(arm.parent, animated)
  const after = new THREE.Box3().setFromObject(root)
  assert.ok(
    before.min.distanceTo(after.min) < 1e-5 &&
      before.max.distanceTo(after.max) < 1e-5
  )
  const ray = new THREE.Raycaster(
    new THREE.Vector3(2, 1, 4),
    new THREE.Vector3(0, 0, -1)
  )
  root.updateMatrixWorld(true)
  assert.equal(
    ray.intersectObjects(root.children, true)[0].object.userData.place,
    'journal'
  )
  owned.forEach(g => g.dispose())
  originals.forEach(g => g.dispose())
  arm.geometry.dispose()
  wood.dispose()
})

test('batches in an animated local space follow their parent without baking its world position twice', () => {
  const root = new THREE.Group()
  root.position.set(5, 3, 1)
  root.rotation.y = 0.7
  const material = new THREE.MeshBasicMaterial()
  const originals = []
  for (let i = 0; i < 4; i++) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), material)
    mesh.position.x = i
    root.add(mesh)
    originals.push(mesh.geometry)
  }
  const before = new THREE.Box3().setFromObject(root)
  const owned = []
  batchScene(root, [], g => owned.push(g))
  const after = new THREE.Box3().setFromObject(root)
  assert.ok(
    before.min.distanceTo(after.min) < 1e-5 &&
      before.max.distanceTo(after.max) < 1e-5
  )
  root.position.x += 3
  const moved = new THREE.Box3().setFromObject(root)
  assert.ok(Math.abs(moved.min.x - after.min.x - 3) < 1e-5)
  owned.forEach(g => g.dispose())
  originals.forEach(g => g.dispose())
  material.dispose()
})

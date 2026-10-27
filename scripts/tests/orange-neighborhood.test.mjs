import test from 'node:test'
import assert from 'node:assert/strict'
import * as THREE from 'three'
import { createNeighborhood } from '../../themes/orange/scene/createNeighborhood.js'
import { batchScene } from '../../themes/orange/scene/batchScene.js'

test('cars and passersby retain their motion after batching, pause freezes traffic, and all geometry is finite', () => {
  const scene = new THREE.Scene(),
    geometries = new Set(),
    materials = new Set()
  const mesh = (geometry, material, position, parent = scene) => {
    geometries.add(geometry)
    const item = new THREE.Mesh(geometry, material)
    item.position.set(...position)
    parent.add(item)
    return item
  }
  const mat = (color, extra) => {
    const m = new THREE.MeshStandardMaterial({ color, ...extra })
    materials.add(m)
    return m
  }
  const group = (id, x = 0, y = 0, z = 0) => {
    const g = new THREE.Group()
    g.position.set(x, y, z)
    scene.add(g)
    return g
  }
  const box = (w, h, d, m, x, y, z, parent) =>
    mesh(new THREE.BoxGeometry(w, h, d), m, [x, y, z], parent)
  const cylinder = (t, b, h, m, x, y, z, parent) =>
    mesh(new THREE.CylinderGeometry(t, b, h, 12), m, [x, y, z], parent)
  const palette = Object.fromEntries(
    ['cream', 'darkWood', 'peach', 'green', 'orange'].map(key => [
      key,
      mat('#abcdef')
    ])
  )
  const world = createNeighborhood({ mesh, mat, group, box, cylinder, palette })
  try {
    const register = geometry => geometries.add(geometry)
    batchScene(scene, world.movingRoots, register)
    for (const actor of world.movingRoots) {
      const legs =
        world.pedestrians.find(person => person.root === actor)?.legs || []
      batchScene(actor, legs, register)
      for (const leg of legs) batchScene(leg, [], register)
    }
    const before = world.cars[0].position.clone()
    world.update(8)
    assert.ok(before.distanceTo(world.cars[0].position) > 1)
    assert.equal(world.pedestrians.length, 4)
    assert.ok(Math.abs(world.pedestrians[0].legs[0].rotation.x) > 0.1)
    const paused = world.cars[0].position.clone()
    world.update(50, true)
    assert.equal(paused.distanceTo(world.cars[0].position), 0)
    assert.ok(Math.abs(world.pedestrians[0].legs[0].rotation.x) < 1e-10)
    scene.traverse(item => {
      if (item.isMesh)
        assert.ok(
          Array.from(item.geometry.attributes.position.array).every(
            Number.isFinite
          )
        )
    })
  } finally {
    geometries.forEach(g => g.dispose())
    materials.forEach(m => m.dispose())
  }
})

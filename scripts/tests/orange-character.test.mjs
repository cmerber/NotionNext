import assert from 'node:assert/strict'
import test from 'node:test'
import * as THREE from 'three'
import { createCharacter } from '../../themes/orange/scene/createCharacter.js'

function makeCharacter() {
  const geometries = []
  const materials = []
  const character = createCharacter({
    group: (id, x, y, z) => {
      const root = new THREE.Group()
      root.position.set(x, y, z)
      root.userData.place = id
      return root
    },
    mat: (color, extra) => {
      const material = new THREE.MeshStandardMaterial({ color, ...extra })
      materials.push(material)
      return material
    },
    mesh: (geometry, material, position, parent) => {
      geometries.push(geometry)
      const object = new THREE.Mesh(geometry, material)
      object.position.set(...position)
      parent.add(object)
      return object
    }
  })
  return {
    ...character,
    geometries,
    dispose: () => {
      geometries.forEach(g => g.dispose())
      materials.forEach(m => m.dispose())
    }
  }
}

test('the portrait has finite three-dimensional geometry', () => {
  const character = makeCharacter()
  try {
    const bounds = new THREE.Box3()
      .setFromObject(character.root)
      .getSize(new THREE.Vector3())
    assert.ok(bounds.z > 0.5)
    for (const geometry of character.geometries)
      assert.ok(
        Array.from(geometry.attributes.position.array).every(Number.isFinite)
      )
  } finally {
    character.dispose()
  }
})

test('greeting waves and reduced motion restores a still, open-eyed pose', () => {
  const character = makeCharacter()
  try {
    character.update(1, false)
    character.wave()
    character.update(1.5, false)
    assert.ok(character.root.getObjectByName('arm-right').rotation.z > 1)
    character.update(5.6, false)
    assert.ok(character.root.getObjectByName('eye-left').scale.y < 1)
    character.update(5.6, true)
    assert.equal(character.root.getObjectByName('eye-left').scale.y, 1)
    assert.equal(character.root.getObjectByName('head').rotation.z, 0)
    assert.equal(character.root.getObjectByName('arm-right').rotation.z, 0.07)
  } finally {
    character.dispose()
  }
})

test('gaze is bounded and a greeting returns to rest without accumulating motion', () => {
  const character = makeCharacter()
  try {
    character.lookAt(100, -100, 100)
    character.update(1, false)
    character.wave()
    character.update(1.5, false)
    assert.ok(character.root.position.y > 0.16)
    for (let i = 0; i < 500; i++) character.update(2 + i / 30, false)
    assert.ok(character.root.rotation.y <= 1.1)
    assert.ok(
      Math.abs(character.root.getObjectByName('gaze-left').position.x) <= 0.023
    )
    character.update(20, true)
    assert.equal(character.root.position.y, 0.12)
    assert.equal(character.root.getObjectByName('gaze-left').position.x, 0)
    assert.equal(character.root.getObjectByName('arm-right').rotation.z, 0.07)
  } finally {
    character.dispose()
  }
})

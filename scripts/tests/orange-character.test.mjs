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

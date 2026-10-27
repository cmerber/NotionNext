import test from 'node:test'
import assert from 'node:assert/strict'
import * as THREE from 'three'
import { createWeather } from '../../themes/orange/scene/createWeather.js'
import { environmentPalette } from '../../themes/orange/scene/environments.js'
import { batchScene } from '../../themes/orange/scene/batchScene.js'

function fixture() {
  const scene = new THREE.Scene(),
    geometries = new Set(),
    materials = new Set()
  const weather = createWeather({ scene, geometries, materials })
  for (const root of weather.scenery)
    batchScene(root, [], g => geometries.add(g))
  batchScene(scene, weather.roots, g => geometries.add(g))
  return {
    weather,
    scene,
    geometries,
    materials,
    dispose() {
      geometries.forEach(g => g.dispose())
      materials.forEach(m => m.dispose())
    }
  }
}

test('weather switches reuse bounded buffers and preserve independent scenery after batching', () => {
  const f = fixture(),
    { weather, scene } = f
  try {
    const geometryCount = f.geometries.size,
      materialCount = f.materials.size
    for (let i = 0; i < 25; i++) {
      for (const environment of ['rain', 'snow', 'desert', 'sunny']) {
        weather.configure({ environment })
        weather.update(i * 4.7)
        assert.equal(
          scene.getObjectByName('orange-desert').visible,
          environment === 'desert'
        )
        assert.equal(
          scene.getObjectByName('orange-snow-cover').visible,
          environment === 'snow'
        )
        assert.equal(weather.rain.parent.visible, environment === 'rain')
        assert.equal(
          weather.snow.parent.visible,
          environment === 'snow' || environment === 'desert'
        )
      }
    }
    assert.equal(f.geometries.size, geometryCount)
    assert.equal(f.materials.size, materialCount)
    scene.traverse(item => {
      if (item.geometry?.attributes?.position)
        assert.ok(
          Array.from(item.geometry.attributes.position.array).every(
            Number.isFinite
          )
        )
    })
  } finally {
    f.dispose()
  }
})

test('precipitation stays outdoors, freezes when quiet and scales down on mobile/safe mode', () => {
  const f = fixture(),
    { weather } = f
  try {
    weather.configure({ environment: 'rain' })
    weather.update(3)
    assert.equal(weather.rain.geometry.drawRange.count, 840)
    const buffer = weather.rain.geometry.attributes.position.array
    const before = Array.from(buffer)
    for (let i = 0; i < 420; i++) {
      const at = i * 6,
        x = buffer[at] - buffer[at + 1] * 0.13,
        z = buffer[at + 2]
      assert.ok(Math.abs(x) > 4.3 || Math.abs(z) > 3.4)
    }
    weather.update(100, true)
    assert.deepEqual(Array.from(buffer), before)
    weather.update(4)
    assert.notDeepEqual(Array.from(buffer), before)
    weather.configure({ environment: 'rain', compact: true })
    assert.equal(weather.rain.geometry.drawRange.count, 320)
    weather.configure({ environment: 'snow', safe: true })
    assert.equal(weather.snow.geometry.drawRange.count, 90)
    weather.update(20)
    weather.configure({ environment: 'snow', ambience: false })
    assert.equal(weather.snow.parent.visible, false)
    assert.equal(f.scene.getObjectByName('orange-snow-cover').visible, true)
    weather.configure({ environment: 'rain', reducedMotion: true })
    assert.equal(weather.rain.parent.visible, false)
    assert.equal(f.scene.getObjectByName('orange-puddles').visible, true)
  } finally {
    f.dispose()
  }
})

test('each environment has day and night lighting and invalid saved modes are safe', () => {
  for (const mode of ['sunny', 'rain', 'snow', 'desert']) {
    const day = environmentPalette(mode),
      night = environmentPalette(mode, true)
    assert.notEqual(day.fog, night.fog)
    assert.ok(day.sun > night.sun)
    assert.ok(Number.isFinite(day.fogDensity))
  }
  assert.equal(environmentPalette('not-a-scene').mode, 'sunny')
})

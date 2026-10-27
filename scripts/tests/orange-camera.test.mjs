import assert from 'node:assert/strict'
import test from 'node:test'
import * as THREE from 'three'
import { updateShadowBudget } from '../../themes/orange/scene/renderBudget.js'
import {
  sampleCameraFlight,
  reactionEnvelope
} from '../../themes/orange/scene/cameraMotion.js'

test('curved camera flights land exactly, including interrupted flights and tall viewports', () => {
  const out = [0, 0, 0]
  const start = [12, 8, 17]
  const end = [2.7, 3.3, 8.9]
  sampleCameraFlight(start, end, 0, 1, 1, out)
  assert.deepEqual(out, start)
  sampleCameraFlight(start, end, 1, 1, 1, out)
  out.forEach((n, i) => assert.ok(Math.abs(n - end[i]) < 1e-10))
  sampleCameraFlight(start, end, 0.42, 1, 1, out)
  const interrupted = [...out]
  const phone = [0.8, 10.6, 23.1]
  for (let i = 0; i <= 100; i++) {
    const ease = sampleCameraFlight(interrupted, phone, i / 100, 1, 1, out)
    assert.ok(ease >= 0 && ease <= 1)
    assert.ok(out.every(Number.isFinite))
  }
  out.forEach((n, i) => assert.ok(Math.abs(n - phone[i]) < 1e-10))
})

test('repeated interaction effects have bounded energy and expire completely', () => {
  assert.equal(reactionEnvelope(-1), 0)
  assert.equal(reactionEnvelope(0), 0)
  assert.ok(reactionEnvelope(0.18) > 0.8)
  for (let age = 0; age < 5; age += 0.01)
    assert.ok(reactionEnvelope(age) >= 0 && reactionEnvelope(age) <= 1)
  assert.equal(reactionEnvelope(2.4), 0)
  assert.equal(reactionEnvelope(100), 0)
})

test('large and high-DPI displays stay within drawing-buffer pixel and dimension budgets', async () => {
  const { getRenderBudget } =
    await import('../../themes/orange/scene/renderBudget.js')
  for (const [width, height, dpr] of [
    [3840, 2067, 2],
    [7680, 4320, 2],
    [390, 844, 3],
    [1440, 960, 1]
  ]) {
    for (const quality of ['auto', 'safe', 'detail']) {
      const budget = getRenderBudget(width, height, dpr, quality)
      const pixels = width * height * budget.ratio ** 2
      assert.ok(Number.isFinite(budget.ratio) && budget.ratio > 0)
      assert.ok(
        pixels <=
          (quality === 'safe'
            ? 2200000
            : quality === 'detail'
              ? 8500000
              : 5200000) +
            1
      )
      assert.ok(
        Math.max(width, height) * budget.ratio <=
          (quality === 'safe' ? 2560 : quality === 'detail' ? 5120 : 4096) + 1
      )
      if (quality === 'safe') assert.equal(budget.shadows, false)
    }
  }
  assert.ok(getRenderBudget(3840, 2067, 1, 'auto').ratio > 0.8)
  assert.equal(getRenderBudget(3840, 2067, 1, 'detail').ratio, 1)
})

test('desktop-to-phone shadow changes rebuild programs without disposing a disabled render target', () => {
  let disposed = 0
  const target = {
    dispose() {
      disposed++
    }
  }
  const light = {
    shadow: { mapSize: new THREE.Vector2(2048, 2048), map: target }
  }
  const renderer = { shadowMap: { enabled: true } }
  const material = new THREE.MeshStandardMaterial()
  try {
    updateShadowBudget(renderer, light, [material], {
      shadows: false,
      shadowSize: 512
    })
    assert.equal(renderer.shadowMap.enabled, false)
    assert.equal(material.version, 1)
    assert.equal(light.shadow.map, target)
    assert.equal(disposed, 0)
    updateShadowBudget(renderer, light, [material], {
      shadows: true,
      shadowSize: 1024
    })
    assert.equal(material.version, 2)
    assert.equal(light.shadow.map, null)
    assert.equal(disposed, 1)
    assert.equal(light.shadow.mapSize.width, 1024)
    updateShadowBudget(renderer, light, [material], {
      shadows: true,
      shadowSize: 1024
    })
    assert.equal(material.version, 2)
    assert.equal(disposed, 1)
  } finally {
    material.dispose()
  }
})

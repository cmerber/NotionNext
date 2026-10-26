import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

// Combine fixed furniture by material and destination. Keep animated subtrees
// separate, and retain the destination on each batch for accurate ray picking.
export function batchScene(
  root,
  dynamicRoots = [],
  register = () => {},
  transparent = false
) {
  root.updateWorldMatrix(true, true)
  const excluded = new Set(dynamicRoots.filter(Boolean))
  const inverse = root.matrixWorld.clone().invert()
  const buckets = new Map()
  root.traverse(item => {
    if (
      !item.isMesh ||
      Array.isArray(item.material) ||
      (!transparent && item.material.transparent)
    )
      return
    let parent = item
    let place = '',
      action = ''
    while (parent) {
      if (excluded.has(parent) || !parent.visible) return
      place ||= parent.userData.place || ''
      action ||= parent.userData.action || ''
      if (parent === root) break
      parent = parent.parent
    }
    const key = `${item.material.uuid}:${place}:${action}:${item.castShadow}:${item.receiveShadow}`
    if (!buckets.has(key)) buckets.set(key, { items: [], place, action })
    buckets.get(key).items.push(item)
  })
  let before = 0,
    after = 0
  for (const { items, place, action } of buckets.values()) {
    before += items.length
    after += 1
    if (items.length < 2) continue
    const geometries = items.map(item => {
      const geometry = item.geometry.index
        ? item.geometry.toNonIndexed()
        : item.geometry.clone()
      geometry.applyMatrix4(
        new THREE.Matrix4().multiplyMatrices(inverse, item.matrixWorld)
      )
      for (const attr of Object.keys(geometry.attributes)) {
        if (!['position', 'normal', 'uv'].includes(attr))
          geometry.deleteAttribute(attr)
      }
      if (!geometry.attributes.uv)
        geometry.setAttribute(
          'uv',
          new THREE.Float32BufferAttribute(
            new Float32Array(geometry.attributes.position.count * 2),
            2
          )
        )
      return geometry
    })
    const merged = mergeGeometries(geometries, false)
    geometries.forEach(geometry => geometry.dispose())
    if (!merged) {
      after += items.length - 1
      continue
    }
    register(merged)
    const combined = new THREE.Mesh(merged, items[0].material)
    combined.castShadow = items[0].castShadow
    combined.receiveShadow = items[0].receiveShadow
    combined.userData = { place, action }
    combined.name = 'orange-furniture-batch'
    items.forEach(item => item.removeFromParent())
    root.add(combined)
  }
  return { before, after }
}

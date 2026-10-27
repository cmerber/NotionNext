import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

export function createModelKit(scene) {
  const geometries = new Set(),
    materials = new Set(),
    textures = new Set()
  const noise = new Uint8Array(64 * 64 * 4)
  for (let i = 0; i < 64 * 64; i++) {
    const n = 247 + (Math.imul(i ^ (i >>> 7), 2654435761) >>> 28) / 2
    noise.set([n, n, n, 255], i * 4)
  }
  const grain = new THREE.DataTexture(noise, 64, 64)
  grain.wrapS = grain.wrapT = THREE.RepeatWrapping
  grain.repeat.set(4, 4)
  grain.needsUpdate = true
  textures.add(grain)
  const mat = (color, extra = {}) => {
    const m = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.87,
      ...extra
    })
    materials.add(m)
    return m
  }
  const mesh = (geometry, material, position = [0, 0, 0], parent = scene) => {
    geometries.add(geometry)
    const item = new THREE.Mesh(geometry, material)
    item.position.set(...position)
    item.castShadow = item.receiveShadow = true
    parent.add(item)
    return item
  }
  const group = (id = '', x = 0, y = 0, z = 0, parent = scene) => {
    const root = new THREE.Group()
    root.position.set(x, y, z)
    if (id) root.userData.place = id
    parent.add(root)
    return root
  }
  const box = (w, h, d, m, x, y, z, parent = scene) =>
    mesh(
      new RoundedBoxGeometry(w, h, d, 2, Math.min(0.055, w / 8, h / 8, d / 8)),
      m,
      [x, y, z],
      parent
    )
  const ball = (r, m, x, y, z, parent = scene, scale = [1, 1, 1]) => {
    const item = mesh(new THREE.SphereGeometry(r, 16, 12), m, [x, y, z], parent)
    item.scale.set(...scale)
    return item
  }
  const cylinder = (
    top,
    bottom,
    height,
    m,
    x,
    y,
    z,
    parent = scene,
    sides = 20
  ) =>
    mesh(
      new THREE.CylinderGeometry(top, bottom, height, sides),
      m,
      [x, y, z],
      parent
    )
  const line = (points, radius, m, parent = scene) =>
    mesh(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p))),
        16,
        radius,
        6,
        false
      ),
      m,
      [0, 0, 0],
      parent
    )
  const palette = {
    plaster: mat('#e9dfc7', { map: grain }),
    cream: mat('#fff3d9'),
    wood: mat('#a47c52', { map: grain }),
    darkWood: mat('#66553c'),
    roof: mat('#51766b', { map: grain }),
    roofLight: mat('#6c8a76'),
    terracotta: mat('#b9815c'),
    green: mat('#82996c'),
    sage: mat('#abb99a'),
    brass: mat('#c7a66b', { metalness: 0.25, roughness: 0.55 }),
    glass: mat('#c6e5d5', {
      transparent: true,
      opacity: 0.29,
      roughness: 0.18,
      metalness: 0.05,
      depthWrite: false,
      side: THREE.DoubleSide
    }),
    window: mat('#ead6a2', { emissive: '#ffc778', emissiveIntensity: 0.2 }),
    leaf: mat('#627f56'),
    leafLight: mat('#91a377'),
    bark: mat('#786147'),
    stone: mat('#b8b29b'),
    path: mat('#d8cdb0'),
    soil: mat('#8e7654'),
    ink: mat('#334e46'),
    flower: mat('#e8b3a0'),
    white: mat('#f4edda')
  }
  return {
    geometries,
    materials,
    textures,
    mat,
    mesh,
    group,
    box,
    ball,
    cylinder,
    line,
    palette,
    dispose() {
      geometries.forEach(g => g.dispose())
      materials.forEach(m => m.dispose())
      textures.forEach(t => t.dispose())
    }
  }
}

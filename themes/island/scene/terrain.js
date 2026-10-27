import * as THREE from 'three'

export function createTerrain(kit) {
  const { mesh, mat, group, box, ball, cylinder, line, palette: p } = kit
  const root = group(),
    moving = []
  const grass = mat('#9aa77b', { vertexColors: true, roughness: 1 })
  const rock = mat('#8b785a', {
    vertexColors: true,
    flatShading: true,
    roughness: 1
  })
  function land(x, z, r, aspect = 0.8, y = 0) {
    const island = group('', x, y, z, root),
      segments = 72
    const radii = angle =>
      r * (1 + 0.055 * Math.sin(angle * 5 + 1) + 0.035 * Math.cos(angle * 9))
    const top = [],
      colors = []
    const color = new THREE.Color()
    for (let i = 0; i < segments; i++) {
      const a = (i / segments) * Math.PI * 2,
        b = ((i + 1) / segments) * Math.PI * 2
      top.push(
        0,
        0,
        0,
        Math.cos(b) * radii(b),
        0,
        Math.sin(b) * radii(b) * aspect,
        Math.cos(a) * radii(a),
        0,
        Math.sin(a) * radii(a) * aspect
      )
      for (let n = 0; n < 3; n++) {
        color.set(n ? (i % 4 ? '#b4bc8d' : '#a4b27c') : '#c1c69d')
        colors.push(color.r, color.g, color.b)
      }
    }
    const surface = new THREE.BufferGeometry()
    surface.setAttribute('position', new THREE.Float32BufferAttribute(top, 3))
    surface.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    surface.computeVertexNormals()
    mesh(surface, grass, [0, -0.02, 0], island)
    const positions = [],
      shades = [],
      levels = [
        [1, -0.08],
        [1.02, -0.45],
        [0.97, -2],
        [0.7, -3.4],
        [0.04, -5.1]
      ]
    const ring = (i, level) => {
      const a = (i / segments) * Math.PI * 2,
        [size, h] = levels[level]
      return [
        Math.cos(a) * radii(a) * size,
        (h * r) / 8 + Math.sin(a * 7 + level) * 0.12,
        Math.sin(a) * radii(a) * size * aspect
      ]
    }
    for (let level = 0; level < levels.length - 1; level++)
      for (let i = 0; i < segments; i++) {
        const points = [
          ring(i, level),
          ring(i + 1, level),
          ring(i + 1, level + 1),
          ring(i, level + 1)
        ]
        for (const at of [0, 1, 2, 0, 2, 3]) {
          positions.push(...points[at])
          color.set(
            ['#a99471', '#897554', '#786951', '#9b8765'][(i * 7 + level) % 4]
          )
          shades.push(color.r, color.g, color.b)
        }
      }
    const geology = new THREE.BufferGeometry()
    geology.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    )
    geology.setAttribute('color', new THREE.Float32BufferAttribute(shades, 3))
    geology.computeVertexNormals()
    mesh(geology, rock, [0, 0, 0], island)
    return island
  }
  land(0, 0, 7.8, 0.82)
  land(-9.7, -0.6, 2.55, 0.85, -0.15)
  // Root systems and hanging vines give the underside a natural silhouette.
  for (let i = 0; i < 12; i++) {
    const a = i * 2.4,
      x = Math.cos(a) * 6.5,
      z = Math.sin(a) * 5.4
    line(
      [
        [x, -0.1, z],
        [x * 0.93, -0.8, z * 0.94],
        [x * 0.82 + 0.3, -1.7, z * 0.8],
        [x * 0.82, -2.1 - (i % 3) * 0.25, z * 0.8]
      ],
      0.06,
      i % 2 ? p.leaf : p.bark,
      root
    )
  }
  // Irregular stepping stones mark an intentional, walkable village route.
  const paths = [
    [
      [0, 0.6],
      [-1.2, 0.4],
      [-3.4, 0.4],
      [-3.4, -0.45]
    ],
    [
      [0, 0.6],
      [1.2, 0.4],
      [2.6, 0.4],
      [2.6, -0.7]
    ],
    [
      [0, 0.6],
      [1.4, 1.6],
      [2.7, 3.8],
      [4.7, 3.8]
    ],
    [
      [0, 0.6],
      [-1.4, 1.6],
      [-1.4, 4.45],
      [-3.4, 4.45]
    ]
  ]
  for (const points of paths)
    for (let j = 1; j < points.length; j++) {
      const [ax, az] = points[j - 1],
        [bx, bz] = points[j],
        distance = Math.hypot(bx - ax, bz - az),
        count = Math.ceil(distance / 0.38)
      for (let i = 0; i <= count; i++) {
        const t = i / count
        const step = cylinder(
          0.25,
          0.28,
          0.045,
          p.path,
          ax + (bx - ax) * t,
          0.015,
          az + (bz - az) * t,
          root,
          7
        )
        step.scale.z = 0.7
        step.rotation.y = i * 1.2
      }
    }
  // A rope bridge connects the small orchard to the main island.
  const bridge = group('', -7.4, 0.05, -0.1, root)
  bridge.rotation.y = -Math.PI / 2 + 0.12
  for (let i = 0; i < 13; i++)
    box(
      1.1,
      0.09,
      0.19,
      i % 3 ? p.wood : p.darkWood,
      0,
      -Math.sin((i / 12) * Math.PI) * 0.16,
      (i - 6) * 0.2,
      bridge
    )
  for (const side of [-1, 1]) {
    for (const z of [-1.3, 1.3])
      cylinder(0.045, 0.06, 0.95, p.bark, side * 0.57, 0.38, z, bridge)
    line(
      [
        [side * 0.57, 0.75, -1.3],
        [side * 0.57, 0.46, 0],
        [side * 0.57, 0.75, 1.3]
      ],
      0.025,
      p.cream,
      bridge
    )
    for (let i = 0; i < 7; i++)
      line(
        [
          [
            side * 0.57,
            0.6 - Math.sin((i / 6) * Math.PI) * 0.13,
            (i - 3) * 0.4
          ],
          [side * 0.57, 0, (i - 3) * 0.4]
        ],
        0.012,
        p.cream,
        bridge
      )
  }
  // Pond, arched footbridge and a stream spilling into the clouds.
  const water = mat('#81b4ad', {
    roughness: 0.24,
    metalness: 0.18,
    transparent: true,
    opacity: 0.85
  })
  const pond = cylinder(1.45, 1.5, 0.05, water, 0, 0.025, 4.5, root, 48)
  pond.scale.z = 0.66
  for (let i = 0; i < 25; i++) {
    const a = (i / 25) * Math.PI * 2
    ball(
      0.18 + (i % 3) * 0.04,
      p.stone,
      Math.cos(a) * 1.5,
      0.05,
      4.5 + Math.sin(a) * 1.02,
      root,
      [1.3, 0.55, 1]
    )
  }
  for (let i = 0; i < 11; i++)
    box(
      0.68,
      0.07,
      0.18,
      p.wood,
      0.1,
      0.2 + Math.sin((i / 10) * Math.PI) * 0.23,
      3.5 + i * 0.19,
      root
    )
  for (const x of [-0.3, 0.5])
    line(
      [
        [x, 0.6, 3.45],
        [x, 0.95, 4.45],
        [x, 0.6, 5.5]
      ],
      0.035,
      p.darkWood,
      root
    )
  const stream = mesh(
    new THREE.PlaneGeometry(1.05, 3.5),
    water,
    [4.9, 0.035, 4.05],
    root
  )
  stream.rotation.x = -Math.PI / 2
  stream.rotation.z = -0.72
  const fallMaterial = mat('#bcdbd1', {
    transparent: true,
    opacity: 0.64,
    roughness: 0.2,
    side: THREE.DoubleSide,
    depthWrite: false
  })
  const waterfall = mesh(
    new THREE.PlaneGeometry(0.8, 3.7, 8, 20),
    fallMaterial,
    [6.1, -1.7, 4.3],
    root
  )
  waterfall.rotation.y = -0.3
  waterfall.castShadow = false
  moving.push(waterfall)
  const rippleMaterial = mat('#d8eadb', {
    transparent: true,
    opacity: 0.4,
    depthWrite: false
  })
  const ripples = []
  for (let i = 0; i < 3; i++) {
    const ripple = mesh(
      new THREE.RingGeometry(0.9, 0.92, 40),
      rippleMaterial,
      [0, 0.063, 4.5],
      root
    )
    ripple.rotation.x = -Math.PI / 2
    ripple.scale.y = 0.65
    ripple.castShadow = false
    moving.push(ripple)
    ripples.push(ripple)
  }
  const trees = []
  const sites = [
    [-6, -2, 1],
    [-5.5, -4, 1.2],
    [-2, -4.8, 1],
    [0, -4.9, 1.25],
    [4.7, -4, 1.1],
    [6.1, -2.3, 0.9],
    [6.2, 0, 1.15],
    [-6.1, 2.4, 1],
    [-5.4, 4.6, 0.8],
    [-1.4, 5.6, 0.6],
    [2.7, 5.1, 0.7],
    [-10.3, -1.4, 1],
    [-10.3, 0.8, 0.7]
  ]
  for (const [at, [x, z, size]] of sites.entries()) {
    const tree = group('', x, x < -8 ? -0.12 : 0, z, root)
    cylinder(0.085, 0.18, 1.8 * size, p.bark, 0, 0.9 * size, 0, tree)
    for (const side of [-1, 1])
      line(
        [
          [0, 0.7 * size, 0],
          [side * 0.3 * size, 1.25 * size, 0.1],
          [side * 0.52 * size, 1.5 * size, 0.16]
        ],
        0.045 * size,
        p.bark,
        tree
      )
    if (at % 3 === 0) {
      for (let i = 0; i < 4; i++)
        mesh(
          new THREE.ConeGeometry((0.85 - i * 0.13) * size, 1.15 * size, 9),
          i % 2 ? p.leaf : p.green,
          [0, (1.2 + i * 0.42) * size, 0],
          tree
        )
    } else {
      for (let i = 0; i < 6; i++)
        ball(
          0.65 * size,
          i % 2 ? p.leafLight : p.leaf,
          Math.sin(i * 2.4) * 0.45 * size,
          (1.7 + (i % 3) * 0.25) * size,
          Math.cos(i * 2.4) * 0.36 * size,
          tree,
          [1, 1.15, 0.9]
        )
      for (let i = 0; i < 4; i++)
        ball(
          0.1,
          p.terracotta,
          Math.sin(i * 2) * size * 0.6,
          1.8 * size,
          Math.cos(i * 2) * size * 0.6,
          tree
        )
    }
    trees.push(tree)
  }
  // Flowers are shared, instanced geometry rather than hundreds of draw calls.
  const flowerGeometry = new THREE.SphereGeometry(0.065, 6, 4)
  kit.geometries.add(flowerGeometry)
  const dummy = new THREE.Object3D()
  for (const [colorIndex, material] of [p.flower, p.cream, p.brass].entries()) {
    const flowers = new THREE.InstancedMesh(flowerGeometry, material, 65)
    let placed = 0
    for (let i = 0; placed < 65; i++) {
      const a = (i + colorIndex * 19) * 2.39996,
        r = 4.6 + (i % 17) * 0.13
      const x = Math.cos(a) * r,
        z = Math.sin(a) * r * 0.83
      if (
        (Math.abs(x + 3.4) < 1.6 && z > 1.7) ||
        (x > 3.6 && z > 0.8) ||
        (z < -0.5 && Math.abs(x) > 1)
      )
        continue
      dummy.position.set(x, 0.12 + (placed % 3) * 0.05, z)
      dummy.scale.set(1, 1.3, 1)
      dummy.updateMatrix()
      flowers.setMatrixAt(placed++, dummy.matrix)
    }
    root.add(flowers)
    moving.push(flowers)
  }
  // A quiet orchard bench on the satellite island.
  for (let i = 0; i < 4; i++)
    box(1.5, 0.08, 0.12, p.wood, -9.4, 0.38, 0.2 + i * 0.15, root)
  for (const x of [-10, -8.8])
    box(0.09, 0.55, 0.09, p.darkWood, x, 0.1, 0.4, root)
  return {
    root,
    moving,
    trees,
    water,
    update(time, quiet) {
      const positions = waterfall.geometry.attributes.position
      if (!quiet)
        for (let i = 0; i < positions.count; i++) {
          positions.setZ(
            i,
            Math.sin(positions.getY(i) * 5 - time * 5 + positions.getX(i) * 4) *
              0.045
          )
        }
      positions.needsUpdate = true
      ripples.forEach((item, i) => {
        const s = 0.35 + ((time * 0.14 + i / 3) % 1) * 0.8
        item.scale.set(s, s * 0.65, s)
      })
    }
  }
}

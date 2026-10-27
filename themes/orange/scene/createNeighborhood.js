import * as THREE from 'three'

// A small, reusable outdoor world. Static scenery joins the furniture batches;
// moving actors are batched inside their own local coordinate systems.
export function createNeighborhood({
  mesh,
  mat,
  group,
  box,
  cylinder,
  palette
}) {
  const garden = group('', 0, -0.49, 0)
  garden.name = 'orange-neighborhood'
  const road = mat('#687772'),
    path = mat('#d8c8a9'),
    bark = mat('#8a6a4f')
  const leaf = mat('#829b73'),
    lightLeaf = mat('#adbc8b')
  const glass = mat('#89aaa1', { roughness: 0.35 })
  const dark = mat('#364442'),
    tires = mat('#383b38')
  const lamps = mat('#ffe8af', { emissive: '#ffd28a', emissiveIntensity: 0.25 })
  const ring = (inner, outer, material, y) => {
    const item = mesh(
      new THREE.RingGeometry(inner, outer, 96),
      material,
      [0, y, 0],
      garden
    )
    item.rotation.x = -Math.PI / 2
    item.scale.y = 0.82
    item.castShadow = false
    return item
  }
  ring(6.55, 7.5, road, 0.02)
  ring(5.96, 6.5, path, 0.025)
  for (let i = 0; i < 4; i++)
    box(
      1.35,
      0.16,
      0.42,
      palette.cream,
      0,
      0.48 - i * 0.16,
      3.43 + i * 0.32,
      garden
    )
  for (let i = 0; i < 40; i++) {
    const angle = (i / 40) * Math.PI * 2
    const stripe = box(
      0.045,
      0.012,
      0.2,
      palette.cream,
      Math.cos(angle) * 7.02,
      0.035,
      Math.sin(angle) * 7.02 * 0.82,
      garden
    )
    stripe.rotation.y = -angle
    stripe.castShadow = false
  }
  const trees = []
  for (const [x, z, size] of [
    [-5.15, -2.4, 1.1],
    [-4.9, 2.9, 0.85],
    [5.1, -2.55, 1.2],
    [5.15, 1.65, 0.9],
    [-2.5, -4.25, 0.85],
    [2.1, -4.3, 0.95]
  ]) {
    cylinder(0.06, 0.1, 1.25 * size, bark, x, 0.63 * size, z, garden)
    for (const [dx, dy, dz, r] of [
      [0, 1.5, 0, 0.57],
      [-0.3, 1.25, 0.08, 0.45],
      [0.28, 1.3, -0.12, 0.48]
    ])
      mesh(
        new THREE.IcosahedronGeometry(r * size, 1),
        trees.length % 2 ? lightLeaf : leaf,
        [x + dx * size, dy * size, z + dz * size],
        garden
      )
    trees.push([x, z])
  }
  // A neighboring cottage makes the cutaway studio part of a lived-in place.
  const cottage = group('', -5.14, -0.48, 0.05)
  cottage.name = 'orange-garden-cottage'
  box(1.15, 1.12, 1.35, palette.peach, 0, 0.6, 0, cottage)
  const roof = mesh(
    new THREE.ConeGeometry(1.05, 0.64, 4),
    palette.green,
    [0, 1.48, 0],
    cottage
  )
  roof.rotation.y = Math.PI / 4
  roof.scale.z = 1.12
  box(0.4, 0.72, 0.04, palette.darkWood, 0.14, 0.4, 0.7, cottage)
  box(0.3, 0.32, 0.05, lamps, -0.3, 0.87, 0.7, cottage)
  box(0.48, 0.07, 0.28, palette.cream, 0.14, 0.075, 0.8, cottage)
  for (const angle of [0.35, 1.4, 2.6, 3.5, 4.8]) {
    const x = Math.cos(angle) * 5.85,
      z = Math.sin(angle) * 4.8
    cylinder(0.025, 0.045, 1.25, dark, x, 0.64, z, garden)
    mesh(new THREE.SphereGeometry(0.105, 8, 6), lamps, [x, 1.34, z], garden)
  }
  const cars = []
  for (let i = 0; i < 2; i++) {
    const root = group('', 0, -0.43, 0)
    root.name = `orange-car-${i}`
    const paint = i ? palette.cream : palette.orange
    box(0.55, 0.23, 1.05, paint, 0, 0.25, 0, root)
    box(0.45, 0.25, 0.53, paint, 0, 0.45, -0.03, root)
    box(0.39, 0.17, 0.035, glass, 0, 0.47, 0.25, root)
    box(0.39, 0.15, 0.035, glass, 0, 0.47, -0.31, root)
    for (const x of [-0.278, 0.278])
      for (const z of [-0.33, 0.33]) {
        const wheel = mesh(
          new THREE.CylinderGeometry(0.12, 0.12, 0.07, 12),
          tires,
          [x, 0.16, z],
          root
        )
        wheel.rotation.z = Math.PI / 2
      }
    for (const x of [-0.17, 0.17])
      box(0.11, 0.07, 0.035, lamps, x, 0.29, 0.54, root)
    cars.push(root)
  }
  const pedestrians = []
  const shirts = [
    mat('#bd8068'),
    mat('#688a8c'),
    mat('#b9a46b'),
    mat('#797b99')
  ]
  const skin = mat('#efc09b'),
    hair = mat('#5b4839')
  for (let i = 0; i < 4; i++) {
    const root = group('', 0, -0.47, 0)
    root.name = `orange-neighbor-${i}`
    mesh(
      new THREE.CapsuleGeometry(0.105, 0.18, 3, 6),
      shirts[i],
      [0, 0.36, 0],
      root
    )
    mesh(new THREE.SphereGeometry(0.12, 10, 7), skin, [0, 0.66, 0], root)
    const cap = mesh(
      new THREE.SphereGeometry(0.125, 10, 7, 0, Math.PI * 2, 0, Math.PI / 2),
      hair,
      [0, 0.68, 0],
      root
    )
    cap.rotation.x = -0.15
    const legs = [-1, 1].map(side => {
      const leg = new THREE.Group()
      leg.position.set(side * 0.06, 0.27, 0)
      root.add(leg)
      box(0.065, 0.23, 0.075, dark, 0, -0.1, 0, leg)
      box(0.085, 0.06, 0.14, palette.darkWood, 0, -0.21, 0.03, leg)
      return leg
    })
    for (const side of [-1, 1]) {
      const arm = mesh(
        new THREE.CapsuleGeometry(0.035, 0.16, 2, 5),
        skin,
        [side * 0.135, 0.37, 0],
        root
      )
      arm.rotation.z = side * 0.12
    }
    pedestrians.push({ root, legs })
  }
  const movingRoots = [...cars, ...pedestrians.map(person => person.root)]
  movingRoots.forEach(root =>
    root.traverse(item => {
      if (item.isMesh) item.castShadow = false
    })
  )
  let lastTime = 0
  const update = (nextTime, quiet = false) => {
    if (!quiet) lastTime = nextTime
    const time = lastTime
    cars.forEach((car, i) => {
      const direction = i ? -1 : 1,
        r = i ? 7.22 : 6.8
      const angle = time * (i ? -0.095 : 0.11) + i * 2.4
      car.position.x = Math.cos(angle) * r
      car.position.z = Math.sin(angle) * r * 0.82
      car.rotation.y = Math.atan2(
        -Math.sin(angle) * direction,
        Math.cos(angle) * 0.82 * direction
      )
    })
    pedestrians.forEach(({ root, legs }, i) => {
      const direction = i % 2 ? -1 : 1,
        angle = i * 1.6 + time * 0.055 * direction
      root.position.x = Math.cos(angle) * 6.23
      root.position.z = Math.sin(angle) * 5.11
      root.rotation.y = Math.atan2(
        -Math.sin(angle) * direction,
        Math.cos(angle) * 0.82 * direction
      )
      legs.forEach((leg, side) => {
        leg.rotation.x = quiet
          ? 0
          : Math.sin(time * 6 + i + side * Math.PI) * 0.48
      })
    })
  }
  update(0, true)
  return {
    movingRoots,
    pedestrians,
    cars,
    trees,
    update,
    lighting(night) {
      lamps.emissiveIntensity = night ? 1.7 : 0.25
    }
  }
}

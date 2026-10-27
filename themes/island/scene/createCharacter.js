import * as THREE from 'three'

// A sculpted interpretation of the supplied portrait, rather than a flat image plane.
// All geometry and materials are registered through the studio's resource helpers.
export function createCharacter({ mesh, mat, group }) {
  const root = group('home', 0.15, 0.12, 2.03)
  root.name = 'island-host'
  root.userData.character = true
  root.rotation.y = 0.3
  const skin = mat('#f2b78f', { roughness: 0.52 })
  const skinLight = mat('#f9c49f', { roughness: 0.55 })
  const earInner = mat('#e79e7b')
  const hair = mat('#39261f', { roughness: 0.68 })
  const hairLight = mat('#644435', { roughness: 0.4 })
  const shirt = mat('#d4c5a7', { roughness: 0.88 })
  const collar = mat('#b2baa1', { roughness: 0.9 })
  const trousers = mat('#52615b')
  const sole = mat('#ded8cb')
  const eyeWhite = mat('#fff6ed', { roughness: 0.25 })
  const iris = mat('#553120', { roughness: 0.2 })
  const pupil = mat('#1b1512', { roughness: 0.14 })
  const glint = mat('#fffdf6', { emissive: '#fff7e6', emissiveIntensity: 0.2 })
  const mouth = mat('#b76e59')
  const blush = mat('#efac92', { transparent: true, opacity: 0.44 })
  const ellipsoid = (size, material, position, parent = root) => {
    const item = mesh(
      new THREE.SphereGeometry(1, 32, 24),
      material,
      position,
      parent
    )
    item.scale.set(...size)
    return item
  }
  const tube = (points, radius, material, parent = root) =>
    mesh(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p))),
        20,
        radius,
        8,
        false
      ),
      material,
      [0, 0, 0],
      parent
    )
  // Rounded shoes and slightly tapered trousers.
  const legs = []
  for (const x of [-0.15, 0.15]) {
    const leg = new THREE.Group()
    leg.name = x < 0 ? 'leg-left' : 'leg-right'
    leg.position.set(x, 0.65, 0)
    root.add(leg)
    ellipsoid([0.14, 0.07, 0.24], sole, [0, -0.56, 0.08], leg)
    ellipsoid([0.135, 0.12, 0.22], shirt, [0, -0.49, 0.05], leg)
    ellipsoid([0.115, 0.31, 0.12], trousers, [0, -0.22, 0], leg)
    legs.push(leg)
  }
  ellipsoid([0.35, 0.43, 0.235], shirt, [0, 0.94, 0])
  // A soft canvas explorer's pack with a stitched flap and brass clasp.
  const canvas = mat('#a78359')
  ellipsoid([0.24, 0.29, 0.14], canvas, [0, 1.02, -0.24])
  ellipsoid([0.25, 0.1, 0.145], collar, [0, 1.22, -0.27])
  ellipsoid([0.035, 0.05, 0.02], sole, [0, 1.13, -0.39])
  for (const side of [-1, 1])
    tube(
      [
        [side * 0.18, 1.31, -0.14],
        [side * 0.23, 1.24, 0.18],
        [side * 0.22, 0.75, 0.18]
      ],
      0.025,
      canvas
    )
  ellipsoid([0.13, 0.16, 0.12], skin, [0, 1.32, 0])
  // A real three-dimensional face, ears and nose.
  const head = new THREE.Group()
  head.name = 'head'
  head.position.y = 1.85
  root.add(head)
  const face = ellipsoid([0.51, 0.6, 0.43], skin, [0, 0, 0], head)
  // Shape the cheeks and jaw as one surface, avoiding intersecting face pieces.
  const vertices = face.geometry.attributes.position
  for (let i = 0; i < vertices.count; i++) {
    const x = vertices.getX(i),
      y = vertices.getY(i),
      z = vertices.getZ(i)
    if (y < 0) {
      vertices.setX(i, x * (1 + y * 0.13))
      if (z > 0) vertices.setZ(i, z + Math.sin(-y * Math.PI) * 0.3 * z)
    }
  }
  vertices.needsUpdate = true
  face.geometry.computeVertexNormals()
  for (const side of [-1, 1]) {
    ellipsoid([0.11, 0.17, 0.085], skin, [side * 0.5, -0.04, 0], head)
    ellipsoid([0.056, 0.1, 0.025], earInner, [side * 0.535, -0.04, 0.07], head)
    ellipsoid([0.105, 0.055, 0.016], blush, [side * 0.31, -0.19, 0.371], head)
  }
  ellipsoid([0.075, 0.09, 0.095], skinLight, [0, -0.09, 0.444], head)
  const eyes = []
  const pupils = []
  for (const side of [-1, 1]) {
    const eye = new THREE.Group()
    eye.name = side < 0 ? 'eye-left' : 'eye-right'
    eye.position.set(side * 0.215, 0.052, 0.366)
    eye.rotation.y = side * 0.16
    head.add(eye)
    ellipsoid([0.16, 0.122, 0.07], eyeWhite, [0, 0, 0], eye)
    const gaze = new THREE.Group()
    gaze.name = side < 0 ? 'gaze-left' : 'gaze-right'
    eye.add(gaze)
    ellipsoid([0.089, 0.108, 0.038], iris, [0.008 * side, -0.002, 0.058], gaze)
    ellipsoid([0.048, 0.072, 0.02], pupil, [0.008 * side, 0, 0.089], gaze)
    pupils.push(gaze)
    ellipsoid([0.026, 0.027, 0.01], glint, [-0.025, 0.045, 0.106], eye)
    ellipsoid([0.011, 0.012, 0.008], glint, [0.037, -0.039, 0.099], eye)
    tube(
      [
        [-0.15, 0.025, 0],
        [-0.1, 0.105, 0.02],
        [0, 0.125, 0.029],
        [0.1, 0.092, 0.02],
        [0.15, 0.025, 0]
      ],
      0.012,
      hair,
      eye
    )
    eyes.push(eye)
    tube(
      [
        [side * 0.09, 0.239, 0.409],
        [side * 0.19, 0.272, 0.417],
        [side * 0.3, 0.249, 0.371],
        [side * 0.35, 0.22, 0.329]
      ],
      0.026,
      hairLight,
      head
    )
  }
  tube(
    [
      [-0.145, -0.284, 0.438],
      [-0.08, -0.312, 0.476],
      [0, -0.32, 0.485],
      [0.08, -0.312, 0.476],
      [0.145, -0.284, 0.438]
    ],
    0.012,
    mouth,
    head
  )
  ellipsoid([0.112, 0.018, 0.018], earInner, [0, -0.34, 0.474], head)
  // Hemispherical hair cap leaves the forehead and eyes uncovered.
  const cap = mesh(
    new THREE.SphereGeometry(1, 40, 24, 0, Math.PI * 2, 0, Math.PI * 0.59),
    hair,
    [0, 0.16, -0.065],
    head
  )
  cap.scale.set(0.56, 0.58, 0.46)
  // Soft swept locks are tapered curved meshes, with fine tonal strands.
  const lock = (points, width, depth, material) => {
    const curve = new THREE.CatmullRomCurve3(
      points.map(p => new THREE.Vector3(...p))
    )
    const frames = curve.computeFrenetFrames(20, false)
    const positions = []
    const indices = []
    for (let i = 0; i <= 20; i++) {
      const t = i / 20
      const center = curve.getPoint(t)
      const taper =
        Math.pow(Math.sin(Math.PI * (0.1 + t * 0.9)), 0.65) * (1 - t * 0.35)
      for (let j = 0; j < 12; j++) {
        const a = (j / 12) * Math.PI * 2
        const p = center
          .clone()
          .addScaledVector(frames.normals[i], Math.cos(a) * width * taper)
          .addScaledVector(frames.binormals[i], Math.sin(a) * depth * taper)
        positions.push(p.x, p.y, p.z)
        if (i < 20) {
          const n = i * 12 + j,
            k = i * 12 + ((j + 1) % 12)
          indices.push(n, k, n + 12, k, k + 12, n + 12)
        }
      }
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    )
    geometry.setIndex(indices)
    geometry.computeVertexNormals()
    mesh(geometry, material, [0, 0, 0], head)
  }
  const locks = [
    [
      [0.13, 0.53, 0.07],
      [-0.08, 0.66, 0.3],
      [-0.36, 0.48, 0.44],
      [-0.4, 0.2, 0.37]
    ],
    [
      [0.17, 0.54, 0.04],
      [0.42, 0.58, 0.16],
      [0.55, 0.39, 0.25],
      [0.47, 0.05, 0.28]
    ],
    [
      [0.02, 0.56, 0.18],
      [-0.11, 0.58, 0.43],
      [-0.25, 0.4, 0.5],
      [-0.23, 0.16, 0.44]
    ],
    [
      [0.1, 0.57, 0.14],
      [0.21, 0.53, 0.39],
      [0.3, 0.34, 0.49],
      [0.2, 0.16, 0.43]
    ],
    [
      [0.13, 0.57, 0.06],
      [0.38, 0.5, 0.28],
      [0.43, 0.28, 0.39],
      [0.39, 0.02, 0.31]
    ],
    [
      [-0.12, 0.56, -0.02],
      [-0.43, 0.5, 0.15],
      [-0.53, 0.24, 0.24],
      [-0.47, -0.03, 0.19]
    ],
    [
      [0.23, 0.55, -0.09],
      [0.45, 0.42, -0.1],
      [0.59, 0.15, 0.03],
      [0.51, -0.13, 0.05]
    ]
  ]
  locks.forEach((points, index) =>
    lock(points, index < 2 ? 0.16 : 0.105, 0.07, index % 2 ? hair : hairLight)
  )
  for (let i = 0; i < 5; i++) {
    const offset = i * 0.022
    tube(
      [
        [0.08 - offset, 0.625, 0.17],
        [-0.1 - offset, 0.617, 0.34],
        [-0.26 - offset, 0.42, 0.465]
      ],
      0.004,
      hair,
      head
    )
  }
  // Fine secondary locks catch the rim light without obscuring the face.
  for (let i = 0; i < 8; i++) {
    const offset = i * 0.021
    tube(
      [
        [0.18 + offset, 0.59 - offset * 0.15, 0.16],
        [0.32 + offset, 0.48, 0.34],
        [0.34 + offset * 0.6, 0.23, 0.405]
      ],
      0.003,
      i % 3 ? hair : hairLight,
      head
    )
  }
  // Black polo collar, placket and two small buttons from the reference portrait.
  for (const side of [-1, 1]) {
    const shape = new THREE.Shape()
    shape.moveTo(side * 0.01, 1.3)
    shape.lineTo(side * 0.2, 1.36)
    shape.lineTo(side * 0.27, 1.15)
    shape.lineTo(side * 0.13, 1.08)
    shape.closePath()
    const collarPiece = mesh(
      new THREE.ExtrudeGeometry(shape, {
        depth: 0.035,
        bevelEnabled: true,
        bevelThickness: 0.012,
        bevelSize: 0.012,
        bevelSegments: 2,
        steps: 1
      }),
      collar,
      [0, 0, 0.19],
      root
    )
    collarPiece.rotation.x = -0.04
  }
  ellipsoid([0.034, 0.17, 0.025], collar, [0, 1.08, 0.236])
  for (const y of [1.17, 1.035])
    ellipsoid([0.027, 0.027, 0.015], hair, [0, y, 0.262])
  const seam = mat('#464446', { roughness: 0.95 })
  for (const side of [-1, 1]) {
    tube(
      [
        [side * 0.25, 1.21, 0.11],
        [side * 0.32, 1.07, 0.16],
        [side * 0.31, 0.89, 0.17]
      ],
      0.005,
      seam
    )
    for (let i = 0; i < 3; i++)
      tube(
        [
          [-0.055, -0.46 + i * 0.025, 0.23],
          [0.055, -0.46 + i * 0.025, 0.23]
        ],
        0.007,
        sole,
        legs[side < 0 ? 0 : 1]
      )
  }
  const arms = []
  for (const side of [-1, 1]) {
    const arm = new THREE.Group()
    arm.name = side < 0 ? 'arm-left' : 'arm-right'
    arm.position.set(side * 0.295, 1.16, 0)
    root.add(arm)
    ellipsoid([0.14, 0.21, 0.15], shirt, [side * 0.055, -0.11, 0], arm)
    ellipsoid([0.09, 0.2, 0.09], skin, [side * 0.095, -0.32, 0.015], arm)
    ellipsoid([0.073, 0.085, 0.055], skinLight, [side * 0.11, -0.46, 0.03], arm)
    for (let finger = 0; finger < 4; finger++)
      ellipsoid(
        [0.018, 0.047 - Math.abs(finger - 1.5) * 0.007, 0.022],
        skinLight,
        [side * 0.11 + (finger - 1.5) * 0.032, -0.525, 0.035],
        arm
      )
    const thumb = ellipsoid(
      [0.03, 0.053, 0.03],
      skinLight,
      [side * 0.18, -0.45, 0.04],
      arm
    )
    thumb.rotation.z = -side * 0.5
    arm.rotation.z = side * 0.07
    arms.push(arm)
  }
  let waveUntil = 0
  let waveStart = -10
  let lastTime = 0
  let reactionStart = -10
  let lookX = 0
  let lookY = 0
  let facing = 0.3
  let travelHeading = null
  let walking = false
  let stride = 0
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n))
  return {
    root,
    locomotion(heading, moving) {
      travelHeading = heading
      walking = moving
    },
    wave() {
      waveStart = lastTime
      waveUntil = lastTime + 3.3
      reactionStart = lastTime
    },
    lookAt(x, y, angle = 0.3) {
      lookX = clamp(x, -1, 1)
      lookY = clamp(y, -1, 1)
      facing = clamp(angle, -0.65, 1.1)
    },
    react() {
      reactionStart = lastTime
    },
    update(time, quiet) {
      lastTime = time
      stride += ((walking && !quiet ? 1 : 0) - stride) * (quiet ? 1 : 0.18)
      const gait = Math.sin(time * 7.5) * stride
      const age = time - reactionStart
      const bounce =
        !quiet && age >= 0 && age < 1.1
          ? Math.sin((age / 1.1) * Math.PI) * 0.12
          : 0
      root.position.y =
        0.12 +
        (quiet
          ? 0
          : Math.sin(time * 1.5) * 0.016 + bounce + Math.abs(gait) * 0.025)
      const heading = travelHeading ?? facing
      const turn = Math.atan2(
        Math.sin(heading - root.rotation.y),
        Math.cos(heading - root.rotation.y)
      )
      root.rotation.y += turn * (quiet ? 1 : 0.14)
      legs[0].rotation.x = gait * 0.53
      legs[1].rotation.x = -gait * 0.53
      head.rotation.y = quiet
        ? 0
        : THREE.MathUtils.lerp(head.rotation.y, lookX * 0.2, 0.09)
      head.rotation.x = quiet
        ? 0
        : THREE.MathUtils.lerp(head.rotation.x, -lookY * 0.09, 0.09)
      pupils.forEach(gaze => {
        gaze.position.x = quiet ? 0 : lookX * 0.023
        gaze.position.y = quiet ? 0 : lookY * 0.012
      })
      head.rotation.z = quiet ? 0 : Math.sin(time * 0.55) * 0.025
      const blinking = !quiet && time % 5.7 > 5.48
      eyes.forEach(eye => {
        eye.scale.y = blinking ? 0.12 : 1
      })
      const waveBlend = quiet
        ? 0
        : clamp((time - waveStart) / 0.35, 0, 1) *
          clamp((waveUntil - time) / 0.45, 0, 1)
      arms[1].rotation.z = 0.07 + waveBlend * (2.28 + Math.sin(time * 9) * 0.22)
      arms[0].rotation.z = -0.07 + (quiet ? 0 : Math.sin(time * 1.4) * 0.035)
      arms[0].rotation.x = -gait * 0.4
      arms[1].rotation.x = gait * 0.4 * (1 - waveBlend)
    }
  }
}

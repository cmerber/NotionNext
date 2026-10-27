import * as THREE from 'three'
import { normalizeEnvironment } from './environments.js'

// Two reusable particle buffers and three small scenery groups. No extra RAF,
// textures, network assets, or allocations when changing the weather.
export function createWeather({ scene, geometries, materials }) {
  const roots = []
  const root = name => {
    const item = new THREE.Group()
    item.name = name
    scene.add(item)
    roots.push(item)
    return item
  }
  const material = (Type, props) => {
    const item = new Type(props)
    materials.add(item)
    return item
  }
  const geometry = item => {
    geometries.add(item)
    return item
  }
  const add = (parent, g, m, position, scale) => {
    const item = new THREE.Mesh(g, m)
    item.position.set(...position)
    if (scale) item.scale.set(...scale)
    item.castShadow = false
    item.receiveShadow = true
    // Decorations must never block destination picking.
    item.raycast = () => {}
    parent.add(item)
    return item
  }
  const rainRoot = root('orange-rain'),
    snowRoot = root('orange-snow'),
    desert = root('orange-desert'),
    snowCover = root('orange-snow-cover')
  const rainMaterial = material(THREE.LineBasicMaterial, {
    color: '#d0e4ef',
    transparent: true,
    opacity: 0.55,
    depthWrite: false
  })
  const snowMaterial = material(THREE.ShaderMaterial, {
    transparent: true,
    depthWrite: false,
    uniforms: {
      pointSize: { value: 100 },
      tint: { value: new THREE.Color('#fffdf4') }
    },
    vertexShader: `uniform float pointSize;
      void main() {
        vec4 p = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * p;
        gl_PointSize = clamp(pointSize / -p.z, 2.0, 8.0);
      }`,
    fragmentShader: `uniform vec3 tint;
      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        float a = 1.0 - smoothstep(0.2, 0.5, d);
        if (a < 0.02) discard;
        gl_FragColor = vec4(tint, a * 0.88);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`
  })
  const rainGeometry = geometry(new THREE.BufferGeometry()),
    snowGeometry = geometry(new THREE.BufferGeometry())
  const rainPositions = new Float32Array(420 * 6),
    snowPositions = new Float32Array(240 * 3)
  rainGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(rainPositions, 3).setUsage(THREE.DynamicDrawUsage)
  )
  snowGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(snowPositions, 3).setUsage(THREE.DynamicDrawUsage)
  )
  const rain = new THREE.LineSegments(rainGeometry, rainMaterial),
    snow = new THREE.Points(snowGeometry, snowMaterial)
  for (const [parent, item] of [
    [rainRoot, rain],
    [snowRoot, snow]
  ]) {
    parent.add(item)
    item.frustumCulled = false
    item.raycast = () => {}
  }
  // Elliptical fall zones leave the cutaway room dry and readable.
  const seeds = Array.from({ length: 420 }, (_, i) => {
    const angle = i * 2.39996323,
      radius = 6 + (((i * 37) % 100) / 100) * 4.8
    return [
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * 0.83,
      ((i * 53) % 101) / 101
    ]
  })
  const snowMat = material(THREE.MeshStandardMaterial, {
    color: '#f6f5ed',
    roughness: 1
  })
  const snowCap = geometry(
    new THREE.SphereGeometry(1, 12, 7, 0, Math.PI * 2, 0, Math.PI / 2)
  )
  const treeSites = [
    [-5.15, -2.4, 1.1],
    [-4.9, 2.9, 0.85],
    [5.1, -2.55, 1.2],
    [5.15, 1.65, 0.9],
    [-2.5, -4.25, 0.85],
    [2.1, -4.3, 0.95]
  ]
  treeSites.forEach(([x, z, size]) => {
    add(
      snowCover,
      snowCap,
      snowMat,
      [x, -0.49 + 1.69 * size, z],
      [0.55 * size, 0.24 * size, 0.55 * size]
    )
  })
  const roof = geometry(new THREE.ConeGeometry(1.08, 0.65, 4))
  const snowRoof = add(
    snowCover,
    roof,
    snowMat,
    [-5.14, 1.04, 0.05],
    [1, 1, 1.12]
  )
  snowRoof.rotation.y = Math.PI / 4
  const mound = geometry(new THREE.SphereGeometry(1, 12, 7))
  for (let i = 0; i < 9; i++) {
    const angle = i * 2.4,
      radius = 5.2 + (i % 3) * 0.2
    add(
      snowCover,
      mound,
      snowMat,
      [Math.cos(angle) * radius, -0.42, Math.sin(angle) * radius * 0.83],
      [0.55, 0.16, 0.38]
    )
  }
  const sand = material(THREE.MeshStandardMaterial, {
      color: '#dfb777',
      roughness: 1
    }),
    cactusMat = material(THREE.MeshStandardMaterial, {
      color: '#718867',
      roughness: 0.9
    }),
    cactusTip = material(THREE.MeshStandardMaterial, {
      color: '#c38f66',
      roughness: 1
    })
  for (const [i, [x, z]] of [
    [-5.3, 3.2],
    [5.2, 2.2],
    [-2.4, -4.6],
    [4.9, -3]
  ].entries()) {
    add(desert, mound, sand, [x, -0.43, z], [1.05, 0.34, 0.68])
    const size = 0.85 + (i % 2) * 0.3
    const trunk = geometry(new THREE.CapsuleGeometry(0.13, 0.9 * size, 3, 8))
    add(desert, trunk, cactusMat, [x, 0.18, z])
    for (const side of [-1, 1]) {
      const arm = add(
        desert,
        geometry(new THREE.CapsuleGeometry(0.085, 0.28, 3, 8)),
        cactusMat,
        [x + side * 0.22, 0.11 + side * 0.12, z]
      )
      arm.rotation.z = (side * Math.PI) / 2
      add(
        desert,
        geometry(new THREE.CapsuleGeometry(0.085, 0.25, 3, 8)),
        cactusMat,
        [x + side * 0.38, 0.29 + side * 0.12, z]
      )
    }
    add(
      desert,
      mound,
      cactusTip,
      [x, 0.7 + (size - 0.85) * 0.5, z],
      [0.11, 0.05, 0.11]
    )
  }
  const puddles = root('orange-puddles')
  const puddleMat = material(THREE.MeshStandardMaterial, {
    color: '#9eb5bd',
    roughness: 0.16,
    metalness: 0.12,
    transparent: true,
    opacity: 0.58,
    depthWrite: false
  })
  const rippleMat = material(THREE.MeshBasicMaterial, {
    color: '#d4e7eb',
    transparent: true,
    opacity: 0.4,
    depthWrite: false
  })
  const disk = geometry(new THREE.CircleGeometry(1, 24)),
    ring = geometry(new THREE.RingGeometry(0.91, 1, 24))
  const ripples = []
  for (let i = 0; i < 6; i++) {
    const angle = i * 1.08 + 0.2,
      x = Math.cos(angle) * 5.68,
      z = Math.sin(angle) * 4.6
    const puddle = add(
      puddles,
      disk,
      puddleMat,
      [x, -0.455, z],
      [0.48, 0.29, 1]
    )
    puddle.rotation.x = -Math.PI / 2
    const ripple = add(puddles, ring, rippleMat, [x, -0.45, z])
    ripple.rotation.x = -Math.PI / 2
    ripples.push(ripple)
  }
  let mode = 'sunny',
    count = 420,
    enabled = true,
    lastTime = 0
  function update(time, quiet = false) {
    if (!quiet) lastTime = time
    const t = lastTime
    if (mode === 'rain' && enabled) {
      for (let i = 0; i < count; i++) {
        const [x, z, phase] = seeds[i],
          y = 8 - ((t * 6.8 + phase * 9) % 9),
          at = i * 6
        rainPositions[at] = x + y * 0.13
        rainPositions[at + 1] = y
        rainPositions[at + 2] = z
        rainPositions[at + 3] = x + (y - 0.3) * 0.13
        rainPositions[at + 4] = y - 0.3
        rainPositions[at + 5] = z
      }
      rainGeometry.attributes.position.needsUpdate = true
      ripples.forEach((item, i) => {
        const phase = (t * 0.8 + i * 0.17) % 1
        item.scale.setScalar(0.1 + phase * 0.32)
      })
    } else if ((mode === 'snow' || mode === 'desert') && enabled) {
      for (let i = 0; i < count; i++) {
        const [x, z, phase] = seeds[i],
          at = i * 3
        snowPositions[at] = x + Math.sin(t * 0.7 + i) * 0.28
        snowPositions[at + 1] =
          mode === 'desert'
            ? 0.1 + phase * 2.5 + Math.sin(t * 0.35 + i) * 0.12
            : 8 - ((t * (0.5 + phase * 0.3) + phase * 9) % 9)
        snowPositions[at + 2] = z + Math.cos(t * 0.5 + i) * 0.22
      }
      snowGeometry.attributes.position.needsUpdate = true
    }
  }
  return {
    roots,
    // Mode visibility groups must stay outside the global furniture merge.
    scenery: [snowCover, desert],
    rain,
    snow,
    configure({
      environment,
      night,
      ambience = true,
      compact = false,
      safe = false,
      reducedMotion = false
    }) {
      mode = normalizeEnvironment(environment)
      enabled = ambience && !reducedMotion
      count =
        mode === 'desert'
          ? compact || safe
            ? 50
            : 120
          : mode === 'snow'
            ? compact || safe
              ? 90
              : 240
            : compact || safe
              ? 160
              : 420
      rainGeometry.setDrawRange(0, mode === 'rain' ? count * 2 : 0)
      snowGeometry.setDrawRange(
        0,
        mode === 'snow' || mode === 'desert' ? count : 0
      )
      rainRoot.visible = mode === 'rain' && enabled
      snowRoot.visible = (mode === 'snow' || mode === 'desert') && enabled
      puddles.visible = mode === 'rain'
      ripples.forEach(item => {
        item.visible = enabled
      })
      snowCover.visible = mode === 'snow'
      desert.visible = mode === 'desert'
      rainMaterial.opacity = night ? 0.38 : 0.55
      snowMaterial.uniforms.pointSize.value = mode === 'desert' ? 45 : 100
      snowMaterial.uniforms.tint.value.set(
        mode === 'desert' ? '#e8be7d' : night ? '#d9e8ff' : '#fffdf4'
      )
      update(lastTime, true)
    },
    update
  }
}

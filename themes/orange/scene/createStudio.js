import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { createCharacter } from './createCharacter'

// Original procedural geometry: no remote models, textures, or model service.
export function createStudio(host, initial, callbacks) {
  let renderer
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: initial.quality !== 'safe',
      alpha: true,
      powerPreference:
        initial.quality === 'safe' ? 'low-power' : 'high-performance'
    })
  } catch (error) {
    // Retry without multisampling for devices with a smaller GPU budget.
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: 'default'
      })
    } catch (fallbackError) {
      console.warn(
        '[Orange 3D] Renderer initialization failed',
        fallbackError.message
      )
      callbacks.onUnavailable('initialization')
      return { update() {}, dispose() {} }
    }
  }
  let state = { ...initial }
  let disposed = false
  let frame = 0
  let visible = true
  let hovered = ''
  let down = null
  let moved = false
  let time = 0
  let previous = 0
  let compact = false
  let contextTimer
  let contextUnavailable = false
  let flight = null
  let tourTime = 0
  let userOrbit = false
  const materials = new Set()
  const geometries = new Set()
  const textures = new Set()
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 140)
  scene.fog = new THREE.FogExp2('#e3e5db', 0.015)
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  host.appendChild(renderer.domElement)
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.065
  controls.enablePan = false
  controls.minPolarAngle = Math.PI / 5.5
  controls.maxPolarAngle = Math.PI / 2.15
  controls.minDistance = 5
  controls.maxDistance = 30
  // Keep ordinary page scrolling available on touch screens and mouse wheels.
  controls.mouseButtons.MIDDLE = null
  controls.enableZoom = false
  controls.touches.ONE = THREE.TOUCH.ROTATE
  controls.touches.TWO = null
  renderer.domElement.style.touchAction = 'pan-y pinch-zoom'

  const mat = (color, extra = {}) => {
    const value = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.82,
      ...extra
    })
    materials.add(value)
    return value
  }
  const palette = {
    cream: mat('#f2e6d3'),
    wall: mat('#eadfcf'),
    wood: mat('#bd8e64'),
    darkWood: mat('#805c45'),
    green: mat('#6c8771'),
    sage: mat('#bfccb1'),
    orange: mat('#e98536'),
    peach: mat('#eeac7c'),
    white: mat('#ffefd5'),
    charcoal: mat('#283b39'),
    brass: mat('#c69b54', { metalness: 0.5 }),
    screen: mat('#8cbdb0', { emissive: '#4a8b78', emissiveIntensity: 0.45 }),
    glass: mat('#acccbc', { transparent: true, opacity: 0.65 }),
    soil: mat('#534336')
  }
  const mesh = (geometry, material, position, parent = scene) => {
    geometries.add(geometry)
    const item = new THREE.Mesh(geometry, material)
    item.position.set(...position)
    item.castShadow = true
    item.receiveShadow = true
    parent.add(item)
    return item
  }
  const box = (w, h, d, material, x, y, z, parent) =>
    mesh(
      new RoundedBoxGeometry(w, h, d, 2, Math.min(w, h, d, 0.22) * 0.22),
      material,
      [x, y, z],
      parent
    )
  const sphere = (radius, material, x, y, z, parent) =>
    mesh(new THREE.SphereGeometry(radius, 20, 14), material, [x, y, z], parent)
  const cylinder = (top, bottom, height, material, x, y, z, parent) =>
    mesh(
      new THREE.CylinderGeometry(top, bottom, height, 24),
      material,
      [x, y, z],
      parent
    )
  const group = (id, x = 0, y = 0, z = 0) => {
    const item = new THREE.Group()
    item.userData.place = id
    item.position.set(x, y, z)
    scene.add(item)
    return item
  }
  const label = (
    text,
    width,
    height,
    x,
    y,
    z,
    parent,
    background = '#f1e4cb',
    color = '#375346'
  ) => {
    const canvas = document.createElement('canvas')
    canvas.width = 768
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = background
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = color
    ctx.font = 'bold 68px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, 384, 128)
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    textures.add(texture)
    return mesh(
      new THREE.PlaneGeometry(width, height),
      mat('#ffffff', { map: texture }),
      [x, y, z],
      parent
    )
  }

  const ambient = new THREE.HemisphereLight('#fff3e4', '#9cae9b', 2.1)
  scene.add(ambient)
  const sun = new THREE.DirectionalLight('#ffead4', 2.8)
  sun.position.set(3, 10, 7)
  sun.castShadow = true
  sun.shadow.mapSize.set(1024, 1024)
  Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8 })
  sun.shadow.normalBias = 0.04
  sun.shadow.radius = 4
  scene.add(sun)
  const lampLight = new THREE.PointLight('#ffb963', 4, 7, 2)
  lampLight.position.set(2.6, 3, -1.7)
  scene.add(lampLight)

  // Floating foundation and cutaway walls.
  box(8.6, 0.4, 6.8, palette.green, 0, -0.38, 0)
  box(8.45, 0.17, 6.65, palette.wood, 0, -0.1, 0)
  box(8.2, 0.12, 6.4, palette.cream, 0, 0.04, 0)
  for (let x = -3.8; x < 4; x += 0.55)
    box(0.018, 0.012, 6.3, palette.wood, x, 0.107, 0)
  box(8.2, 0.55, 0.18, palette.wall, 0, 0.4, -3.12)
  box(0.18, 0.55, 6.3, palette.wall, -4.02, 0.4, 0)
  for (const x of [-4.02, 4.02])
    box(0.12, 3.4, 0.12, palette.wood, x, 1.8, -3.12)
  box(8.25, 0.12, 0.25, palette.darkWood, 0, 3.54, -3.12)
  box(8.2, 0.17, 0.14, palette.wood, 0, 0.23, -2.98)
  box(0.14, 0.17, 6.2, palette.wood, -3.9, 0.23, 0)
  label('QCODE · LITTLE STUDIO', 2.75, 0.6, 0, 2.95, -3.01)
  // A little window with divided panes above the desk.
  box(2.1, 1.4, 0.12, palette.darkWood, 2.35, 2.22, -2.97)
  box(1.91, 1.22, 0.06, palette.glass, 2.35, 2.22, -2.89)
  box(0.06, 1.25, 0.08, palette.white, 2.35, 2.22, -2.84)
  box(1.95, 0.06, 0.08, palette.white, 2.35, 2.22, -2.84)
  box(2.3, 0.1, 0.38, palette.wood, 2.35, 1.5, -2.8)

  const shelf = group('journal', -2.4, 0, -2.48)
  const animatedBooks = []
  box(2.1, 2.65, 0.08, palette.wood, 0, 1.43, -0.32, shelf)
  for (const x of [-1, 1])
    box(0.12, 2.65, 0.8, palette.darkWood, x, 1.43, 0, shelf)
  box(2.1, 0.12, 0.8, palette.darkWood, 0, 2.76, 0, shelf)
  const books = [
    palette.sage,
    palette.orange,
    palette.white,
    palette.green,
    palette.peach
  ]
  for (let row = 0; row < 3; row++) {
    box(2.2, 0.12, 0.85, palette.darkWood, 0, 0.35 + row * 0.76, 0.1, shelf)
    for (let book = 0; book < 7; book++) {
      const h = 0.38 + ((book * 3 + row) % 4) * 0.06
      const b = box(
        0.18,
        h,
        0.43,
        books[(book + row) % books.length],
        -0.78 + book * 0.25,
        0.42 + row * 0.76 + h / 2,
        0.13,
        shelf
      )
      b.rotation.z = book === 5 ? -0.13 : 0
      animatedBooks.push({ mesh: b, index: book + row * 7 })
      box(
        0.12,
        0.025,
        0.01,
        palette.brass,
        -0.78 + book * 0.25,
        0.5 + row * 0.76,
        0.351,
        shelf
      )
    }
  }
  label('01 / JOURNAL', 1.45, 0.31, 0, 2.55, 0.39, shelf)

  const desk = group('tools', 1.23, 0, -1.55)
  box(2.9, 0.16, 1.35, palette.wood, 0, 1.2, 0, desk)
  for (const x of [-1.22, 1.22])
    for (const z of [-0.48, 0.48])
      box(0.12, 1.05, 0.12, palette.green, x, 0.61, z, desk)
  box(1.3, 0.83, 0.12, palette.charcoal, -0.25, 1.94, -0.25, desk)
  box(1.15, 0.67, 0.025, palette.screen, -0.25, 1.94, -0.176, desk)
  label(
    '> hello, world_',
    1.05,
    0.34,
    -0.25,
    1.99,
    -0.157,
    desk,
    '#305c4e',
    '#e6ecd1'
  )
  box(0.12, 0.28, 0.1, palette.charcoal, -0.25, 1.44, -0.25, desk)
  box(0.5, 0.05, 0.35, palette.charcoal, -0.25, 1.31, -0.15, desk)
  box(0.88, 0.045, 0.29, palette.cream, -0.3, 1.31, 0.35, desk)
  for (let i = 0; i < 8; i++)
    box(0.055, 0.015, 0.2, palette.sage, -0.65 + i * 0.1, 1.34, 0.35, desk)
  cylinder(0.14, 0.11, 0.28, palette.orange, 0.93, 1.42, 0.19, desk)
  cylinder(0.12, 0.12, 0.012, palette.soil, 0.93, 1.566, 0.19, desk)
  label('02 / MAKE THINGS', 1.5, 0.3, 0, 1.12, 0.69, desk)
  const chair = group('tools', 1.03, 0, 0.05)
  box(0.92, 0.18, 0.83, palette.green, 0, 0.7, 0, chair)
  box(0.92, 0.73, 0.14, palette.green, 0, 1.1, 0.35, chair)
  cylinder(0.07, 0.07, 0.5, palette.charcoal, 0, 0.4, 0, chair)
  box(0.9, 0.06, 0.1, palette.charcoal, 0, 0.18, 0, chair)
  box(0.1, 0.06, 0.8, palette.charcoal, 0, 0.18, 0, chair)

  const cabinet = group('profile', 3.05, 0, 0.85)
  box(1.25, 1.6, 0.87, palette.green, 0, 0.95, 0, cabinet)
  for (let row = 0; row < 3; row++) {
    box(1.1, 0.43, 0.06, palette.sage, 0, 0.45 + row * 0.47, 0.47, cabinet)
    box(0.25, 0.04, 0.07, palette.brass, 0, 0.49 + row * 0.47, 0.53, cabinet)
  }
  label('03 / QUESTS', 1.05, 0.28, 0, 1.64, 0.48, cabinet)
  cylinder(0.26, 0.32, 0.12, palette.darkWood, 0, 1.8, 0, cabinet)
  cylinder(0.08, 0.08, 0.24, palette.brass, 0, 1.98, 0, cabinet)
  sphere(0.25, palette.orange, 0, 2.2, 0, cabinet)
  const leaf = sphere(0.1, palette.green, 0.12, 2.4, 0, cabinet)
  leaf.scale.set(1.6, 0.3, 1)

  const sofa = group('about', -2.78, 0, 0.62)
  sofa.rotation.y = Math.PI / 2
  box(2, 0.38, 0.94, palette.green, 0, 0.44, 0, sofa)
  box(2, 0.86, 0.22, palette.green, 0, 0.84, -0.4, sofa)
  for (const x of [-1, 1]) box(0.24, 0.6, 1, palette.green, x, 0.68, 0, sofa)
  for (const x of [-0.48, 0.48])
    box(0.87, 0.17, 0.75, palette.sage, x, 0.7, 0.06, sofa)
  const cushion = box(0.52, 0.53, 0.18, palette.peach, -0.45, 1, -0.17, sofa)
  cushion.rotation.z = -0.18
  label('04 / STAY A WHILE', 1.65, 0.28, 0, 0.43, 0.49, sofa)
  const rug = mesh(
    new THREE.CircleGeometry(1.47, 48),
    palette.sage,
    [-0.6, 0.12, 1.15]
  )
  rug.rotation.x = -Math.PI / 2
  rug.scale.set(1.15, 0.82, 1)
  cylinder(0.64, 0.64, 0.12, palette.wood, -1.5, 0.72, 1.1)
  cylinder(0.12, 0.22, 0.55, palette.darkWood, -1.5, 0.4, 1.1)
  box(0.48, 0.06, 0.36, palette.white, -1.48, 0.81, 1.1)
  box(0.46, 0.025, 0.36, palette.orange, -1.48, 0.85, 1.1)

  const character = createCharacter({ mesh, mat, group })
  character.root.scale.setScalar(1.08)

  // Orange tree, wall clock, and task lamp.
  const tree = group('about', 3.2, 0, -2.1)
  cylinder(0.32, 0.23, 0.51, palette.peach, 0, 0.37, 0, tree)
  cylinder(0.28, 0.28, 0.015, palette.soil, 0, 0.633, 0, tree)
  cylinder(0.065, 0.09, 1.22, palette.darkWood, 0, 1.1, 0, tree)
  for (const [x, y, z] of [
    [0, 2.02, 0],
    [-0.32, 1.73, 0.08],
    [0.32, 1.8, -0.02],
    [0.04, 1.8, 0.33]
  ])
    sphere(0.42, palette.green, x, y, z, tree)
  for (const [x, y, z] of [
    [-0.22, 2.13, 0.28],
    [0.32, 1.78, 0.29],
    [-0.35, 1.63, 0.3],
    [0.18, 2.25, 0.03]
  ])
    sphere(0.11, palette.orange, x, y, z, tree)
  cylinder(0.22, 0.22, 0.05, palette.brass, 2.36, 1.34, -1.97)
  cylinder(0.035, 0.035, 0.8, palette.brass, 2.36, 1.74, -1.97)
  cylinder(0.15, 0.38, 0.33, palette.orange, 2.36, 2.19, -1.97)
  const clock = cylinder(0.31, 0.31, 0.09, palette.white, -0.4, 2.22, -2.98)
  clock.rotation.x = Math.PI / 2
  box(0.025, 0.2, 0.025, palette.charcoal, -0.4, 2.3, -2.91)
  box(0.17, 0.025, 0.025, palette.charcoal, -0.33, 2.22, -2.91)

  // Small garden details and soft, slow petals; no downloaded models or textures.
  const blossom = mat('#edc2b6', { roughness: 0.85 })
  const flowerCenter = mat('#d8af6c')
  for (let i = 0; i < 5; i++) {
    const x = -3.2 + i * 0.36
    cylinder(0.045, 0.045, 0.55 + (i % 2) * 0.12, palette.green, x, 0.42, 2.48)
    for (let p = 0; p < 5; p++) {
      const a = (p / 5) * Math.PI * 2
      const petal = sphere(
        0.09,
        blossom,
        x + Math.cos(a) * 0.12,
        0.72 + (i % 2) * 0.12 + Math.sin(a) * 0.12,
        2.5
      )
      petal.scale.z = 0.35
    }
    sphere(0.065, flowerCenter, x, 0.72 + (i % 2) * 0.12, 2.54)
  }
  const particles = new THREE.Group()
  scene.add(particles)
  const petalMaterial = mat('#f2c8ba', {
    transparent: true,
    opacity: 0.65,
    side: THREE.DoubleSide,
    depthWrite: false
  })
  const glowMaterial = mat('#f9df9b', {
    transparent: true,
    opacity: 0.8,
    emissive: '#f9cf73',
    emissiveIntensity: 1.1,
    depthWrite: false
  })
  const drifting = []
  for (let i = 0; i < 28; i++) {
    const petal = mesh(
      new THREE.SphereGeometry(0.035, 8, 6),
      petalMaterial,
      [
        Math.sin(i * 4.7) * 4.2,
        1 + ((i * 0.73) % 4.3),
        Math.cos(i * 3.1) * 3.1
      ],
      particles
    )
    petal.scale.set(1.8, 0.4, 1)
    petal.castShadow = false
    petal.receiveShadow = false
    drifting.push(petal)
  }
  const steamMaterial = mat('#fff4e5', {
    transparent: true,
    opacity: 0.22,
    depthWrite: false
  })
  const steam = []
  for (let i = 0; i < 3; i++) {
    const puff = sphere(0.035, steamMaterial, 2.16, 1.75 + i * 0.12, -1.36)
    puff.scale.set(0.7, 2.2, 0.7)
    puff.castShadow = false
    steam.push(puff)
  }

  const shadowMaterial = new THREE.ShadowMaterial({ opacity: 0.15 })
  materials.add(shadowMaterial)
  const ground = mesh(
    new THREE.PlaneGeometry(200, 200),
    shadowMaterial,
    [0, -0.61, 0]
  )
  ground.rotation.x = -Math.PI / 2
  ground.castShadow = false
  ground.visible = false

  // A floating garden, with a faceted underside and fine celestial orbits.
  const island = group('', 0, -0.7, 0)
  const moss = mat('#a6b69c')
  const stone = mat('#b6beb0', { flatShading: true, roughness: 1 })
  const islandTop = cylinder(5.15, 4.8, 0.34, moss, 0, 0, 0, island)
  islandTop.scale.z = 0.83
  const rock = mesh(
    new THREE.IcosahedronGeometry(4.75, 1),
    stone,
    [0, -0.7, 0],
    island
  )
  rock.scale.set(1, 0.36, 0.82)
  for (let i = 0; i < 18; i++) {
    const a = i * 2.39996
    const shrub = sphere(
      0.25 + (i % 3) * 0.07,
      i % 3 ? palette.sage : palette.green,
      Math.cos(a) * 4.55,
      0.2,
      Math.sin(a) * 3.65,
      island
    )
    shrub.scale.y = 0.7
  }
  const orbitMaterial = mat('#ddc48e', {
    metalness: 0.55,
    roughness: 0.3,
    emissive: '#a08045',
    emissiveIntensity: 0.15
  })
  const orbit = mesh(
    new THREE.TorusGeometry(6.65, 0.012, 5, 180),
    orbitMaterial,
    [0, -0.65, 0]
  )
  orbit.rotation.set(1.2, 0.25, -0.2)
  const innerOrbit = mesh(
    new THREE.TorusGeometry(6.1, 0.007, 4, 150),
    orbitMaterial,
    [0, -0.5, 0]
  )
  innerOrbit.rotation.set(1.6, -0.2, 0.3)
  const satellite = sphere(0.28, palette.orange, 0, 0, 0)
  const moonMaterial = mat('#ffebc2', {
    emissive: '#ffc77d',
    emissiveIntensity: 0.6,
    roughness: 1
  })
  const moon = sphere(1.35, moonMaterial, 7, 4.6, -8)
  const halo = mesh(
    new THREE.TorusGeometry(1.75, 0.012, 4, 100),
    orbitMaterial,
    [7, 4.6, -8]
  )
  halo.rotation.set(0.35, 0.35, -0.4)
  const clouds = []
  const cloudMaterial = mat('#fff5e7', {
    roughness: 1,
    transparent: true,
    opacity: 0.78,
    depthWrite: false
  })
  const cloudGeometry = new THREE.SphereGeometry(1, 16, 10)
  for (let i = 0; i < 11; i++) {
    const cloud = new THREE.Group()
    const a = i * 2.4
    cloud.position.set(
      Math.cos(a) * (9 + (i % 3)),
      -1.9 + (i % 4) * 0.55,
      Math.sin(a) * (7 + (i % 3))
    )
    for (let j = 0; j < 4; j++) {
      const puff = mesh(
        cloudGeometry,
        cloudMaterial,
        [(j - 1.5) * 0.8, Math.sin(j * 2) * 0.2, 0],
        cloud
      )
      puff.scale.set(1.1, 0.48 + (j % 2) * 0.2, 0.65)
      puff.castShadow = false
      puff.receiveShadow = false
    }
    scene.add(cloud)
    clouds.push(cloud)
  }
  const starPositions = []
  for (let i = 0; i < 180; i++) {
    starPositions.push(
      Math.sin(i * 137.5) * 36,
      3 + ((i * 2.31) % 22),
      Math.cos(i * 41.7) * 34
    )
  }
  const starsGeometry = new THREE.BufferGeometry()
  starsGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(starPositions, 3)
  )
  geometries.add(starsGeometry)
  const starsMaterial = new THREE.PointsMaterial({
    color: '#fff1ce',
    size: 0.065,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true
  })
  materials.add(starsMaterial)
  const stars = new THREE.Points(starsGeometry, starsMaterial)
  scene.add(stars)
  const beacon = mesh(
    new THREE.TorusGeometry(0.7, 0.018, 5, 64),
    mat('#ffe8a6', {
      emissive: '#edb96b',
      emissiveIntensity: 1.5,
      transparent: true,
      opacity: 0.7
    }),
    [0, 0.18, 0]
  )
  beacon.rotation.x = -Math.PI / 2
  beacon.castShadow = false
  const beaconLocations = {
    journal: [-2.4, 0.18, -1.8],
    tools: [1.2, 0.18, -0.5],
    profile: [3.05, 0.18, 0.85],
    about: [0.05, 0.18, 1.8]
  }
  const destination = new THREE.Vector3()
  const targetDestination = new THREE.Vector3()
  const flightStart = new THREE.Vector3()
  const targetStart = new THREE.Vector3()

  function cameraPose(intro = false) {
    const poses = [
      { position: [11.5, 9, 16.5], target: [0, 0.6, 0] },
      { position: [0.8, 7.8, 19.5], target: [0, 0.7, 0] },
      { position: [17, 8.8, 5.8], target: [0, 0.9, 0] }
    ]
    const focusPoses = {
      journal: { position: [1.1, 3.3, 5.8], target: [-2.2, 1.5, -2] },
      tools: { position: [5.7, 4.1, 4.3], target: [1.25, 1.6, -1.2] },
      profile: { position: [7.8, 3.6, 6], target: [3.05, 1.2, 0.85] },
      about: { position: [3.6, 2.8, 8.5], target: [0, 1.4, 1.5] }
    }
    const pose = focusPoses[state.focus] || poses[state.view % poses.length]
    destination.set(...pose.position)
    targetDestination.set(...pose.target)
    if (!state.focus && compact) destination.multiplyScalar(1.4)
    if (compact) targetDestination.y += 0.8
    if (intro) {
      camera.position.copy(destination).multiplyScalar(1.35)
      controls.target.copy(targetDestination)
      controls.update()
    }
    flightStart.copy(camera.position)
    targetStart.copy(controls.target)
    userOrbit = false
    tourTime = 0
    if (state.paused || reducedMotion.matches) {
      camera.position.copy(destination)
      controls.target.copy(targetDestination)
      controls.update()
      flight = null
    } else flight = { elapsed: 0, duration: intro ? 3.2 : 1.8 }
  }

  function moveCamera(delta) {
    if (flight) {
      flight.elapsed += delta
      const p = Math.min(1, flight.elapsed / flight.duration)
      const ease = p * p * (3 - 2 * p)
      camera.position.lerpVectors(flightStart, destination, ease)
      controls.target.lerpVectors(targetStart, targetDestination, ease)
      if (p === 1) flight = null
    } else if (state.tour && !state.focus && !userOrbit) {
      tourTime += delta
      const angle = Math.sin(tourTime * 0.12) * 0.38
      camera.position
        .copy(destination)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), angle)
      camera.position.y += Math.sin(tourTime * 0.3) * 0.32
    }
    controls.update()
  }

  function render() {
    host.dataset.camera = camera.position
      .toArray()
      .map(value => value.toFixed(2))
      .join(',')
    if (!disposed && !contextUnavailable) renderer.render(scene, camera)
  }
  function animate(timestamp) {
    frame = 0
    if (
      disposed ||
      contextUnavailable ||
      !visible ||
      document.hidden ||
      state.paused ||
      reducedMotion.matches
    )
      return
    // Small screens need fewer pixels and frames, while taps and camera changes
    // still render immediately. Keep vertical swipes and browser pinch zoom free.
    if (
      (compact || state.quality === 'safe') &&
      previous &&
      timestamp - previous < 1000 / 30
    ) {
      frame = requestAnimationFrame(animate)
      return
    }
    const delta = Math.min((timestamp - (previous || timestamp)) / 1000, 0.05)
    previous = timestamp
    time += delta
    moveCamera(delta)
    character.update(time, false)
    orbit.rotation.z = -0.2 + Math.sin(time * 0.1) * 0.08
    satellite.position.set(
      Math.cos(time * 0.22) * 6.65,
      -0.3 + Math.sin(time * 0.22) * 1.8,
      Math.sin(time * 0.22) * 5.7
    )
    clouds.forEach((cloud, index) => {
      cloud.position.y =
        -1.9 + (index % 4) * 0.55 + Math.sin(time * 0.18 + index) * 0.18
      cloud.rotation.y = Math.sin(time * 0.045 + index) * 0.12
    })
    stars.rotation.y = time * 0.002
    const activePlace =
      hovered === 'character' ? 'about' : hovered || state.focus
    beacon.visible = Boolean(beaconLocations[activePlace])
    if (beacon.visible) {
      beacon.position.set(...beaconLocations[activePlace])
      beacon.scale.setScalar(1 + Math.sin(time * 2) * 0.08)
    }
    animatedBooks.forEach(book => {
      const offset =
        activePlace === 'journal'
          ? 0.07 + Math.sin(time * 1.3 + book.index) * 0.035
          : 0
      book.mesh.position.z += (0.13 + offset - book.mesh.position.z) * 0.09
    })
    leaf.rotation.y = Math.sin(time) * 0.15
    tree.rotation.z = Math.sin(time * 0.65) * 0.012
    drifting.forEach((petal, index) => {
      petal.position.x = Math.sin(index * 4.7 + time * 0.07) * 4.2
      petal.position.y = state.night
        ? 1.3 + Math.sin(time * 0.4 + index) * 1.1
        : 4.8 - ((index * 0.73 + time * 0.18) % 4.5)
      petal.position.z = Math.cos(index * 3.1 + time * 0.09) * 3.1
      petal.rotation.z = time * 0.45 + index
    })
    steam.forEach((puff, index) => {
      puff.position.y = 1.65 + ((time * 0.12 + index * 0.14) % 0.45)
      puff.position.x = 2.16 + Math.sin(time + index) * 0.035
    })
    render()
    frame = requestAnimationFrame(animate)
  }
  function schedule() {
    if (frame) cancelAnimationFrame(frame)
    frame = 0
    previous = 0
    render()
    if (
      !disposed &&
      visible &&
      !document.hidden &&
      !state.paused &&
      !reducedMotion.matches
    )
      frame = requestAnimationFrame(animate)
  }
  function setView() {
    cameraPose()
  }
  function setLighting() {
    ambient.intensity = state.night ? 1.3 : 2.1
    ambient.color.set(state.night ? '#b4bfde' : '#fff3e4')
    sun.intensity = state.night ? 1.3 : 2.8
    sun.color.set(state.night ? '#b8c8ed' : '#ffead4')
    lampLight.intensity = state.night ? 13 : 2.5
    palette.screen.emissiveIntensity = state.night ? 1 : 0.45
    renderer.toneMappingExposure = state.night ? 1.05 : 1.05
    scene.fog.color.set(state.night ? '#344652' : '#e3e5db')
    cloudMaterial.color.set(state.night ? '#65737f' : '#fff5e7')
    stars.visible = state.night && state.ambience !== false
    moonMaterial.emissiveIntensity = state.night ? 1.5 : 0.4
    moon.scale.setScalar(state.night ? 0.72 : 1)
    particles.visible = state.ambience !== false
    drifting.forEach(petal => {
      petal.material = state.night ? glowMaterial : petalMaterial
      petal.scale.set(...(state.night ? [0.8, 0.8, 0.8] : [1.8, 0.4, 1]))
    })
  }
  function resize() {
    const width = host.clientWidth
    const height = host.clientHeight
    if (!width || !height) return
    const wasCompact = compact
    compact = width < 600
    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio || 1,
        state.quality === 'safe' ? 1 : compact ? 1.25 : 1.75
      )
    )
    const shadowSize = compact || state.quality === 'safe' ? 512 : 1024
    if (sun.shadow.mapSize.width !== shadowSize) {
      sun.shadow.mapSize.set(shadowSize, shadowSize)
      sun.shadow.map?.dispose()
      sun.shadow.map = null
      sun.shadow.needsUpdate = true
    }
    renderer.setSize(width, height)
    const aspect = width / height
    camera.aspect = aspect
    camera.fov = compact ? 48 : 36
    camera.updateProjectionMatrix()
    if (wasCompact !== compact) cameraPose()
    render()
  }
  function pick(event) {
    const bounds = renderer.domElement.getBoundingClientRect()
    pointer.set(
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      -((event.clientY - bounds.top) / bounds.height) * 2 + 1
    )
    raycaster.setFromCamera(pointer, camera)
    for (const hit of raycaster.intersectObjects(scene.children, true)) {
      let item = hit.object
      while (item) {
        if (item.userData.character) return 'character'
        if (item.userData.place) return item.userData.place
        item = item.parent
      }
      // Opaque architectural elements must not select hidden objects behind them.
      if (!hit.object.material.transparent) return ''
    }
    return ''
  }
  function pointerMove(event) {
    if (down && Math.hypot(event.clientX - down.x, event.clientY - down.y) > 6)
      moved = true
    const next = pick(event)
    if (next !== hovered) {
      hovered = next
      host.style.cursor = next ? 'pointer' : 'grab'
      callbacks.onHover(next === 'character' ? 'about' : next)
    }
  }
  function pointerDown(event) {
    flight = null
    userOrbit = true
    down = { x: event.clientX, y: event.clientY, id: event.pointerId }
    moved = false
  }
  function pointerUp(event) {
    if (
      down &&
      down.id === event.pointerId &&
      !moved &&
      Math.hypot(event.clientX - down.x, event.clientY - down.y) < 6
    ) {
      const place = pick(event)
      if (place === 'character') {
        callbacks.onGreet?.()
        callbacks.onSelect('about')
      } else if (place) callbacks.onSelect(place)
    }
    down = null
  }
  function pointerLeave() {
    hovered = ''
    callbacks.onHover('')
  }
  function pointerCancel() {
    down = null
  }
  function contextLost(event) {
    event.preventDefault()
    contextUnavailable = true
    callbacks.onRecovering?.()
    cancelAnimationFrame(frame)
    clearTimeout(contextTimer)
    // Keep the canvas mounted so the browser can restore its context.
    contextTimer = setTimeout(recoverContext, 2500)
  }
  function recoverContext() {
    if (disposed) return
    // Background tabs may have been suspended by the browser. Rebuild only when
    // visible, so a suspended page cannot consume GPU contexts in a retry loop.
    if (document.hidden) contextTimer = setTimeout(recoverContext, 2500)
    else callbacks.onUnavailable('context-lost')
  }
  function contextRestored() {
    clearTimeout(contextTimer)
    contextUnavailable = false
    resize()
    schedule()
    callbacks.onReady()
  }
  const canvas = renderer.domElement
  canvas.addEventListener('pointermove', pointerMove)
  canvas.addEventListener('pointerdown', pointerDown)
  canvas.addEventListener('pointerup', pointerUp)
  canvas.addEventListener('pointerleave', pointerLeave)
  canvas.addEventListener('pointercancel', pointerCancel)
  canvas.addEventListener('webglcontextlost', contextLost)
  canvas.addEventListener('webglcontextrestored', contextRestored)
  controls.addEventListener('change', render)
  document.addEventListener('visibilitychange', schedule)
  reducedMotion.addEventListener('change', schedule)
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(host)
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting
    schedule()
  })
  observer.observe(host)
  setLighting()
  resize()
  cameraPose(true)
  schedule()
  callbacks.onReady()
  return {
    update(next) {
      const oldView = state.view
      const oldGreeting = state.greeting
      const oldFocus = state.focus
      const oldTour = state.tour
      state = { ...state, ...next }
      if (state.greeting !== oldGreeting) character.wave()
      if (
        oldView !== state.view ||
        oldFocus !== state.focus ||
        oldTour !== state.tour
      )
        setView()
      setLighting()
      if (state.paused || reducedMotion.matches) character.update(time, true)
      schedule()
    },
    dispose() {
      disposed = true
      cancelAnimationFrame(frame)
      clearTimeout(contextTimer)
      resizeObserver.disconnect()
      observer.disconnect()
      document.removeEventListener('visibilitychange', schedule)
      reducedMotion.removeEventListener('change', schedule)
      canvas.removeEventListener('pointermove', pointerMove)
      canvas.removeEventListener('pointerdown', pointerDown)
      canvas.removeEventListener('pointerup', pointerUp)
      canvas.removeEventListener('pointerleave', pointerLeave)
      canvas.removeEventListener('pointercancel', pointerCancel)
      canvas.removeEventListener('webglcontextlost', contextLost)
      canvas.removeEventListener('webglcontextrestored', contextRestored)
      controls.removeEventListener('change', render)
      controls.dispose()
      geometries.forEach(value => value.dispose())
      materials.forEach(value => value.dispose())
      textures.forEach(value => value.dispose())
      sun.shadow.dispose()
      renderer.dispose()
      const gl = renderer.getContext()
      if (!gl.isContextLost() && gl.getExtension('WEBGL_lose_context'))
        renderer.forceContextLoss()
      canvas.remove()
      scene.clear()
    }
  }
}

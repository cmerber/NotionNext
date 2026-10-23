import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { createCharacter } from './createCharacter'

// Original procedural geometry: no remote models, textures, or model service.
export function createStudio(host, initial, callbacks) {
  let renderer
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'low-power'
    })
  } catch (_) {
    callbacks.onUnavailable()
    return { update() {}, dispose() {} }
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
  const materials = new Set()
  const geometries = new Set()
  const textures = new Set()
  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-7, 7, 6, -6, 0.1, 100)
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
  controls.enableDamping = false
  controls.enablePan = false
  controls.minPolarAngle = Math.PI / 5
  controls.maxPolarAngle = Math.PI / 2.65
  controls.minAzimuthAngle = -Math.PI / 6
  controls.maxAzimuthAngle = Math.PI / 2.2
  controls.minZoom = 0.78
  controls.maxZoom = 1.6
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
    mesh(new THREE.BoxGeometry(w, h, d), material, [x, y, z], parent)
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
  box(8.2, 3.4, 0.18, palette.wall, 0, 1.8, -3.12)
  box(0.18, 3.4, 6.3, palette.wall, -4.02, 1.8, 0)
  box(8.25, 0.12, 0.25, palette.darkWood, 0, 3.54, -3.12)
  box(0.25, 0.12, 6.5, palette.darkWood, -4.02, 3.54, 0)
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
  label('TAKE YOUR TIME · STAY A WHILE', 2.9, 0.32, 0, -0.27, 3.42)

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

  function render() {
    if (!disposed && visible && !document.hidden) renderer.render(scene, camera)
  }
  function animate(timestamp) {
    frame = 0
    if (
      disposed ||
      !visible ||
      document.hidden ||
      state.paused ||
      reducedMotion.matches
    )
      return
    // Small screens need fewer pixels and frames, while taps and camera changes
    // still render immediately. Keep vertical swipes and browser pinch zoom free.
    if (compact && previous && timestamp - previous < 1000 / 30) {
      frame = requestAnimationFrame(animate)
      return
    }
    const delta = Math.min((timestamp - (previous || timestamp)) / 1000, 0.05)
    previous = timestamp
    time += delta
    character.update(time, false)
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
    const poses = [
      [8.8, 8.1, 14.5],
      [0.4, 7.8, 16],
      [14, 10, 7]
    ]
    camera.position.set(...poses[state.view % poses.length])
    controls.target.set(0, 1.05, 0)
    controls.update()
  }
  function setLighting() {
    ambient.intensity = state.night ? 1.3 : 2.1
    ambient.color.set(state.night ? '#b4bfde' : '#fff3e4')
    sun.intensity = state.night ? 1.3 : 2.8
    sun.color.set(state.night ? '#b8c8ed' : '#ffead4')
    lampLight.intensity = state.night ? 13 : 2.5
    palette.screen.emissiveIntensity = state.night ? 1 : 0.45
    renderer.toneMappingExposure = state.night ? 1.05 : 1.05
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
    compact = width < 600
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.25 : 1.75))
    const shadowSize = compact ? 512 : 1024
    if (sun.shadow.mapSize.width !== shadowSize) {
      sun.shadow.mapSize.set(shadowSize, shadowSize)
      sun.shadow.map?.dispose()
      sun.shadow.map = null
      sun.shadow.needsUpdate = true
    }
    renderer.setSize(width, height)
    const aspect = width / height
    const span = Math.max(5.2, 6.1 / aspect)
    camera.left = -span * aspect
    camera.right = span * aspect
    camera.top = span
    camera.bottom = -span
    camera.updateProjectionMatrix()
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
    callbacks.onUnavailable()
  }
  const canvas = renderer.domElement
  canvas.addEventListener('pointermove', pointerMove)
  canvas.addEventListener('pointerdown', pointerDown)
  canvas.addEventListener('pointerup', pointerUp)
  canvas.addEventListener('pointerleave', pointerLeave)
  canvas.addEventListener('pointercancel', pointerCancel)
  canvas.addEventListener('webglcontextlost', contextLost)
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
  setView()
  setLighting()
  resize()
  schedule()
  callbacks.onReady()
  return {
    update(next) {
      const oldView = state.view
      const oldGreeting = state.greeting
      state = { ...state, ...next }
      if (state.greeting !== oldGreeting) character.wave()
      if (oldView !== state.view) setView()
      setLighting()
      if (state.paused || reducedMotion.matches) character.update(time, true)
      schedule()
    },
    dispose() {
      disposed = true
      cancelAnimationFrame(frame)
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
      controls.removeEventListener('change', render)
      controls.dispose()
      geometries.forEach(value => value.dispose())
      materials.forEach(value => value.dispose())
      textures.forEach(value => value.dispose())
      sun.shadow.dispose()
      renderer.dispose()
      canvas.remove()
      scene.clear()
    }
  }
}

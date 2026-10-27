import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { createModelKit } from './modelKit'
import { createTerrain } from './terrain'
import { createBuildings } from './buildings'
import { createAnimals } from './animals'
import { createCharacter } from './createCharacter'
import { createWalker } from './walker'
import { batchScene } from './batchScene'
import { getRenderBudget, updateShadowBudget } from './renderBudget'
import { PLACES } from '../places'

export function createIsland(host, initial, callbacks) {
  const disposers = []
  const release = () => {
    while (disposers.length) {
      try {
        disposers.pop()()
      } catch {}
    }
  }
  try {
    return build(host, initial, callbacks, disposers, release)
  } catch (error) {
    release()
    console.warn('[Island] Scene setup failed', error.message)
    callbacks.onUnavailable('initialization')
    return { update() {}, dispose() {} }
  }
}

function build(host, initial, callbacks, disposers, release) {
  const surface = document.createElement('canvas')
  const context = surface.getContext('webgl2', {
    antialias: initial.quality !== 'safe',
    alpha: true,
    powerPreference: 'default'
  })
  if (!context) {
    callbacks.onUnavailable('unsupported')
    return { update() {}, dispose() {} }
  }
  let renderer
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: surface,
      context,
      antialias: initial.quality !== 'safe',
      alpha: true,
      powerPreference: 'default'
    })
  } catch {
    renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
  }
  host.appendChild(renderer.domElement)
  disposers.push(() => {
    renderer.dispose()
    renderer.domElement.remove()
  })
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.03
  renderer.shadowMap.type = THREE.PCFShadowMap
  renderer.shadowMap.autoUpdate = false
  const scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(36, 1, 0.1, 180)
  scene.fog = new THREE.FogExp2('#e7e7d8', 0.009)
  const kit = createModelKit(scene)
  disposers.push(() => kit.dispose())
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.enablePan = false
  controls.enableZoom = false
  controls.minPolarAngle = 0.45
  controls.maxPolarAngle = 1.4
  controls.minDistance = 8
  controls.maxDistance = 90
  controls.touches.ONE = THREE.TOUCH.ROTATE
  controls.touches.TWO = null
  renderer.domElement.style.touchAction = 'pan-y pinch-zoom'
  disposers.push(() => controls.dispose())
  const ambient = new THREE.HemisphereLight('#fff7e5', '#789175', 2.6)
  scene.add(ambient)
  const sun = new THREE.DirectionalLight('#ffedc9', 3)
  sun.position.set(4, 14, 8)
  sun.castShadow = true
  Object.assign(sun.shadow.camera, {
    left: -16,
    right: 16,
    top: 16,
    bottom: -16,
    near: 0.1,
    far: 50
  })
  sun.shadow.bias = -0.0005
  sun.shadow.normalBias = 0.035
  disposers.push(() => sun.shadow.map?.dispose())
  scene.add(sun)
  const rim = new THREE.DirectionalLight('#c9dbed', 1.4)
  rim.position.set(-10, 7, -5)
  scene.add(rim)
  const terrain = createTerrain(kit),
    buildings = createBuildings(kit),
    animals = createAnimals(kit)
  const character = createCharacter(kit),
    walker = createWalker()
  const carrier = kit.group()
  carrier.add(character.root)
  character.root.position.set(0, 0.12, 0)
  character.root.scale.setScalar(0.62)
  character.root.traverse(item => {
    if (item.isMesh) item.castShadow = false
  })
  const cloudMaterial = kit.mat('#fff8e9', {
    transparent: true,
    opacity: 0.74,
    depthWrite: false
  })
  const clouds = []
  for (let i = 0; i < 7; i++) {
    const cloud = kit.group(
      '',
      Math.sin(i * 2.4) * 12,
      -2.2 - (i % 3) * 0.7,
      Math.cos(i * 2.4) * 7
    )
    for (let j = 0; j < 4; j++) {
      const puff = kit.ball(
        1,
        cloudMaterial,
        (j - 1.5) * 0.85,
        Math.sin(j * 2) * 0.2,
        0,
        cloud,
        [1.2, 0.48 + (j % 2) * 0.15, 0.7]
      )
      puff.castShadow = puff.receiveShadow = false
    }
    clouds.push(cloud)
  }
  const glow = kit.mat('#f7d493', {
    emissive: '#ffd995',
    emissiveIntensity: 1.8,
    transparent: true,
    opacity: 0.8,
    depthWrite: false
  })
  const fireflies = kit.group()
  for (let i = 0; i < 24; i++) {
    const dot = kit.ball(
      0.025,
      glow,
      Math.sin(i * 2.4) * 5,
      0.7 + (i % 5) * 0.3,
      Math.cos(i * 2.4) * 4,
      fireflies
    )
    dot.castShadow = false
  }
  const register = g => kit.geometries.add(g)
  const parts = ['head', 'arm-left', 'arm-right', 'leg-left', 'leg-right'].map(
    name => character.root.getObjectByName(name)
  )
  batchScene(character.root, parts, register)
  for (const part of parts)
    batchScene(
      part,
      part.name === 'head'
        ? [part.getObjectByName('eye-left'), part.getObjectByName('eye-right')]
        : [],
      register
    )
  for (const animal of animals.animals)
    batchScene(
      animal.root,
      [
        animal.head,
        animal.legs[0],
        ...animal.legs.slice(1),
        animal.tail,
        animal.body
      ],
      register
    )
  for (const animal of animals.animals)
    for (const part of [animal.head, animal.body, animal.tail, ...animal.legs])
      batchScene(part, [], register)
  for (const bird of animals.birds) batchScene(bird.root, bird.wings, register)
  const stats = batchScene(
    scene,
    [
      carrier,
      ...terrain.moving,
      ...animals.moving,
      ...buildings.doors.map(d => d.pivot),
      fireflies,
      ...clouds
    ],
    register
  )
  for (const cloud of clouds) batchScene(cloud, [], register, true)
  host.dataset.modelBatches = `${stats.before}→${stats.after}`
  const used = new Set()
  scene.traverse(item => {
    if (item.geometry) used.add(item.geometry)
  })
  for (const geometry of kit.geometries)
    if (!used.has(geometry)) {
      geometry.dispose()
      kit.geometries.delete(geometry)
    }
  let state = { ...initial },
    compact = false,
    disposed = false,
    contextLost = false,
    visible = true
  let frame = 0,
    previous = 0,
    time = 0,
    lastTelemetry = 0,
    lastMarkers = 0,
    renderCost = 0,
    slow = 0,
    flight = null,
    down = null,
    hovered = '',
    recoveryTimer
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  const pointer = new THREE.Vector2(),
    ray = new THREE.Raycaster(),
    projected = new THREE.Vector3()
  const markers = PLACES.map(place => ({
    place,
    el: host
      .closest('.island-explore')
      ?.querySelector(`[data-place-marker="${place.id}"]`)
  }))
  const target = new THREE.Vector3(),
    destination = new THREE.Vector3()
  const homes = {
    library: { position: [3, 7, 8], target: [-4.5, 1.3, -1.4] },
    workshop: { position: [9.5, 8, 5.5], target: [1, 1.3, -1.8] },
    observatory: { position: [12.5, 8, 13], target: [3, 1.5, 2.2] },
    home: { position: [2, 7, 13], target: [-4.9, 1.4, 3.3] },
    animals: { position: [-3.8, 4, 8], target: [-9.6, 0.8, -0.6] }
  }
  function moveToFocus(intro = false) {
    const view = homes[state.focus]
    destination.set(
      ...(view?.position || (compact ? [22, 24, 35] : [17, 18, 26]))
    )
    target.set(...(view?.target || (compact ? [-1, 3.5, 0] : [-3.8, -0.8, 0])))
    if (compact && view) destination.sub(target).multiplyScalar(1.4).add(target)
    if (intro) {
      camera.position.copy(destination).multiplyScalar(1.08)
      controls.target.copy(target)
    }
    if (state.paused || reduced.matches) {
      camera.position.copy(destination)
      controls.target.copy(target)
      flight = null
      controls.update()
    } else
      flight = {
        from: camera.position.clone(),
        look: controls.target.clone(),
        age: 0,
        duration: intro ? 1.3 : 1.9
      }
  }
  function lighting() {
    ambient.intensity = state.night ? 1.25 : 2.6
    ambient.color.set(state.night ? '#bdcce6' : '#fff7e5')
    sun.intensity = state.night ? 1.15 : 3
    sun.color.set(state.night ? '#bdd2ed' : '#ffedc9')
    kit.palette.window.emissiveIntensity = state.night ? 2.3 : 0.2
    cloudMaterial.color.set(state.night ? '#71818d' : '#fff8e9')
    fireflies.visible = Boolean(state.night && state.ambience !== false)
    scene.fog.color.set(state.night ? '#344854' : '#e7e7d8')
    renderer.shadowMap.needsUpdate = true
  }
  function render() {
    if (disposed || contextLost) return false
    const start = performance.now()
    try {
      renderer.render(scene, camera)
      renderCost = renderCost * 0.9 + (performance.now() - start) * 0.1
      host.dataset.focus = state.focus || 'island'
      host.dataset.cameraMotion = flight ? 'flying' : 'settled'
      if (start - lastTelemetry > 500) {
        lastTelemetry = start
        host.dataset.drawCalls = renderer.info.render.calls
        host.dataset.triangles = renderer.info.render.triangles
        host.dataset.frameCost = renderCost.toFixed(1)
        host.dataset.hostPosition = `${walker.state.x.toFixed(2)},${walker.state.z.toFixed(2)}`
        host.dataset.hostWalking = String(walker.state.walking)
      }
      if (start - lastMarkers > 65) {
        lastMarkers = start
        for (const { place, el } of markers)
          if (el) {
            projected
              .set(
                place.position[0],
                place.id === 'observatory' ? 4.6 : 3.5,
                place.position[2]
              )
              .project(camera)
            el.style.transform = `translate3d(${((projected.x + 1) * host.clientWidth) / 2}px,${((1 - projected.y) * host.clientHeight) / 2}px,0) translate(-50%,-50%)`
            el.style.visibility =
              projected.z < 1 &&
              Math.abs(projected.x) < 1 &&
              Math.abs(projected.y) < 1 &&
              !state.focus
                ? 'visible'
                : 'hidden'
          }
      }
      if (state.quality !== 'safe' && renderCost > 30) {
        if (++slow === 80) callbacks.onPerformance?.()
      } else slow = 0
      return !renderer.getContext().isContextLost()
    } catch (error) {
      contextLost = true
      callbacks.onUnavailable('render')
      return false
    }
  }
  function animate(timestamp) {
    frame = 0
    if (
      disposed ||
      contextLost ||
      !visible ||
      document.hidden ||
      state.paused ||
      reduced.matches
    )
      return
    if (
      previous &&
      timestamp - previous <
        1000 / (compact || state.quality === 'safe' ? 30 : 40)
    ) {
      frame = requestAnimationFrame(animate)
      return
    }
    const delta = Math.min(0.05, (timestamp - (previous || timestamp)) / 1000)
    previous = timestamp
    time += delta
    if (flight) {
      flight.age += delta
      const t = Math.min(1, flight.age / flight.duration),
        ease = (1 - Math.cos(t * Math.PI)) / 2
      camera.position.lerpVectors(flight.from, destination, ease)
      camera.position.y += Math.sin(t * Math.PI) * 0.8
      controls.target.lerpVectors(flight.look, target, ease)
      if (t === 1) flight = null
    } else if (state.tour && !state.focus) {
      const offset = camera.position.clone().sub(controls.target)
      offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), delta * 0.055)
      camera.position.copy(controls.target).add(offset)
    }
    const walk = walker.update(delta)
    carrier.position.set(walk.x, 0, walk.z)
    character.locomotion(walk.walking ? walk.heading : null, walk.walking)
    character.lookAt(
      0,
      0,
      Math.atan2(camera.position.x - walk.x, camera.position.z - walk.z)
    )
    character.update(time, false)
    terrain.update(time, false)
    animals.update(time, false)
    buildings.doors.forEach(({ pivot, id }) => {
      pivot.rotation.y +=
        ((state.focus === id ? -0.85 : 0) - pivot.rotation.y) * 0.06
    })
    clouds.forEach((cloud, i) => {
      cloud.position.y = -2.2 - (i % 3) * 0.7 + Math.sin(time * 0.2 + i) * 0.12
    })
    fireflies.rotation.y = Math.sin(time * 0.12) * 0.2
    controls.update()
    render()
    frame = requestAnimationFrame(animate)
  }
  function schedule() {
    cancelAnimationFrame(frame)
    frame = 0
    previous = 0
    const shown = render()
    if (
      !disposed &&
      !contextLost &&
      visible &&
      !document.hidden &&
      !state.paused &&
      !reduced.matches
    )
      frame = requestAnimationFrame(animate)
    return shown
  }
  function resize() {
    if (!host.clientWidth || !host.clientHeight) return
    const was = compact
    compact = host.clientWidth < 700
    const budget = getRenderBudget(
      host.clientWidth,
      host.clientHeight,
      window.devicePixelRatio,
      state.quality
    )
    renderer.setPixelRatio(budget.ratio)
    renderer.setSize(host.clientWidth, host.clientHeight)
    updateShadowBudget(renderer, sun, kit.materials, budget)
    camera.aspect = host.clientWidth / host.clientHeight
    camera.fov = compact ? 48 : 36
    camera.updateProjectionMatrix()
    if (was !== compact) moveToFocus()
    schedule()
  }
  function pick(event) {
    const bounds = renderer.domElement.getBoundingClientRect()
    pointer.set(
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      (-(event.clientY - bounds.top) / bounds.height) * 2 + 1
    )
    ray.setFromCamera(pointer, camera)
    for (const hit of ray.intersectObjects(scene.children, true)) {
      let item = hit.object
      while (item) {
        if (item.userData.animal) return 'animals'
        if (item.userData.character) return 'home'
        if (item.userData.place) return item.userData.place
        item = item.parent
      }
      if (!hit.object.material?.transparent) return ''
    }
    return ''
  }
  const pointerDown = event => {
    if (
      event.isPrimary === false ||
      (event.pointerType === 'mouse' && event.button !== 0)
    )
      return
    down = { x: event.clientX, y: event.clientY, id: event.pointerId }
    flight = null
    callbacks.onInteract?.()
  }
  const pointerUp = event => {
    if (down?.id !== event.pointerId) return
    if (Math.hypot(event.clientX - down.x, event.clientY - down.y) < 6) {
      const id = pick(event)
      if (id) callbacks.onSelect(id)
    }
    down = null
  }
  const pointerMove = event => {
    const id = pick(event)
    if (id !== hovered) {
      hovered = id
      host.style.cursor = id ? 'pointer' : 'grab'
      callbacks.onHover?.(id)
    }
  }
  const cancel = () => {
    down = null
  }
  const contextDeadline = () => {
    clearTimeout(recoveryTimer)
    if (contextLost && !document.hidden)
      recoveryTimer = setTimeout(() => {
        if (!disposed && contextLost && !document.hidden)
          callbacks.onUnavailable('context-lost')
      }, 2500)
  }
  const lost = event => {
    event.preventDefault()
    contextLost = true
    cancelAnimationFrame(frame)
    contextDeadline()
  }
  const restored = () => {
    clearTimeout(recoveryTimer)
    contextLost = false
    resize()
    if (schedule()) callbacks.onReady()
  }
  const canvas = renderer.domElement
  for (const [name, listener] of [
    ['pointerdown', pointerDown],
    ['pointerup', pointerUp],
    ['pointermove', pointerMove],
    ['pointercancel', cancel],
    ['pointerleave', cancel],
    ['webglcontextlost', lost],
    ['webglcontextrestored', restored]
  ]) {
    canvas.addEventListener(name, listener)
    disposers.push(() => canvas.removeEventListener(name, listener))
  }
  const change = () => {
    if (state.paused || reduced.matches) render()
  }
  controls.addEventListener('change', change)
  const visibility = () => {
    contextDeadline()
    schedule()
  }
  document.addEventListener('visibilitychange', visibility)
  reduced.addEventListener('change', schedule)
  disposers.push(() => {
    controls.removeEventListener('change', change)
    document.removeEventListener('visibilitychange', visibility)
    reduced.removeEventListener('change', schedule)
    cancelAnimationFrame(frame)
    clearTimeout(recoveryTimer)
  })
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(host)
  const visibilityObserver = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting
    schedule()
  })
  visibilityObserver.observe(host)
  disposers.push(() => {
    resizeObserver.disconnect()
    visibilityObserver.disconnect()
    scene.clear()
  })
  lighting()
  resize()
  moveToFocus(true)
  if (schedule()) callbacks.onReady()
  return {
    update(next) {
      if (disposed) return
      const previousState = state
      state = { ...state, ...next }
      if (state.focus !== previousState.focus) {
        if (state.focus && state.focus !== 'animals') walker.select(state.focus)
        else walker.release()
        if (state.focus === 'animals') animals.greet()
        character.wave()
        moveToFocus()
      }
      if (state.reset !== previousState.reset) moveToFocus()
      if (
        state.zoom !== previousState.zoom &&
        state.focus === previousState.focus &&
        state.reset === previousState.reset
      ) {
        flight = null
        camera.position
          .sub(controls.target)
          .multiplyScalar(0.84 ** (state.zoom - previousState.zoom))
          .add(controls.target)
        controls.update()
      }
      if (
        state.night !== previousState.night ||
        state.ambience !== previousState.ambience
      )
        lighting()
      if (state.quality !== previousState.quality) resize()
      if (state.paused || reduced.matches) {
        walker.update(0, true)
        character.update(time, true)
        animals.update(time, true)
        terrain.update(time, true)
      }
      schedule()
    },
    dispose() {
      if (disposed) return
      disposed = true
      release()
    }
  }
}

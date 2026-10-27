import * as THREE from 'three'

export function createBuildings(kit) {
  const { group, mesh, box, ball, cylinder, line, palette: p } = kit
  const doors = []
  const window = (root, x, y, z, w = 0.65, h = 0.9) => {
    box(w + 0.14, h + 0.14, 0.1, p.darkWood, x, y, z, root)
    box(w, h, 0.11, p.window, x, y, z + 0.03, root)
    box(0.045, h, 0.13, p.cream, x, y, z + 0.07, root)
    box(w, 0.045, 0.13, p.cream, x, y, z + 0.07, root)
    box(w + 0.3, 0.1, 0.3, p.wood, x, y - h / 2 - 0.1, z + 0.08, root)
  }
  const door = (root, z, height = 1.45) => {
    box(0.92, height + 0.12, 0.12, p.cream, 0, height / 2, z, root)
    const pivot = group('', -0.38, 0, z + 0.08, root)
    box(0.76, height, 0.07, p.roof, 0.38, height / 2, 0, pivot)
    ball(0.045, p.brass, 0.65, height * 0.5, 0.07, pivot)
    box(0.4, 0.42, 0.09, p.window, 0.38, height * 0.78, 0, pivot)
    doors.push({ pivot, id: root.userData.place })
    for (let i = 0; i < 3; i++)
      box(
        1.2 + i * 0.18,
        0.13,
        0.32,
        p.stone,
        0,
        0.25 - i * 0.1,
        z + 0.16 + i * 0.26,
        root
      )
  }
  const roof = (root, w, d, y, h, material = p.roof) => {
    const shape = new THREE.Shape()
    shape.moveTo(-w / 2, 0)
    shape.lineTo(0, h)
    shape.lineTo(w / 2, 0)
    shape.lineTo(-w / 2, 0)
    mesh(
      new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: false }),
      material,
      [0, y, -d / 2],
      root
    )
    const slope = Math.atan2(h, w / 2),
      length = Math.hypot(h, w / 2)
    for (const side of [-1, 1])
      for (let row = 0; row < 6; row++)
        for (let col = 0; col < 8; col++) {
          const fraction = (row + 0.5) / 6
          const tile = box(
            length / 6 + 0.05,
            0.045,
            d / 8 + 0.035,
            (row + col) % 5 === 0 ? p.roofLight : material,
            (side * fraction * w) / 2,
            y + h * (1 - fraction) + 0.025,
            -d / 2 + ((col + 0.5) * d) / 8,
            root
          )
          tile.rotation.z = -side * slope
        }
    box(0.12, 0.12, d + 0.14, p.brass, 0, y + h, 0, root)
  }
  const plants = (root, x, z) => {
    cylinder(0.22, 0.16, 0.35, p.terracotta, x, 0.2, z, root)
    for (let i = 0; i < 5; i++)
      ball(
        0.2,
        p.leafLight,
        x + Math.sin(i * 2) * 0.15,
        0.52 + (i % 2) * 0.12,
        z + Math.cos(i * 2) * 0.12,
        root,
        [0.7, 1.4, 0.7]
      )
  }
  const library = group('library', -3.4, 0.02, -2)
  box(2.65, 2.7, 2.15, p.plaster, 0, 1.4, 0, library)
  box(2.85, 0.2, 2.32, p.stone, 0, 0.13, 0, library)
  roof(library, 3.05, 2.65, 2.78, 1.25)
  for (const x of [-1.23, 1.23])
    box(0.12, 2.65, 2.25, p.wood, x, 1.45, 0, library)
  box(2.7, 0.12, 2.25, p.wood, 0, 1.9, 0, library)
  door(library, 1.12)
  window(library, -0.87, 1.25, 1.12, 0.48, 0.8)
  window(library, 0.87, 1.25, 1.12, 0.48, 0.8)
  window(library, 0, 2.3, 1.13, 0.7, 0.44)
  box(1.7, 0.35, 0.1, p.darkWood, 0, 1.8, 1.2, library)
  for (let i = 0; i < 7; i++)
    box(
      0.09,
      0.18 + (i % 3) * 0.035,
      0.09,
      i % 2 ? p.brass : p.cream,
      -0.55 + i * 0.18,
      1.8,
      1.28,
      library
    )
  // A tiny annex and chimney break the silhouette into crafted pieces.
  box(0.65, 1.1, 0.65, p.plaster, 0.85, 3.05, -0.5, library)
  box(0.85, 0.14, 0.82, p.terracotta, 0.85, 3.65, -0.5, library)
  plants(library, -1.6, 1.3)
  const home = group('home', -3.4, 0.02, 3.1)
  box(2.6, 2.15, 2.05, p.plaster, 0, 1.12, 0, home)
  box(2.9, 0.18, 2.3, p.stone, 0, 0.12, 0, home)
  roof(home, 3.1, 2.6, 2.2, 1.2, p.terracotta)
  door(home, 1.08)
  window(home, -0.88, 1.3, 1.08, 0.48, 0.7)
  window(home, 0.88, 1.3, 1.08, 0.48, 0.7)
  const roundWindow = cylinder(0.3, 0.3, 0.09, p.window, 0, 2.65, 1.22, home)
  roundWindow.rotation.x = Math.PI / 2
  for (const x of [-1.2, 1.2]) box(0.08, 2.1, 0.09, p.wood, x, 1.15, 1.1, home)
  box(1.6, 0.12, 0.7, p.roof, 0, 1.8, 1.43, home)
  for (const x of [-0.85, 0.85])
    cylinder(0.035, 0.035, 1.75, p.wood, x, 0.9, 1.7, home)
  plants(home, -1.5, 1.55)
  plants(home, 1.5, 1.55)
  // A lantern on each porch stays warm in the evening.
  for (const root of [home, library]) {
    line(
      [
        [-0.6, 1.9, 1.15],
        [-0.6, 2.1, 1.35],
        [-0.6, 1.9, 1.4]
      ],
      0.025,
      p.darkWood,
      root
    )
    box(0.18, 0.24, 0.17, p.window, -0.6, 1.76, 1.4, root)
  }
  const workshop = group('workshop', 2.6, 0.02, -2.3)
  box(3.1, 0.32, 2.35, p.stone, 0, 0.18, 0, workshop)
  box(3, 1.85, 2.25, p.glass, 0, 1.25, 0, workshop)
  for (const x of [-1.5, -0.75, 0, 0.75, 1.5]) {
    for (const z of [-1.14, 1.14])
      box(0.065, 1.95, 0.07, p.roof, x, 1.3, z, workshop)
    for (const side of [-1, 1])
      line(
        [
          [x, 2.28, side * 1.15],
          [x, 3.05, 0]
        ],
        0.04,
        p.roof,
        workshop
      )
  }
  for (const y of [0.4, 1.1, 2.24])
    for (const z of [-1.15, 1.15])
      box(3.15, 0.07, 0.07, p.roof, 0, y, z, workshop)
  const glassRoof = side => {
    const pane = box(3, 0.035, 1.37, p.glass, 0, 2.67, side * 0.57, workshop)
    pane.rotation.x = side * Math.atan2(0.77, 1.15)
  }
  glassRoof(-1)
  glassRoof(1)
  box(3.2, 0.08, 0.08, p.brass, 0, 3.08, 0, workshop)
  door(workshop, 1.18, 1.65)
  box(1.9, 0.12, 0.7, p.wood, 0, 1.05, -0.4, workshop)
  for (const x of [-0.8, 0.8]) box(0.1, 1, 0.1, p.wood, x, 0.55, -0.4, workshop)
  box(0.85, 0.55, 0.09, p.ink, 0, 1.43, -0.57, workshop)
  box(0.72, 0.42, 0.1, p.window, 0, 1.43, -0.51, workshop)
  for (let i = 0; i < 6; i++)
    box(
      0.12,
      0.3 + (i % 2) * 0.08,
      0.24,
      i % 2 ? p.terracotta : p.cream,
      -1.25 + i * 0.14,
      0.6,
      -0.8,
      workshop
    )
  plants(workshop, 1.1, -0.65)
  plants(workshop, -1.65, 0.5)
  const observatory = group('observatory', 4.7, 0.02, 2.2)
  cylinder(1.05, 1.15, 3.15, p.plaster, 0, 1.62, 0, observatory, 32)
  for (const y of [0.15, 1.15, 2.15, 3.15])
    cylinder(1.12, 1.12, 0.12, p.wood, 0, y, 0, observatory, 32)
  const dome = mesh(
    new THREE.SphereGeometry(1.2, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2),
    p.roof,
    [0, 3.25, 0],
    observatory
  )
  dome.scale.y = 0.82
  for (const angle of [-0.8, 0, 0.8]) {
    const pivot = group('', 0, 0, 0, observatory)
    pivot.rotation.y = angle
    window(pivot, 0, 2.45, 1.03, 0.43, 0.7)
  }
  door(observatory, 1.12, 1.45)
  const telescope = group('', 0, 3.6, 0.65, observatory)
  telescope.rotation.x = -0.5
  const scope = cylinder(0.14, 0.18, 1.1, p.brass, 0, 0, 0, telescope)
  scope.rotation.x = Math.PI / 2
  const lens = cylinder(0.16, 0.16, 0.07, p.ink, 0, 0, 0.56, telescope)
  lens.rotation.x = Math.PI / 2
  for (let i = 0; i < 10; i++) {
    const angle = i * 0.27 - 2.9
    const step = box(
      0.56,
      0.14,
      0.32,
      p.stone,
      Math.sin(angle) * 1.23,
      0.13 + i * 0.12,
      Math.cos(angle) * 1.23,
      observatory
    )
    step.rotation.y = angle
  }
  return { roots: [library, workshop, observatory, home], doors }
}

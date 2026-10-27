import * as THREE from 'three'

export function createAnimals(kit) {
  const { group, box, ball, cylinder, mesh, mat, palette: p } = kit
  const pink = mat('#d19d88'),
    black = mat('#3d3830'),
    wool = mat('#e9e3d1'),
    fur = mat('#c5a27c'),
    cream = mat('#f4ead5')
  const animals = []
  for (let at = 0; at < 4; at++) {
    const cat = at < 2,
      root = group()
    root.name = `island-${cat ? 'cat' : 'sheep'}-${at}`
    root.userData.animal = cat ? 'cat' : 'sheep'
    const body = group('', 0, 0, 0, root),
      coat = cat ? (at ? cream : fur) : wool
    ball(cat ? 0.25 : 0.36, coat, 0, cat ? 0.37 : 0.55, 0, body, [
      1,
      cat ? 0.95 : 1,
      1.65
    ])
    if (!cat)
      for (let i = 0; i < 15; i++)
        ball(
          0.17,
          wool,
          Math.sin(i * 2.4) * 0.29,
          0.48 + (i % 3) * 0.12,
          Math.cos(i * 2.4) * 0.38,
          body
        )
    const head = group('', 0, cat ? 0.64 : 0.75, cat ? 0.34 : 0.4, root)
    ball(
      cat ? 0.23 : 0.19,
      cat ? coat : p.darkWood,
      0,
      0,
      0,
      head,
      [1, 0.9, 0.95]
    )
    for (const side of [-1, 1]) {
      if (cat) {
        const ear = mesh(
          new THREE.ConeGeometry(0.12, 0.25, 3),
          coat,
          [side * 0.145, 0.19, -0.015],
          head
        )
        ear.rotation.z = side * -0.12
        mesh(
          new THREE.ConeGeometry(0.065, 0.16, 3),
          pink,
          [side * 0.145, 0.19, 0.04],
          head
        )
        ball(0.055, cream, side * 0.07, -0.07, 0.18, head)
      } else ball(0.09, p.darkWood, side * 0.2, 0.01, 0, head, [1.6, 0.6, 1])
      ball(
        cat ? 0.034 : 0.028,
        black,
        side * 0.09,
        0.025,
        cat ? 0.205 : 0.15,
        head
      )
      ball(0.009, cream, side * 0.09 + 0.009, 0.035, cat ? 0.233 : 0.175, head)
      if (cat)
        for (const y of [-0.04, 0.01]) {
          const whisker = box(
            0.14,
            0.008,
            0.008,
            cream,
            side * 0.23,
            y,
            0.18,
            head
          )
          whisker.rotation.z = side * 0.1
        }
    }
    ball(0.035, pink, 0, -0.045, cat ? 0.22 : 0.185, head, [1, 0.7, 0.5])
    const legs = []
    for (const x of [-0.14, 0.14])
      for (const z of [-0.23, 0.23]) {
        const leg = group('', x, cat ? 0.28 : 0.42, z, root)
        cylinder(
          0.055,
          0.055,
          cat ? 0.23 : 0.34,
          cat ? coat : p.darkWood,
          0,
          cat ? -0.1 : -0.16,
          0,
          leg,
          8
        )
        ball(
          0.07,
          cat ? cream : black,
          0,
          cat ? -0.2 : -0.31,
          0.02,
          leg,
          [1, 0.5, 1.25]
        )
        legs.push(leg)
      }
    const tail = group('', 0, cat ? 0.55 : 0.6, -0.42, root)
    for (let i = 0; i < (cat ? 6 : 2); i++)
      ball(
        cat ? 0.055 : 0.08,
        coat,
        Math.sin(i * 0.25) * 0.1,
        i * (cat ? 0.09 : 0.05),
        -i * 0.05,
        tail
      )
    root.traverse(item => {
      if (item.isMesh) item.castShadow = false
    })
    animals.push({ root, body, head, legs, tail, at, cat })
  }
  const birds = []
  for (let at = 0; at < 3; at++) {
    const root = group(),
      wings = []
    ball(0.08, p.cream, 0, 0, 0, root, [0.8, 1, 1.8])
    for (const side of [-1, 1]) {
      const wing = group('', side * 0.04, 0.01, 0, root)
      const feather = ball(
        0.16,
        p.cream,
        side * 0.12,
        0,
        0,
        wing,
        [1.8, 0.2, 0.7]
      )
      feather.castShadow = false
      wings.push(wing)
    }
    birds.push({ root, wings, at })
  }
  let greetAt = -100,
    lastTime = 0
  function update(nextTime, quiet = false) {
    if (!quiet) lastTime = nextTime
    const time = lastTime,
      reaction = Math.max(0, 1 - (time - greetAt) / 2.5)
    animals.forEach(({ root, body, head, legs, tail, at, cat }) => {
      const a = time * (cat ? 0.065 : 0.035) + at * 1.6
      // Meadows and the orchard stay clear of the four buildings.
      if (cat) {
        root.position.set(
          -9.6 + Math.cos(a) * 0.75,
          -0.12,
          -0.5 + Math.sin(a) * 1.15
        )
        root.rotation.y = Math.atan2(-Math.sin(a) * 0.75, Math.cos(a) * 1.15)
      } else {
        root.position.set(
          -0.4 + (at - 2) * 0.6 + Math.cos(a) * 0.35,
          0.02,
          -2.8 + Math.sin(a) * 0.6
        )
        root.rotation.y = Math.atan2(-Math.sin(a), Math.cos(a))
      }
      root.position.y += quiet ? 0 : Math.sin(time * 5 + at) * 0.015
      legs.forEach((leg, i) => {
        leg.rotation.x = quiet
          ? 0
          : Math.sin(time * (cat ? 6 : 4) + (i % 3) * Math.PI) * 0.4
      })
      tail.rotation.z = quiet ? 0 : Math.sin(time * 2 + at) * 0.18
      head.rotation.y = quiet ? 0 : Math.sin(time * 0.8 + at) * 0.18
      body.position.y = quiet
        ? 0
        : reaction * Math.sin((time - greetAt) * Math.PI * 3) * 0.05
    })
    birds.forEach(({ root, wings, at }) => {
      const a = time * 0.11 + at * 2
      root.position.set(
        Math.cos(a) * 8,
        6 + Math.sin(a * 2) * 0.5,
        Math.sin(a) * 4
      )
      root.rotation.y = -a
      wings.forEach((wing, side) => {
        wing.rotation.z = quiet
          ? 0
          : Math.sin(time * 5 + at) * (side ? -0.5 : 0.5)
      })
    })
  }
  update(0, true)
  return {
    animals,
    birds,
    moving: [...animals.map(a => a.root), ...birds.map(b => b.root)],
    update,
    greet() {
      greetAt = lastTime
    }
  }
}

import { WALK_ROUTES } from '../places.js'

export function createWalker() {
  const nodes = new Map(),
    edges = new Map(),
    targets = {}
  const key = p => p.join(',')
  for (const [id, path] of Object.entries(WALK_ROUTES)) {
    for (let i = 0; i < path.length; i++) {
      const a = key(path[i])
      nodes.set(a, path[i])
      if (!edges.has(a)) edges.set(a, new Set())
      if (i) {
        const b = key(path[i - 1])
        edges.get(a).add(b)
        edges.get(b).add(a)
      }
    }
    targets[id] = key(path[path.length - 1])
  }
  const state = {
    x: 0,
    z: 0.6,
    heading: 0,
    walking: false,
    destination: 'home'
  }
  let from = '0,0.6',
    to = from,
    queue = [],
    rest = 3,
    manual = false,
    idle = 0
  function select(id, user = true) {
    if (!targets[id]) return
    const start = [from, to].sort(
      (a, b) =>
        Math.hypot(state.x - nodes.get(a)[0], state.z - nodes.get(a)[1]) -
        Math.hypot(state.x - nodes.get(b)[0], state.z - nodes.get(b)[1])
    )[0]
    const search = [[start]],
      seen = new Set([start])
    let route = [start]
    while (search.length) {
      const path = search.shift(),
        last = path[path.length - 1]
      if (last === targets[id]) {
        route = path
        break
      }
      for (const next of edges.get(last))
        if (!seen.has(next)) {
          seen.add(next)
          search.push([...path, next])
        }
    }
    queue = route
    to = queue.shift()
    manual = user
    rest = 0
    state.destination = id
  }
  return {
    state,
    select,
    release() {
      manual = false
      rest = 4
    },
    update(delta, quiet = false) {
      if (quiet) {
        state.walking = false
        return state
      }
      let remaining = delta * 0.85
      state.walking = false
      while (remaining > 0) {
        const [x, z] = nodes.get(to),
          dx = x - state.x,
          dz = z - state.z,
          distance = Math.hypot(dx, dz)
        if (distance > 0.002) {
          const step = Math.min(distance, remaining)
          state.x += (dx / distance) * step
          state.z += (dz / distance) * step
          state.heading = Math.atan2(dx, dz)
          state.walking = true
          remaining -= step
          if (step < distance) break
        }
        from = to
        if (queue.length) to = queue.shift()
        else {
          rest += delta
          if (!manual && rest > 4)
            select(
              ['library', 'workshop', 'observatory', 'home'][idle++ % 4],
              false
            )
          break
        }
      }
      return state
    }
  }
}

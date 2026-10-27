// The graph follows open aisles, keeping the host out of the desk, chair,
// coffee table and sofa. Retargeting finishes along the current safe edge.
export const WALK_STATIONS = {
  about: [0.15, 2.03],
  foyer: [0.25, 1.6],
  aisle: [-0.55, 0.1],
  turn: [-0.85, -1.1],
  journal: [-2.35, -1.25],
  tools: [0.5, -0.4],
  profile: [2.15, 1.95]
}
const edges = {
  about: ['foyer'],
  foyer: ['about', 'aisle', 'profile'],
  aisle: ['foyer', 'turn', 'tools'],
  turn: ['aisle', 'journal'],
  journal: ['turn'],
  tools: ['aisle'],
  profile: ['foyer']
}
const order = ['journal', 'tools', 'profile', 'about']
export function createHostWalk() {
  const state = {
    x: 0.15,
    z: 2.03,
    heading: 0.3,
    walking: false,
    destination: 'about'
  }
  let reached = 'about',
    queue = [],
    idle = 3,
    manual = false,
    stop = 0
  const distance = id =>
    Math.hypot(state.x - WALK_STATIONS[id][0], state.z - WALK_STATIONS[id][1])
  const route = (from, to) => {
    const paths = [[from]],
      visited = new Set([from])
    while (paths.length) {
      const path = paths.shift(),
        tail = path[path.length - 1]
      if (tail === to) return path
      for (const neighbor of edges[tail])
        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          paths.push([...path, neighbor])
        }
    }
    return [from]
  }
  const go = destination => {
    if (!order.includes(destination)) return
    const anchor =
      queue.length && distance(queue[0]) < distance(reached)
        ? queue[0]
        : reached
    queue = route(anchor, destination)
    if (distance(anchor) < 0.001) queue.shift()
    state.destination = destination
    idle = 6
  }
  return {
    state,
    select(place) {
      manual = true
      go(place)
    },
    release() {
      manual = false
      idle = 4
    },
    update(delta, quiet = false) {
      if (quiet) {
        state.walking = false
        return state
      }
      let remaining = Math.max(0, Math.min(delta, 0.1)) * 0.95
      state.walking = queue.length > 0
      while (queue.length && remaining > 0) {
        const next = queue[0],
          [x, z] = WALK_STATIONS[next]
        const length = distance(next)
        if (length > 0.001) state.heading = Math.atan2(x - state.x, z - state.z)
        if (length <= remaining) {
          state.x = x
          state.z = z
          reached = queue.shift()
          remaining -= length
        } else {
          state.x += ((x - state.x) / length) * remaining
          state.z += ((z - state.z) / length) * remaining
          remaining = 0
        }
      }
      if (!queue.length) {
        state.walking = false
        if (['journal', 'tools'].includes(state.destination))
          state.heading = Math.PI
        if (!manual) {
          idle -= delta
          if (idle <= 0) {
            let next = order[stop++ % order.length]
            if (next === state.destination) next = order[stop++ % order.length]
            go(next)
            state.walking = queue.length > 0
          }
        }
      }
      return state
    }
  }
}

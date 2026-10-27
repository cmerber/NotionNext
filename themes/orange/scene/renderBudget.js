// Bound drawing-buffer memory by total pixels as well as device pixel ratio.
export function getRenderBudget(
  width,
  height,
  deviceRatio = 1,
  quality = 'auto'
) {
  const compact = width < 600
  const pixelLimit = compact
    ? quality === 'safe'
      ? 800000
      : quality === 'detail'
        ? 2000000
        : 1150000
    : quality === 'safe'
      ? 2200000
      : quality === 'detail'
        ? 8500000
        : 5200000
  const dimensionLimit =
    quality === 'safe' ? 2560 : quality === 'detail' ? 5120 : 4096
  const area = Math.max(1, width) * Math.max(1, height)
  const ratio = Math.min(
    deviceRatio || 1,
    quality === 'safe' ? 1 : quality === 'detail' ? 2 : 1.5,
    Math.sqrt(pixelLimit / area),
    dimensionLimit / Math.max(1, width, height)
  )
  return {
    ratio,
    shadows: quality !== 'safe' && !compact,
    shadowSize: compact ? 512 : 1024
  }
}

// Changing the shadow feature requires new material programs. Keep the cached
// target alive when disabling shadows; resize it only when it is used again.
export function updateShadowBudget(renderer, light, materials, budget) {
  if (renderer.shadowMap.enabled !== budget.shadows) {
    renderer.shadowMap.enabled = budget.shadows
    materials.forEach(material => {
      material.needsUpdate = true
    })
  }
  if (budget.shadows && light.shadow.mapSize.width !== budget.shadowSize) {
    light.shadow.mapSize.set(budget.shadowSize, budget.shadowSize)
    light.shadow.map?.dispose()
    light.shadow.map = null
    light.shadow.needsUpdate = true
  }
  renderer.shadowMap.needsUpdate = true
}

// Bound drawing-buffer memory by total pixels as well as device pixel ratio.
export function getRenderBudget(
  width,
  height,
  deviceRatio = 1,
  quality = 'auto'
) {
  const compact = width < 600
  const pixelLimit = quality === 'safe' ? 900000 : compact ? 1000000 : 2200000
  const dimensionLimit = quality === 'safe' ? 1600 : 2400
  const area = Math.max(1, width) * Math.max(1, height)
  const ratio = Math.min(
    deviceRatio || 1,
    quality === 'safe' ? 1 : compact ? 1.25 : 1.5,
    Math.sqrt(pixelLimit / area),
    dimensionLimit / Math.max(1, width, height)
  )
  return {
    ratio,
    shadows: quality !== 'safe',
    shadowSize: compact ? 512 : 1024
  }
}

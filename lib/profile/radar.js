// All axes share an explicit XP scale. Levels and earned XP never depend on it.
export function radarScale(values) {
  const maximum = Math.max(0, ...values.filter(Number.isFinite))
  const magnitude = 10 ** Math.floor(Math.log10(Math.max(100, maximum)))
  const step = [1, 1.5, 2, 3, 5, 10].find(value => value * magnitude >= maximum)
  return Math.max(100, step * magnitude)
}

export function radarRatio(value, scale) {
  return Math.max(0, Math.min(1, (Number(value) || 0) / scale))
}

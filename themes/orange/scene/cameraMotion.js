// Smooth dolly path with a small lateral arc; endpoints stay exact.
export function sampleCameraFlight(start, end, progress, lift, side, out) {
  const p = Math.max(0, Math.min(1, progress))
  const ease = p * p * p * (p * (p * 6 - 15) + 10)
  const arc = Math.sin(ease * Math.PI)
  out[0] = start[0] + (end[0] - start[0]) * ease + side * arc
  out[1] = start[1] + (end[1] - start[1]) * ease + lift * arc
  out[2] = start[2] + (end[2] - start[2]) * ease - side * arc * 0.45
  return ease
}

// Bounded energy for pooled rings, sparks and furniture reactions.
export function reactionEnvelope(age) {
  if (age < 0 || age >= 2.4) return 0
  return (
    Math.sin((Math.min(1, age / 0.18) * Math.PI) / 2) *
    Math.pow(1 - age / 2.4, 2)
  )
}

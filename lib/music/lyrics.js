// LRC supports multiple timestamps per line, metadata and the millisecond offset.
export function parseLrc(text = '') {
  const offset =
    Number(String(text).match(/\[offset:([+-]?\d+)\]/i)?.[1] || 0) / 1000
  return String(text)
    .split(/\r?\n/)
    .flatMap(line => {
      const stamps = [
        ...line.matchAll(/\[(\d+):([0-5]?\d)(?:[.:](\d{1,3}))?\]/g)
      ]
      const words = line.replace(/\[[^\]]*\]/g, '').trim()
      if (!words) return []
      return stamps.map(match => ({
        time: Math.max(
          0,
          Number(match[1]) * 60 +
            Number(match[2]) +
            Number(`0.${match[3] || '0'}`) -
            offset
        ),
        text: words
      }))
    })
    .sort((a, b) => a.time - b.time)
}

export function activeLyricIndex(lines, time) {
  let low = 0
  let high = lines.length - 1
  let result = -1
  while (low <= high) {
    const middle = (low + high) >> 1
    if (lines[middle].time <= time) {
      result = middle
      low = middle + 1
    } else high = middle - 1
  }
  return result
}

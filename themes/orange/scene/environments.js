export const ENVIRONMENTS = [
  { id: 'sunny', name: '晴天小岛', icon: '☀', note: '风轻轻，日子慢慢。' },
  { id: 'rain', name: '听雨小岛', icon: '☂', note: '雨落窗外，屋里有光。' },
  { id: 'snow', name: '落雪小岛', icon: '❄', note: '等一场雪，藏一屋暖。' },
  { id: 'desert', name: '沙漠绿洲', icon: '◒', note: '沙海很远，小岛很近。' }
]

export function normalizeEnvironment(value) {
  return ENVIRONMENTS.some(item => item.id === value) ? value : 'sunny'
}

// Shared by the renderer and its resource tests. All modes reuse one renderer.
export function environmentPalette(value, night = false) {
  const mode = normalizeEnvironment(value)
  const colors = {
    sunny: ['#e3e5db', '#344652', '#a6b69c', '#b6beb0', '#fff5e7'],
    rain: ['#9aafb7', '#233842', '#7c998b', '#83998e', '#b1c1c5'],
    snow: ['#e3edf0', '#35465e', '#f1f2e9', '#cad6dc', '#f4f6f5'],
    desert: ['#ead0a1', '#534356', '#d8b47d', '#b99c79', '#f5d9af']
  }[mode]
  return {
    mode,
    fog: colors[night ? 1 : 0],
    moss: colors[2],
    stone: colors[3],
    cloud: night ? (mode === 'desert' ? '#756274' : '#657987') : colors[4],
    fogDensity: mode === 'rain' ? 0.022 : mode === 'desert' ? 0.018 : 0.015,
    sun: night ? 1.3 : mode === 'rain' ? 1.4 : mode === 'snow' ? 2.3 : 2.8,
    ambient: night ? 1.3 : mode === 'rain' ? 1.9 : 2.1,
    sunColor: night
      ? '#b8c8ed'
      : mode === 'rain'
        ? '#cfdfec'
        : mode === 'desert'
          ? '#ffd19a'
          : '#ffead4',
    ambientColor: night
      ? '#b4bfde'
      : mode === 'rain'
        ? '#dbe8f0'
        : mode === 'snow'
          ? '#e9f2ff'
          : '#fff3e4'
  }
}

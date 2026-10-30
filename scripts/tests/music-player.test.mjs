import assert from 'node:assert/strict'
import { test } from 'node:test'
import { copyText, lyricScrollTop, shareUrl } from '../../lib/music/player.js'

test('active lyric is centered using the visible scroll box, regardless of offset parent', () => {
  const box = {
    scrollTop: 567,
    clientHeight: 150,
    offsetTop: 212,
    getBoundingClientRect: () => ({ top: 499 })
  }
  const line = {
    offsetTop: 836,
    getBoundingClientRect: () => ({ top: 768, height: 35.5 })
  }
  const target = lyricScrollTop(box, line)
  assert.equal(target, 778.75)
  const lineCenterAfterScroll = 768 - (target - box.scrollTop) + 35.5 / 2
  assert.equal(lineCenterAfterScroll, 499 + 150 / 2)
  assert.equal(
    lyricScrollTop(
      { ...box, scrollTop: 0 },
      { getBoundingClientRect: () => ({ top: 500, height: 20 }) }
    ),
    0
  )
})

test('sharing selects the current song page or verified QQ song URL', () => {
  const track = {
    id: 'wan-dian',
    platforms: [{ url: 'https://y.qq.com/n/ryqq_v2/songDetail/001OS3sp1TNUVg' }]
  }
  assert.equal(
    shareUrl(track, 'site', 'https://qcode.im'),
    'https://qcode.im/music#wan-dian'
  )
  assert.equal(
    shareUrl(track, 'qq', 'https://qcode.im'),
    track.platforms[0].url
  )
  assert.equal(
    shareUrl(
      { id: 'two', platforms: [{ url: 'javascript:alert(1)' }] },
      'qq',
      'https://qcode.im'
    ),
    'https://qcode.im/music#two'
  )
})

test('copying writes directly to clipboard and falls back when permission is rejected', async () => {
  const previousNavigator = Object.getOwnPropertyDescriptor(
    globalThis,
    'navigator'
  )
  const previousDocument = Object.getOwnPropertyDescriptor(
    globalThis,
    'document'
  )
  const copied = []
  let systemShareCalls = 0
  let removed = false
  let focused = false
  let selected = false
  const field = {
    value: '',
    style: {},
    setAttribute() {},
    focus() {},
    select() {
      selected = true
    },
    setSelectionRange() {},
    remove() {
      removed = true
    }
  }
  try {
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: {
        clipboard: { writeText: async text => copied.push(text) },
        share: () => {
          systemShareCalls++
        }
      }
    })
    await copyText('https://qcode.im/music#wan-dian')
    assert.deepEqual(copied, ['https://qcode.im/music#wan-dian'])
    assert.equal(systemShareCalls, 0)
    navigator.clipboard.writeText = async () => {
      throw Error('permission denied')
    }
    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: {
        activeElement: {
          focus() {
            focused = true
          }
        },
        createElement: () => field,
        body: { appendChild() {} },
        execCommand: command => command === 'copy'
      }
    })
    await copyText('https://y.qq.com/n/ryqq_v2/songDetail/song')
    assert.equal(field.value, 'https://y.qq.com/n/ryqq_v2/songDetail/song')
    assert.ok(selected && removed && focused)
    document.execCommand = () => false
    await assert.rejects(copyText('link'), /Clipboard unavailable/)
  } finally {
    if (previousNavigator)
      Object.defineProperty(globalThis, 'navigator', previousNavigator)
    else delete globalThis.navigator
    if (previousDocument)
      Object.defineProperty(globalThis, 'document', previousDocument)
    else delete globalThis.document
  }
})

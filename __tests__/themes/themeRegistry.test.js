/** @jest-environment node */
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { writeThemeRegistry } = require('../../lib/build/themeRegistry')

test('new themes get literal chunk imports and removed themes leave the registry', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'notion-theme-registry-'))
  fs.mkdirSync(path.join(root, 'themes'))
  const target = path.join(root, 'themes/themeComponents.generated.js')
  try {
    writeThemeRegistry(root, ['heo', 'orange'])
    expect(fs.readFileSync(target, 'utf8')).toContain('import("./orange")')
    writeThemeRegistry(root, ['heo', 'new-theme'])
    const source = fs.readFileSync(target, 'utf8')
    expect(source).toContain('import("./new-theme")')
    expect(source).not.toContain('import("./orange")')
    const lastWrite = fs.statSync(target).mtimeMs
    writeThemeRegistry(root, ['heo', 'new-theme'])
    expect(fs.statSync(target).mtimeMs).toBe(lastWrite)
  } finally {
    if (path.dirname(path.resolve(root)) !== path.resolve(os.tmpdir())) {
      throw new Error('Refusing to remove a directory outside the test temp root')
    }
    fs.rmSync(root, { recursive: true })
  }
})

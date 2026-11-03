import assert from 'node:assert/strict'
import { test } from 'node:test'
import { shouldSkipBuild } from '../vercel-ignore.mjs'

test('Notion music commits deploy even when they skip a package version bump', () => {
  assert.equal(
    shouldSkipBuild('Sync published music from Notion [skip-version]'),
    false
  )
  assert.equal(shouldSkipBuild('Publish a new song'), false)
  assert.equal(
    shouldSkipBuild('Update lyrics\n\nPreserve [skip-version] for the bot'),
    false
  )
  assert.equal(shouldSkipBuild(undefined), false)
})

test('the version bot follow-up remains ignored', () => {
  assert.equal(
    shouldSkipBuild(
      'chore(release): bump package.json to 4.9.1 [skip-version]'
    ),
    true
  )
  assert.equal(
    shouldSkipBuild(
      'chore(release): bump package.json to 4.9.2 [skip-version]\n\nAutomatic version only.'
    ),
    true
  )
  assert.equal(
    shouldSkipBuild('chore(release): bump package.json to 4.9.2'),
    false
  )
})

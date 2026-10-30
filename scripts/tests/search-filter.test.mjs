import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  filterSearchPosts,
  searchKeyword
} from '../../lib/search/filterPosts.js'

test('search accepts text and array categories/tags without crashing', () => {
  const posts = [
    { title: '网页布局', category: '网页设计', tags: ['教程'] },
    { title: '配色', category: ['网页设计', '灵感'], tags: '色彩' },
    { title: '日常', category: null },
    null,
    { summary: 'CSS Grid 布局' }
  ]
  assert.deepEqual(filterSearchPosts(posts, '网页设计'), posts.slice(0, 2))
  assert.deepEqual(filterSearchPosts(posts, ' 色彩 '), [posts[1]])
  assert.deepEqual(filterSearchPosts(posts, 'css grid'), [posts[4]])
})

test('empty, repeated and unavailable search data stay usable', () => {
  assert.equal(searchKeyword(['网页设计', '其他']), '网页设计')
  assert.equal(searchKeyword(undefined), '')
  assert.deepEqual(filterSearchPosts(undefined, '网页设计'), [])
  assert.deepEqual(filterSearchPosts([{ title: '文章' }], '   '), [])
  assert.deepEqual(filterSearchPosts([{ title: '文章' }], 'undefined'), [])
  assert.deepEqual(filterSearchPosts([{ title: '文章' }], '没有的关键词'), [])
})

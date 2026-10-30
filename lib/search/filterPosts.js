export function searchKeyword(value) {
  const keyword = Array.isArray(value) ? value[0] : value
  return typeof keyword === 'string' ? keyword.trim() : ''
}

function fieldText(value) {
  if (Array.isArray(value)) return value.map(fieldText).join(' ')
  return typeof value === 'string' || typeof value === 'number'
    ? String(value)
    : ''
}

export function filterSearchPosts(posts, query) {
  const keyword = searchKeyword(query).toLowerCase()
  if (!keyword || !Array.isArray(posts)) return []
  return posts.filter(post => {
    if (!post) return false
    const content = [post.title, post.summary, post.tags, post.category]
      .map(fieldText)
      .join(' ')
      .toLowerCase()
    return content.includes(keyword)
  })
}

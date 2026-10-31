const serialPublications = require('./serialPublications.json')

// A registered serial release invalidates only that page's persisted blocks.
// The release data is committed after Notion saves, using the existing Git deploy.
function appendSerialPublicationVersion(
  id,
  version,
  publications = serialPublications
) {
  const pageId = String(id || '').replace(/-/g, '').toLowerCase()
  const revision = publications[pageId]?.revision
  if (!Number.isSafeInteger(revision) || revision <= 0) return version
  return version ? `${version}_${revision}` : String(revision)
}

module.exports = { appendSerialPublicationVersion }

/** Resources helpers. Categories mirror studio/schemaTypes/resource.js — keep in sync. */
export const RESOURCE_CATEGORIES = {
  careers: 'CV & careers',
  training: 'Training & courses',
  finance: 'Finance',
  law: 'Law',
  technology: 'Technology',
  scholarships: 'Scholarships & study',
  guides: 'Guides & templates',
  other: 'Other',
}

/** Fallback card colours when none is picked (palette keys) */
export const RESOURCE_CYCLE = ['blue-main', 'gold-main', 'red-main', 'black-main']

const FILE_PROJECTION = `title, description, "url": file.asset->url, "ext": file.asset->extension, "size": file.asset->size, "name": file.asset->originalFilename`

export const RESOURCE_CARD_FIELDS = `_id, title, slug, category, summary, coverImage, cardColour, tags, publishedAt, featured,
  "downloadCount": count(downloads) + count(content[_type == "fileDownload"]),
  "linkCount": count(links) + count(content[_type == "linkCard"]),
  "hasVideo": count(content[_type == "video"]) > 0`

export const RESOURCE_PAGE_FIELDS = `${RESOURCE_CARD_FIELDS},
  content[]{ ..., _type == "fileDownload" => { _key, _type, ${FILE_PROJECTION} } },
  downloads[]{ _key, ${FILE_PROJECTION} },
  links[]{ _key, title, url, description }`

export const categoryLabel = (key) => RESOURCE_CATEGORIES[key] || 'Resource'

export function formatSize(bytes) {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Sanity file URL that downloads with the original filename */
export const downloadUrl = (f) => (f?.url ? `${f.url}?dl=${encodeURIComponent(f.name || '')}` : null)

/** YouTube / Vimeo link → privacy-friendly embed URL (null if not recognised) */
export function videoEmbedUrl(url = '') {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/)
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`
  return null
}

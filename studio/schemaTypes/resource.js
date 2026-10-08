import { colourField } from './colourField'

/**
 * Resource — a learning / training page at /resources/{slug}.
 * Rich content (text, tips, images, video, links) plus downloadable files.
 * Listed on /resources with category filters and search.
 */
export const RESOURCE_CATEGORIES = [
  { title: 'CV & careers', value: 'careers' },
  { title: 'Training & courses', value: 'training' },
  { title: 'Finance', value: 'finance' },
  { title: 'Law', value: 'law' },
  { title: 'Technology', value: 'technology' },
  { title: 'Scholarships & study', value: 'scholarships' },
  { title: 'Guides & templates', value: 'guides' },
  { title: 'Other', value: 'other' },
]

const fileFields = [
  { name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() },
  {
    name: 'file',
    title: 'File',
    type: 'file',
    description: 'PDF, Word, PowerPoint, Excel, image, audio, video, zip…',
    validation: (Rule) => Rule.required(),
  },
  { name: 'description', title: 'Short description', type: 'string' },
]

const linkFields = [
  { name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() },
  {
    name: 'url',
    title: 'URL',
    type: 'url',
    validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https', 'mailto'] }),
  },
  { name: 'description', title: 'Short description', type: 'string' },
]

export default {
  name: 'resource',
  title: 'Resource',
  type: 'document',
  groups: [
    { name: 'details', title: 'Details', default: true },
    { name: 'content', title: 'Page content' },
    { name: 'files', title: 'Downloads & links' },
  ],
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'details',
      description: 'e.g. "CV writing tips" or "Training materials — Finance 2026"',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL',
      type: 'slug',
      group: 'details',
      description: 'The page address: /resources/<this>. Press Generate.',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'details',
      options: { list: RESOURCE_CATEGORIES },
      initialValue: 'guides',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      group: 'details',
      description: 'One or two sentences shown on the resource card and under the page title.',
      validation: (Rule) => Rule.required().max(240),
    },
    {
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      group: 'details',
      description: 'Optional. Wide photo for the card and page header.',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
    },
    {
      ...colourField('cardColour', 'Card colour', 'Colour of the card on /resources and the page header box. Leave empty to rotate automatically.'),
      group: 'details',
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'details',
      description: 'Optional keywords to help people search, e.g. "interviews", "Excel", "2026".',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    },
    {
      name: 'publishedAt',
      title: 'Published date',
      type: 'datetime',
      group: 'details',
      description: 'Newest resources show first.',
      initialValue: () => new Date().toISOString(),
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      group: 'details',
      description: 'Pin to the top of /resources.',
      initialValue: false,
    },
    {
      name: 'hidden',
      title: 'Hidden',
      type: 'boolean',
      group: 'details',
      description: 'Remove from the website without deleting.',
      initialValue: false,
    },

    // --- Page content ---
    {
      name: 'content',
      title: 'Page content',
      type: 'array',
      group: 'content',
      description: 'Build the page: text, tips lists, callouts, images, video, links and inline downloads.',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading', value: 'h2' },
            { title: 'Subheading', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullets', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Highlight', value: 'highlight' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [{ name: 'href', type: 'url', title: 'URL', validation: (Rule) => Rule.uri({ scheme: ['http', 'https', 'mailto'], allowRelative: true }) }],
              },
            ],
          },
        },
        {
          type: 'image',
          title: 'Image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', title: 'Alt text', type: 'string' },
            { name: 'caption', title: 'Caption', type: 'string' },
          ],
        },
        {
          name: 'tipList',
          title: 'Tips list',
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string', description: 'e.g. "10 CV tips"' },
            { name: 'tips', title: 'Tips', type: 'array', of: [{ type: 'text', rows: 2 }], validation: (Rule) => Rule.min(1) },
          ],
          preview: { select: { title: 'title', tips: 'tips' }, prepare: ({ title, tips }) => ({ title: title || 'Tips list', subtitle: `${tips?.length || 0} tips` }) },
        },
        {
          name: 'callout',
          title: 'Callout box',
          type: 'object',
          fields: [
            {
              name: 'tone',
              title: 'Style',
              type: 'string',
              options: { list: [{ title: 'Tip (gold)', value: 'tip' }, { title: 'Info (blue)', value: 'info' }, { title: 'Important (coral)', value: 'important' }], layout: 'radio' },
              initialValue: 'tip',
            },
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'text', title: 'Text', type: 'text', rows: 3, validation: (Rule) => Rule.required() },
          ],
          preview: { select: { title: 'title', subtitle: 'text' }, prepare: ({ title, subtitle }) => ({ title: title || 'Callout', subtitle }) },
        },
        {
          name: 'video',
          title: 'Video',
          type: 'object',
          fields: [
            { name: 'url', title: 'YouTube or Vimeo link', type: 'url', validation: (Rule) => Rule.required() },
            { name: 'caption', title: 'Caption', type: 'string' },
          ],
          preview: { select: { title: 'caption', subtitle: 'url' }, prepare: ({ title, subtitle }) => ({ title: title || 'Video', subtitle }) },
        },
        {
          name: 'fileDownload',
          title: 'Download (inline)',
          type: 'object',
          fields: fileFields,
          preview: { select: { title: 'title', subtitle: 'file.asset.originalFilename' } },
        },
        {
          name: 'linkCard',
          title: 'Link card',
          type: 'object',
          fields: linkFields,
          preview: { select: { title: 'title', subtitle: 'url' } },
        },
      ],
    },

    // --- Downloads & links (sidebar) ---
    {
      name: 'downloads',
      title: 'Downloads',
      type: 'array',
      group: 'files',
      description: 'Files listed in the "Downloads" panel — PDFs, templates, slides, images, recordings…',
      of: [{ type: 'object', name: 'resourceFile', title: 'File', fields: fileFields, preview: { select: { title: 'title', subtitle: 'file.asset.originalFilename' } } }],
    },
    {
      name: 'links',
      title: 'Useful links',
      type: 'array',
      group: 'files',
      description: 'External websites, courses or tools, listed under "Useful links".',
      of: [{ type: 'object', name: 'resourceLink', title: 'Link', fields: linkFields, preview: { select: { title: 'title', subtitle: 'url' } } }],
    },
  ],
  orderings: [
    { title: 'Newest first', name: 'publishedDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
    { title: 'Title A–Z', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', category: 'category', media: 'coverImage', hidden: 'hidden', featured: 'featured', slug: 'slug.current' },
    prepare({ title, category, media, hidden, featured, slug }) {
      const cat = RESOURCE_CATEGORIES.find((c) => c.value === category)?.title
      return {
        title: `${hidden ? '[HIDDEN] ' : ''}${featured ? '★ ' : ''}${title}`,
        subtitle: [cat, slug ? `/resources/${slug}` : null].filter(Boolean).join(' · '),
        media,
      }
    },
  },
}

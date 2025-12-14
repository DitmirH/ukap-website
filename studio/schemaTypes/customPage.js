export default {
  name: 'customPage',
  title: 'Custom Page',
  type: 'document',
  icon: () => '📄',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description: 'The URL path for this page (e.g., "mentor-signup" becomes /page/mentor-signup)',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'description',
      title: 'Page Description',
      type: 'text',
      rows: 2,
      description: 'Brief description for SEO and social sharing',
    },
    {
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'Alt Text', type: 'string' },
      ],
    },
    {
      name: 'heroStyle',
      title: 'Hero Style',
      type: 'string',
      options: {
        list: [
          { title: 'Full Width Banner', value: 'banner' },
          { title: 'Contained', value: 'contained' },
          { title: 'Background Overlay', value: 'overlay' },
          { title: 'No Hero', value: 'none' },
        ],
      },
      initialValue: 'overlay',
    },
    {
      name: 'content',
      title: 'Page Content',
      type: 'array',
      description: 'Build your page with text, images, and forms',
      of: [
        // Rich text blocks
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Underline', value: 'underline' },
              { title: 'Highlight', value: 'highlight' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  { name: 'href', type: 'url', title: 'URL' },
                  { 
                    name: 'openInNewTab', 
                    type: 'boolean', 
                    title: 'Open in new tab',
                    initialValue: false,
                  },
                ],
              },
            ],
          },
        },
        // Images
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', title: 'Alt Text', type: 'string' },
            { name: 'caption', title: 'Caption', type: 'string' },
            {
              name: 'size',
              title: 'Image Size',
              type: 'string',
              options: {
                list: [
                  { title: 'Small', value: 'small' },
                  { title: 'Medium', value: 'medium' },
                  { title: 'Large', value: 'large' },
                  { title: 'Full Width', value: 'full' },
                ],
              },
              initialValue: 'large',
            },
          ],
        },
        // Contact Form Embed
        {
          type: 'object',
          name: 'formEmbed',
          title: 'Contact Form',
          icon: () => '📧',
          fields: [
            {
              name: 'form',
              title: 'Select Form',
              type: 'reference',
              to: [{ type: 'contactForm' }],
              validation: Rule => Rule.required(),
            },
            {
              name: 'overrideTitle',
              title: 'Override Title',
              type: 'string',
              description: 'Optionally override the form title for this page',
            },
          ],
          preview: {
            select: {
              formName: 'form.name',
              overrideTitle: 'overrideTitle',
            },
            prepare({ formName, overrideTitle }) {
              return {
                title: '📧 Contact Form',
                subtitle: overrideTitle || formName || 'Select a form',
              }
            },
          },
        },
        // Call to Action
        {
          type: 'object',
          name: 'cta',
          title: 'Call to Action',
          icon: () => '🔗',
          fields: [
            {
              name: 'text',
              title: 'Button Text',
              type: 'string',
              validation: Rule => Rule.required(),
            },
            {
              name: 'link',
              title: 'Link URL',
              type: 'string',
              validation: Rule => Rule.required(),
            },
            {
              name: 'style',
              title: 'Button Style',
              type: 'string',
              options: {
                list: [
                  { title: 'Primary (Orange)', value: 'primary' },
                  { title: 'Secondary (Outline)', value: 'secondary' },
                  { title: 'Text Link', value: 'text' },
                ],
              },
              initialValue: 'primary',
            },
            {
              name: 'alignment',
              title: 'Alignment',
              type: 'string',
              options: {
                list: [
                  { title: 'Left', value: 'left' },
                  { title: 'Center', value: 'center' },
                  { title: 'Right', value: 'right' },
                ],
              },
              initialValue: 'left',
            },
          ],
          preview: {
            select: { title: 'text', subtitle: 'link' },
            prepare({ title, subtitle }) {
              return {
                title: `🔗 ${title}`,
                subtitle,
              }
            },
          },
        },
        // Divider/Spacer
        {
          type: 'object',
          name: 'divider',
          title: 'Divider / Spacer',
          icon: () => '—',
          fields: [
            {
              name: 'style',
              title: 'Style',
              type: 'string',
              options: {
                list: [
                  { title: 'Line', value: 'line' },
                  { title: 'Space (Small)', value: 'space-sm' },
                  { title: 'Space (Medium)', value: 'space-md' },
                  { title: 'Space (Large)', value: 'space-lg' },
                ],
              },
              initialValue: 'line',
            },
          ],
          preview: {
            select: { style: 'style' },
            prepare({ style }) {
              return {
                title: style === 'line' ? '— Divider Line —' : `⬜ Space (${style?.replace('space-', '')})`,
              }
            },
          },
        },
        // Two Column Layout
        {
          type: 'object',
          name: 'twoColumn',
          title: 'Two Column Layout',
          icon: () => '▥',
          fields: [
            {
              name: 'leftColumn',
              title: 'Left Column',
              type: 'array',
              of: [
                { type: 'block' },
                { 
                  type: 'image', 
                  options: { hotspot: true },
                  fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
                },
              ],
            },
            {
              name: 'rightColumn',
              title: 'Right Column',
              type: 'array',
              of: [
                { type: 'block' },
                { 
                  type: 'image', 
                  options: { hotspot: true },
                  fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
                },
              ],
            },
            {
              name: 'ratio',
              title: 'Column Ratio',
              type: 'string',
              options: {
                list: [
                  { title: '50/50', value: '50-50' },
                  { title: '60/40', value: '60-40' },
                  { title: '40/60', value: '40-60' },
                  { title: '70/30', value: '70-30' },
                  { title: '30/70', value: '30-70' },
                ],
              },
              initialValue: '50-50',
            },
          ],
          preview: {
            select: { ratio: 'ratio' },
            prepare({ ratio }) {
              return {
                title: '▥ Two Column Layout',
                subtitle: ratio || '50-50',
              }
            },
          },
        },
        // Info Box / Card
        {
          type: 'object',
          name: 'infoBox',
          title: 'Info Box',
          icon: () => 'ℹ️',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
            },
            {
              name: 'content',
              title: 'Content',
              type: 'text',
              rows: 3,
            },
            {
              name: 'type',
              title: 'Box Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Info (Blue)', value: 'info' },
                  { title: 'Success (Green)', value: 'success' },
                  { title: 'Warning (Orange)', value: 'warning' },
                  { title: 'Note (Gray)', value: 'note' },
                ],
              },
              initialValue: 'info',
            },
          ],
          preview: {
            select: { title: 'title', type: 'type' },
            prepare({ title, type }) {
              const icons = { info: 'ℹ️', success: '✅', warning: '⚠️', note: '📝' }
              return {
                title: `${icons[type] || 'ℹ️'} ${title || 'Info Box'}`,
                subtitle: type,
              }
            },
          },
        },
      ],
    },
    // Navigation settings
    {
      name: 'showInNav',
      title: 'Show in Navigation',
      type: 'boolean',
      description: 'Add this page to the main navigation menu',
      initialValue: false,
    },
    {
      name: 'navOrder',
      title: 'Navigation Order',
      type: 'number',
      description: 'Order in navigation (lower numbers appear first)',
      hidden: ({ document }) => !document?.showInNav,
    },
    // SEO
    {
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Override the page title for search engines',
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 2,
        },
        {
          name: 'ogImage',
          title: 'Social Share Image',
          type: 'image',
        },
      ],
    },
    {
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
    },
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      media: 'heroImage',
    },
    prepare({ title, slug, media }) {
      return {
        title,
        subtitle: `/page/${slug}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Title',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
    {
      title: 'Nav Order',
      name: 'navOrder',
      by: [{ field: 'navOrder', direction: 'asc' }],
    },
  ],
}


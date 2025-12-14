export default {
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'caption',
          title: 'Caption',
          type: 'string',
        },
      ],
    },
    {
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'A short summary shown on the blog cards',
    },
    {
      name: 'style',
      title: 'Post Style',
      type: 'string',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Featured (Large Header)', value: 'featured' },
          { title: 'Minimal', value: 'minimal' },
          { title: 'Dark Accent', value: 'dark-accent' },
        ],
        layout: 'radio',
      },
      initialValue: 'default',
    },
    {
      name: 'body',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
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
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            },
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Important for accessibility',
            },
          ],
        },
        {
          type: 'object',
          name: 'contactFormEmbed',
          title: 'Contact Form',
          icon: () => '📧',
          fields: [
            {
              name: 'formRef',
              title: 'Select Form',
              type: 'reference',
              to: [{ type: 'contactForm' }],
              description: 'Choose a contact form configuration to embed',
            },
            {
              name: 'overrideTitle',
              title: 'Override Title (optional)',
              type: 'string',
              description: 'Leave empty to use the form\'s default title',
            },
          ],
          preview: {
            select: {
              formName: 'formRef.name',
              overrideTitle: 'overrideTitle',
            },
            prepare({ formName, overrideTitle }) {
              return {
                title: '📧 Contact Form',
                subtitle: overrideTitle || formName || 'No form selected',
              }
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author } = selection
      return {
        ...selection,
        subtitle: author ? `by ${author}` : '',
      }
    },
  },
}

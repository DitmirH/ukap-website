export default {
  name: 'heroSlide',
  title: 'Hero Slide',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'subtitle',
      title: 'Subtitle / Description',
      type: 'text',
      rows: 3,
      description: 'Supporting text displayed below the title',
    },
    {
      name: 'image',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'overlay',
      title: 'Overlay Darkness',
      type: 'number',
      description: 'Percentage of dark overlay for text readability (0-100). Recommended: 40-60',
      validation: (Rule) => Rule.min(0).max(100),
      initialValue: 50,
    },
    {
      name: 'duration',
      title: 'Display Duration (seconds)',
      type: 'number',
      description: 'How long this slide stays visible before transitioning. Default: 6 seconds',
      validation: (Rule) => Rule.min(2).max(30),
      initialValue: 6,
    },
    {
      name: 'textAlign',
      title: 'Text Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'center',
    },
    {
      name: 'primaryButton',
      title: 'Primary Button',
      type: 'object',
      description: 'Main call-to-action button (optional)',
      fields: [
        {
          name: 'text',
          title: 'Button Text',
          type: 'string',
        },
        {
          name: 'link',
          title: 'Button Link',
          type: 'string',
          description: 'e.g. /contact, /blog, or https://...',
        },
      ],
    },
    {
      name: 'secondaryButton',
      title: 'Secondary Button',
      type: 'object',
      description: 'Optional secondary button (outline style)',
      fields: [
        {
          name: 'text',
          title: 'Button Text',
          type: 'string',
        },
        {
          name: 'link',
          title: 'Button Link',
          type: 'string',
        },
      ],
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first in the carousel',
    },
    {
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Toggle to show/hide this slide',
      initialValue: true,
    },
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'image',
      active: 'active',
    },
    prepare({ title, subtitle, media, active }) {
      return {
        title: `${active ? '✓' : '✗'} ${title}`,
        subtitle,
        media,
      }
    },
  },
}

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
      name: 'backgroundType',
      title: 'Background Type',
      type: 'string',
      description: 'Use a photo, or a solid brand colour',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Solid colour', value: 'solid' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      hidden: ({ parent }) => parent?.backgroundType === 'solid',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.parent?.backgroundType === 'solid') return true
          return value ? true : 'An image is required for image slides'
        }),
    },
    {
      name: 'backgroundColor',
      title: 'Background Colour',
      type: 'string',
      description: 'Pick a UKAP brand colour (or choose Custom and enter a hex below)',
      hidden: ({ parent }) => parent?.backgroundType !== 'solid',
      options: {
        list: [
          { title: 'Brand Blue (#02537e)', value: '#02537e' },
          { title: 'Brand Red (#b11823)', value: '#b11823' },
          { title: 'Brand Gold (#ffaf1a)', value: '#ffaf1a' },
          { title: 'Black (#1a1a1a)', value: '#1a1a1a' },
          { title: 'White (#ffffff)', value: '#ffffff' },
          { title: 'Custom (use hex below)', value: 'custom' },
        ],
      },
      initialValue: '#02537e',
    },
    {
      name: 'customColor',
      title: 'Custom Hex Colour',
      type: 'string',
      description: 'e.g. #02537e — used when Background Colour is set to "Custom"',
      hidden: ({ parent }) =>
        parent?.backgroundType !== 'solid' || parent?.backgroundColor !== 'custom',
      validation: (Rule) =>
        Rule.regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
          name: 'hex colour',
          invert: false,
        }).error('Enter a valid hex colour, e.g. #02537e'),
    },
    {
      name: 'overlay',
      title: 'Overlay Darkness',
      type: 'number',
      description: 'For image slides only: percentage of dark overlay for text readability (0-100). Recommended: 40-60',
      hidden: ({ parent }) => parent?.backgroundType === 'solid',
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

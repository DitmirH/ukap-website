// Homepage mission strip — singleton-style document.
// The frontend uses the first document where active == true.
export default {
  name: 'missionSection',
  title: 'Mission Section (Homepage)',
  type: 'document',
  fields: [
    {
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Show this mission section on the homepage',
    },
    {
      name: 'eyebrow',
      title: 'Eyebrow Label',
      type: 'string',
      description: 'Small label above the heading, e.g. "Who we are"',
      initialValue: 'Who we are',
    },
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'highlightedWord',
      title: 'Highlighted Word',
      type: 'string',
      description:
        'Word or phrase within the heading to show in the brand highlight block (must appear in the heading text)',
    },
    {
      name: 'body',
      title: 'Mission Text',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'ctaText',
      title: 'Button Text',
      type: 'string',
      initialValue: 'Learn more about us',
    },
    {
      name: 'ctaLink',
      title: 'Button Link',
      type: 'string',
      description: 'Internal path (e.g. /page/about) or full URL',
    },
  ],
  preview: {
    select: { title: 'heading', subtitle: 'body' },
  },
}

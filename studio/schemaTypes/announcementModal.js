// Homepage announcement modal — pops up on landing when active.
// The frontend shows the first document where active == true.
export default {
  name: 'announcementModal',
  title: 'Announcement Modal (Homepage)',
  type: 'document',
  fields: [
    {
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: false,
      description: 'Turn the popup on or off',
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'body',
      title: 'Message',
      type: 'text',
      rows: 4,
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional image shown at the top of the modal',
    },
    {
      name: 'ctaText',
      title: 'Button Text',
      type: 'string',
      description: 'e.g. "Get Tickets"',
    },
    {
      name: 'ctaLink',
      title: 'Button Link',
      type: 'string',
      description: 'Internal path (e.g. /events) or full URL',
    },
    {
      name: 'dismissText',
      title: 'Dismiss Link Text',
      type: 'string',
      initialValue: 'No thanks',
      description: 'Text of the small close link under the button',
    },
    {
      name: 'frequency',
      title: 'How often should visitors see it?',
      type: 'string',
      options: {
        list: [
          { title: 'Every visit', value: 'always' },
          { title: 'Once per session', value: 'session' },
          { title: 'Once per day', value: 'day' },
          { title: 'Only once (until content changes)', value: 'once' },
        ],
        layout: 'radio',
      },
      initialValue: 'session',
    },
    {
      name: 'delay',
      title: 'Delay (seconds)',
      type: 'number',
      initialValue: 1,
      description: 'Wait this long after the page loads before popping up',
      validation: (Rule) => Rule.min(0).max(30),
    },
  ],
  preview: {
    select: { title: 'title', active: 'active', media: 'image' },
    prepare({ title, active, media }) {
      return {
        title,
        subtitle: active ? '● Active' : '○ Inactive',
        media,
      }
    },
  },
}

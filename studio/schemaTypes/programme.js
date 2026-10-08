// "What we do" programme cards on the homepage.
export default {
  name: 'programme',
  title: 'Programme',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional photo shown at the top of the card',
    },
    {
      name: 'color',
      title: 'Brand Colour',
      type: 'string',
      description:
        'Blue = professional/academic, Red = mentorship/student, Gold = generic (per brand guidelines)',
      options: {
        list: [
          { title: 'Brand Blue', value: 'blue' },
          { title: 'Brand Red', value: 'red' },
          { title: 'Brand Gold', value: 'gold' },
        ],
        layout: 'radio',
      },
      initialValue: 'gold',
    },
    {
      name: 'link',
      title: 'Link',
      type: 'string',
      description: 'Optional — internal path (e.g. /page/mentoring) or full URL',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    },
    {
      name: 'hidden',
      title: 'Hidden',
      type: 'boolean',
      initialValue: false,
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
    select: { title: 'title', subtitle: 'description', media: 'image' },
  },
}

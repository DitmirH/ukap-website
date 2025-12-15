export default {
  name: 'sponsorshipTier',
  title: 'Sponsorship Tier',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Tier Name',
      type: 'string',
      description: 'e.g., Bronze, Silver, Gold, Platinum',
      validation: Rule => Rule.required(),
    },
    {
      name: 'price',
      title: 'Price',
      type: 'string',
      description: 'e.g., "£500", "£1,000", "£5,000+"',
      validation: Rule => Rule.required(),
    },
    {
      name: 'description',
      title: 'Short Description',
      type: 'string',
      description: 'Brief tagline for this tier',
    },
    {
      name: 'benefits',
      title: 'What\'s Included',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of benefits for this tier',
    },
    {
      name: 'highlighted',
      title: 'Highlight This Tier',
      type: 'boolean',
      description: 'Make this tier stand out (e.g., "Most Popular")',
      initialValue: false,
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 0,
    },
    {
      name: 'contactLink',
      title: 'Contact/Enquiry Link',
      type: 'url',
      description: 'Optional link for enquiries about this tier',
    },
    {
      name: 'hidden',
      title: 'Hide Tier',
      type: 'boolean',
      description: 'Hide this tier from the donation page',
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
    select: {
      title: 'name',
      price: 'price',
      highlighted: 'highlighted',
      hidden: 'hidden',
    },
    prepare({ title, price, highlighted, hidden }) {
      return {
        title: `${hidden ? '[HIDDEN] ' : ''}${highlighted ? '★ ' : ''}${title}`,
        subtitle: price,
      }
    },
  },
}


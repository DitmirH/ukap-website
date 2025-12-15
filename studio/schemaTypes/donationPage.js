export default {
  name: 'donationPage',
  title: 'Donation Page',
  type: 'document',
  fields: [
    // Hero Section
    {
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'Main headline (e.g., "Help Us Create Brighter Futures Through Education")',
      validation: Rule => Rule.required(),
    },
    {
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'introduction',
      title: 'Introduction Text',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
          },
        },
      ],
    },

    // Why Donate Section
    {
      name: 'whyDonateTitle',
      title: 'Why Donate Section Title',
      type: 'string',
      initialValue: 'Why Your Donation Matters',
    },
    {
      name: 'whyDonateItems',
      title: 'Why Donate Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'icon', title: 'Icon/Emoji', type: 'string', description: 'e.g., 🎓, 📚, 💡' },
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 3 },
          ],
          preview: {
            select: { title: 'title', icon: 'icon' },
            prepare({ title, icon }) {
              return { title: `${icon || '•'} ${title}` }
            },
          },
        },
      ],
    },

    // Impact Section
    {
      name: 'impactTitle',
      title: 'Impact Section Title',
      type: 'string',
      initialValue: 'Our Impact',
    },
    {
      name: 'impactSubtitle',
      title: 'Impact Subtitle',
      type: 'string',
      description: 'e.g., "2025 at a Glance"',
    },
    {
      name: 'impactStats',
      title: 'Impact Statistics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'number', title: 'Number/Stat', type: 'string', description: 'e.g., "15+", "2,000", "£8,000"' },
            { name: 'label', title: 'Label', type: 'string', description: 'e.g., "Learning Events", "Participants Reached"' },
          ],
          preview: {
            select: { number: 'number', label: 'label' },
            prepare({ number, label }) {
              return { title: `${number} - ${label}` }
            },
          },
        },
      ],
    },
    {
      name: 'impactDescription',
      title: 'Impact Description',
      type: 'text',
      rows: 3,
    },

    // Achievements Section
    {
      name: 'achievementsTitle',
      title: 'Achievements Section Title',
      type: 'string',
      initialValue: 'Recent Achievements Made Possible Through Community Support',
    },
    {
      name: 'achievements',
      title: 'Achievements List',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'highlight', title: 'Highlight Text', type: 'string', description: 'Bold part (e.g., "Gala for a Brighter Future")' },
            { name: 'description', title: 'Description', type: 'string', description: 'Rest of the text' },
          ],
          preview: {
            select: { highlight: 'highlight', description: 'description' },
            prepare({ highlight, description }) {
              return { title: `${highlight} - ${description}` }
            },
          },
        },
      ],
    },

    // Donation CTA
    {
      name: 'donateButtonText',
      title: 'Donate Button Text',
      type: 'string',
      initialValue: 'Donate Now',
    },
    {
      name: 'donateLink',
      title: 'Donate Link',
      type: 'url',
      description: 'External payment link (e.g., PayPal, Stripe, JustGiving)',
    },
    {
      name: 'donateDescription',
      title: 'Below Button Text',
      type: 'string',
      description: 'e.g., charity registration info',
    },

    // Additional Content
    {
      name: 'additionalContent',
      title: 'Additional Content',
      type: 'array',
      description: 'Any extra sections or content',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [{ name: 'href', type: 'url', title: 'URL' }],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
    },
  ],
  preview: {
    select: { title: 'heroTitle' },
    prepare({ title }) {
      return {
        title: title || 'Donation Page',
        subtitle: 'Donation Page Content',
      }
    },
  },
}


import { SlugWithPreview } from '../components/SlugWithPreview'

export default {
  name: 'sponsor',
  title: 'Sponsor',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Company Name',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      components: { input: SlugWithPreview },
      options: {
        source: 'name',
        maxLength: 96,
        urlPrefix: '/sponsors/',
        slugify: input => input.toLowerCase().replace(/\s+/g, '-').slice(0, 96),
      },
    },
    {
      name: 'logo',
      title: 'Company Logo',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'Alt Text', type: 'string' },
      ],
      validation: Rule => Rule.required(),
    },
    {
      name: 'tier',
      title: 'Sponsor Tier',
      type: 'string',
      options: {
        list: [
          { title: 'Platinum', value: 'platinum' },
          { title: 'Gold', value: 'gold' },
          { title: 'Silver', value: 'silver' },
          { title: 'Bronze', value: 'bronze' },
          { title: 'Partner', value: 'partner' },
          { title: 'Supporter', value: 'supporter' },
        ],
      },
      initialValue: 'partner',
    },
    {
      name: 'tagline',
      title: 'Tagline / What They Do',
      type: 'string',
      description: 'Brief one-liner about the company',
    },
    {
      name: 'description',
      title: 'Company Profile',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
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
      ],
    },
    {
      name: 'website',
      title: 'Company Website',
      type: 'url',
    },
    {
      name: 'email',
      title: 'Contact Email',
      type: 'string',
    },
    {
      name: 'phone',
      title: 'Contact Phone',
      type: 'string',
    },
    {
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        {
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url',
        },
        {
          name: 'twitter',
          title: 'Twitter / X',
          type: 'url',
        },
        {
          name: 'instagram',
          title: 'Instagram',
          type: 'url',
        },
        {
          name: 'facebook',
          title: 'Facebook',
          type: 'url',
        },
      ],
    },
    {
      name: 'featured',
      title: 'Featured Sponsor',
      type: 'boolean',
      description: 'Show prominently on homepage',
      initialValue: false,
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first within their tier',
    },
    {
      name: 'hidden',
      title: 'Hide Sponsor',
      type: 'boolean',
      description: 'Hide from all listings',
      initialValue: false,
    },
  ],
  orderings: [
    {
      title: 'Tier, then Order',
      name: 'tierOrder',
      by: [
        { field: 'tier', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
    {
      title: 'Name',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      tier: 'tier',
      media: 'logo',
      hidden: 'hidden',
    },
    prepare({ title, tier, media, hidden }) {
      const tierLabels = {
        platinum: '💎 Platinum',
        gold: '🥇 Gold',
        silver: '🥈 Silver',
        bronze: '🥉 Bronze',
        partner: '🤝 Partner',
        supporter: '💙 Supporter',
      }
      const hiddenLabel = hidden ? '👁️‍🗨️ HIDDEN - ' : ''
      return {
        title: `${hiddenLabel}${title}`,
        subtitle: tierLabels[tier] || tier,
        media,
      }
    },
  },
}


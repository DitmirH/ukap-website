import { SlugWithPreview } from '../components/SlugWithPreview'

export default {
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Event Title',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      components: { input: SlugWithPreview },
      options: {
        source: 'title',
        maxLength: 96,
        urlPrefix: '/events/',
        slugify: input => input.toLowerCase().replace(/\s+/g, '-').slice(0, 96),
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'date',
      title: 'Event Date',
      type: 'datetime',
      validation: Rule => Rule.required(),
    },
    {
      name: 'endDate',
      title: 'End Date (optional)',
      type: 'datetime',
      description: 'For multi-day events',
    },
    {
      name: 'time',
      title: 'Time',
      type: 'string',
      description: 'e.g., "7:00 PM - 10:00 PM" or "All Day"',
    },
    {
      name: 'venue',
      title: 'Venue / Location',
      type: 'string',
      description: 'e.g., "Duke\'s Hall, Royal Academy of Music"',
    },
    {
      name: 'address',
      title: 'Full Address',
      type: 'text',
      rows: 2,
      description: 'Full address for directions',
    },
    {
      name: 'mapLink',
      title: 'Map Link',
      type: 'url',
      description: 'Google Maps or other map link',
    },
    {
      name: 'excerpt',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: 'Brief description shown in event listings',
      validation: Rule => Rule.max(300),
    },
    {
      name: 'image',
      title: 'Event Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'Alt Text', type: 'string' },
      ],
    },
    {
      name: 'body',
      title: 'Full Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
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
          fields: [
            { name: 'alt', title: 'Alt Text', type: 'string' },
            { name: 'caption', title: 'Caption', type: 'string' },
          ],
        },
        {
          type: 'object',
          name: 'embedCode',
          title: 'Embed Code',
          fields: [
            {
              name: 'title',
              title: 'Label (for reference)',
              type: 'string',
              description: 'e.g., "Ticket Tailor Widget", "YouTube Video"',
            },
            {
              name: 'code',
              title: 'Embed Code',
              type: 'text',
              rows: 10,
              description: 'Paste your embed code here (HTML, iframes, scripts)',
              validation: Rule => Rule.required(),
            },
          ],
          preview: {
            select: { title: 'title', code: 'code' },
            prepare({ title, code }) {
              const preview = code?.substring(0, 50) || 'No code'
              return {
                title: `</> ${title || 'Embed Code'}`,
                subtitle: preview + (code?.length > 50 ? '...' : ''),
              }
            },
          },
        },
      ],
    },
    {
      name: 'ticketLink',
      title: 'Ticket / Registration Link',
      type: 'url',
    },
    {
      name: 'ticketPrice',
      title: 'Ticket Price',
      type: 'string',
      description: 'e.g., "Free", "£25", "From £15"',
    },
    {
      name: 'isFree',
      title: 'Free Event',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'category',
      title: 'Event Category',
      type: 'string',
      options: {
        list: [
          { title: 'Concert', value: 'concert' },
          { title: 'Workshop', value: 'workshop' },
          { title: 'Networking', value: 'networking' },
          { title: 'Gala', value: 'gala' },
          { title: 'Fundraiser', value: 'fundraiser' },
          { title: 'Exhibition', value: 'exhibition' },
          { title: 'Conference', value: 'conference' },
          { title: 'Other', value: 'other' },
        ],
      },
    },
    {
      name: 'featured',
      title: 'Featured Event',
      type: 'boolean',
      description: 'Show prominently on the homepage or events page',
      initialValue: false,
    },
    {
      name: 'hidden',
      title: 'Hide Event',
      type: 'boolean',
      description: 'Hide this event from all listings (keeps it in Sanity for reference)',
      initialValue: false,
    },
    {
      name: 'status',
      title: 'Special Status (Optional)',
      type: 'string',
      description: 'Only set this for sold out/cancelled events. Past/upcoming is automatic based on date.',
      options: {
        list: [
          { title: 'None (Auto)', value: '' },
          { title: 'Sold Out', value: 'sold-out' },
          { title: 'Cancelled', value: 'cancelled' },
          { title: 'Postponed', value: 'postponed' },
        ],
      },
      initialValue: '',
    },
  ],
  orderings: [
    {
      title: 'Event Date (Newest)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
    {
      title: 'Event Date (Upcoming)',
      name: 'dateAsc',
      by: [{ field: 'date', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      venue: 'venue',
      media: 'image',
      status: 'status',
      hidden: 'hidden',
    },
    prepare({ title, date, venue, media, status, hidden }) {
      const formattedDate = date 
        ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'No date'
      const hiddenLabel = hidden ? '👁️‍🗨️ HIDDEN - ' : ''
      const statusLabel = status === 'sold-out' ? ' 🔴 SOLD OUT' : status === 'cancelled' ? ' ❌ CANCELLED' : ''
      return {
        title: `${hiddenLabel}${title}${statusLabel}`,
        subtitle: `${formattedDate} • ${venue || 'No venue'}`,
        media,
      }
    },
  },
}


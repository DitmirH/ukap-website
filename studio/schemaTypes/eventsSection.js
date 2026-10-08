import { colourField } from './colourField'

/**
 * "What's on" — the events cards section on the homepage.
 * One document; pick events by hand or show the next upcoming ones automatically.
 */
export default {
  name: 'eventsSection',
  title: "What's On (Events cards)",
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Section title',
      type: 'string',
      initialValue: "What's on",
    },
    {
      name: 'mode',
      title: 'Which events to show',
      type: 'string',
      options: {
        list: [
          { title: 'Automatic — next upcoming events', value: 'auto' },
          { title: 'Hand-picked — choose the event pages below', value: 'manual' },
        ],
        layout: 'radio',
      },
      initialValue: 'auto',
    },
    {
      name: 'limit',
      title: 'How many events',
      type: 'number',
      initialValue: 3,
      validation: (Rule) => Rule.min(1).max(12),
      hidden: ({ document }) => document?.mode === 'manual',
    },
    {
      name: 'cards',
      title: 'Event cards',
      description: 'Each card links to the event page you pick. Title, date, venue, photo and ticket link come from that page automatically.',
      type: 'array',
      hidden: ({ document }) => document?.mode !== 'manual',
      of: [
        {
          type: 'object',
          name: 'eventCard',
          title: 'Event card',
          fields: [
            {
              name: 'event',
              title: 'Event page',
              type: 'reference',
              to: [{ type: 'event' }],
              validation: (Rule) => Rule.required(),
            },
            colourField('cardColour', 'Card colour', "Overrides the event's own card colour for this card."),
            { name: 'titleOverride', title: 'Title (optional override)', type: 'string' },
            { name: 'descriptionOverride', title: 'Description (optional override)', type: 'text', rows: 3 },
            { name: 'imageOverride', title: 'Image (optional override)', type: 'image', options: { hotspot: true } },
          ],
          preview: {
            select: { title: 'event.title', override: 'titleOverride', date: 'event.date', media: 'event.image' },
            prepare({ title, override, date, media }) {
              const d = date ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
              return { title: override || title || 'Pick an event', subtitle: d, media }
            },
          },
        },
      ],
    },
    {
      name: 'viewAllLabel',
      title: '"View all" link text',
      type: 'string',
      initialValue: 'All events',
    },
  ],
  preview: {
    select: { title: 'title', mode: 'mode' },
    prepare({ title, mode }) {
      return { title: title || "What's on", subtitle: mode === 'manual' ? 'Hand-picked events' : 'Automatic — next upcoming events' }
    },
  },
}

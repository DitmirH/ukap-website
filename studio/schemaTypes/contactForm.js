// Field type definitions for dynamic form builder
const fieldTypes = [
  { title: 'Text Input', value: 'text' },
  { title: 'Email (Always Required)', value: 'email' },
  { title: 'Phone Number', value: 'phone' },
  { title: 'Text Area (Multi-line)', value: 'textarea' },
  { title: 'Dropdown Select', value: 'select' },
  { title: 'Radio Buttons', value: 'radio' },
  { title: 'Checkboxes', value: 'checkbox' },
  { title: 'Date', value: 'date' },
  { title: 'Number', value: 'number' },
  { title: 'URL/Website', value: 'url' },
  { title: 'File Upload', value: 'file' },
]

// Reusable form field object
const formField = {
  name: 'formField',
  title: 'Form Field',
  type: 'object',
  fields: [
    {
      name: 'fieldType',
      title: 'Field Type',
      type: 'string',
      options: {
        list: fieldTypes,
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'label',
      title: 'Field Label',
      type: 'string',
      description: 'Label shown above the field',
      validation: Rule => Rule.required(),
    },
    {
      name: 'name',
      title: 'Field Name (ID)',
      type: 'slug',
      description: 'Unique identifier for this field (used in form submission)',
      options: {
        source: 'label',
        maxLength: 50,
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'placeholder',
      title: 'Placeholder Text',
      type: 'string',
      description: 'Hint text shown inside the field',
    },
    {
      name: 'required',
      title: 'Required Field',
      type: 'boolean',
      description: 'Must be filled before submitting',
      initialValue: false,
    },
    {
      name: 'halfWidth',
      title: 'Half Width',
      type: 'boolean',
      description: 'Display at half width (side by side with another field)',
      initialValue: false,
    },
    {
      name: 'options',
      title: 'Options',
      type: 'array',
      description: 'Options for dropdown, radio, or checkbox fields',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Option Label',
              type: 'string',
              validation: Rule => Rule.required(),
            },
            {
              name: 'value',
              title: 'Option Value',
              type: 'string',
              description: 'Value sent when selected (defaults to label if empty)',
            },
          ],
          preview: {
            select: { title: 'label', subtitle: 'value' },
          },
        },
      ],
      hidden: ({ parent }) => !['select', 'radio', 'checkbox'].includes(parent?.fieldType),
    },
    {
      name: 'helpText',
      title: 'Help Text',
      type: 'string',
      description: 'Additional instructions shown below the field',
    },
    {
      name: 'validation',
      title: 'Validation',
      type: 'object',
      fields: [
        {
          name: 'minLength',
          title: 'Minimum Length',
          type: 'number',
        },
        {
          name: 'maxLength',
          title: 'Maximum Length',
          type: 'number',
        },
        {
          name: 'pattern',
          title: 'Pattern (Regex)',
          type: 'string',
          description: 'Regular expression for validation',
        },
      ],
    },
    // File upload specific settings
    {
      name: 'fileSettings',
      title: 'File Upload Settings',
      type: 'object',
      hidden: ({ parent }) => parent?.fieldType !== 'file',
      fields: [
        {
          name: 'allowedTypes',
          title: 'Allowed File Types',
          type: 'array',
          of: [{ type: 'string' }],
          options: {
            list: [
              { title: 'PDF Documents (.pdf)', value: '.pdf' },
              { title: 'Word Documents (.doc, .docx)', value: '.doc,.docx' },
              { title: 'Images (.jpg, .png, .gif)', value: '.jpg,.jpeg,.png,.gif' },
              { title: 'Excel (.xls, .xlsx)', value: '.xls,.xlsx' },
              { title: 'Text Files (.txt)', value: '.txt' },
              { title: 'All Documents', value: '.pdf,.doc,.docx,.txt,.xls,.xlsx' },
              { title: 'All Images', value: '.jpg,.jpeg,.png,.gif,.webp,.svg' },
            ],
          },
          description: 'Select allowed file types',
        },
        {
          name: 'maxSizeMB',
          title: 'Max File Size (MB)',
          type: 'number',
          description: 'Maximum file size in megabytes (max 4MB for Vercel free tier)',
          initialValue: 4,
          validation: Rule => Rule.max(4).min(1),
        },
        {
          name: 'multiple',
          title: 'Allow Multiple Files',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'maxFiles',
          title: 'Max Number of Files',
          type: 'number',
          description: 'Maximum number of files allowed (if multiple)',
          initialValue: 3,
          hidden: ({ parent }) => !parent?.multiple,
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'label',
      fieldType: 'fieldType',
      required: 'required',
    },
    prepare({ title, fieldType, required }) {
      const typeLabels = {
        text: '📝 Text',
        email: '✉️ Email',
        phone: '📞 Phone',
        textarea: '📄 Textarea',
        select: '📋 Dropdown',
        radio: '🔘 Radio',
        checkbox: '☑️ Checkbox',
        date: '📅 Date',
        number: '🔢 Number',
        url: '🔗 URL',
        file: '📎 File',
      }
      return {
        title: `${title}${required ? ' *' : ''}`,
        subtitle: typeLabels[fieldType] || fieldType,
      }
    },
  },
}

export default {
  name: 'contactForm',
  title: 'Contact Form',
  type: 'document',
  icon: () => '📧',
  fields: [
    {
      name: 'name',
      title: 'Form Name',
      type: 'string',
      description: 'Internal name (e.g., "Mentor Application", "Contact Us")',
      validation: Rule => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Form ID',
      type: 'slug',
      description: 'Unique identifier for this form',
      options: {
        source: 'name',
        maxLength: 50,
      },
      validation: Rule => Rule.required(),
    },
    
    // Content above the form
    {
      name: 'headerContent',
      title: 'Header Content',
      type: 'array',
      description: 'Content displayed above the form (text, images, etc.)',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Highlight', value: 'highlight' },
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
      ],
    },

    // Email field is always included and required
    {
      name: 'emailFieldLabel',
      title: 'Email Field Label',
      type: 'string',
      description: 'Label for the email field (always required)',
      initialValue: 'Email Address',
    },
    {
      name: 'emailFieldPlaceholder',
      title: 'Email Field Placeholder',
      type: 'string',
      initialValue: 'your@email.com',
    },

    // Dynamic custom fields
    {
      name: 'fields',
      title: 'Form Fields',
      type: 'array',
      description: 'Add and arrange your form fields',
      of: [formField],
    },

    // Content below the form
    {
      name: 'footerContent',
      title: 'Footer Content',
      type: 'array',
      description: 'Content displayed below the form',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Small', value: 'small' },
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

    // Submit button
    {
      name: 'submitButton',
      title: 'Submit Button',
      type: 'object',
      fields: [
        {
          name: 'text',
          title: 'Button Text',
          type: 'string',
          initialValue: 'Submit',
        },
        {
          name: 'loadingText',
          title: 'Loading Text',
          type: 'string',
          initialValue: 'Submitting...',
        },
      ],
    },

    // Messages
    {
      name: 'messages',
      title: 'Messages',
      type: 'object',
      fields: [
        {
          name: 'success',
          title: 'Success Message',
          type: 'text',
          rows: 2,
          initialValue: 'Thank you! Your submission has been received.',
        },
        {
          name: 'error',
          title: 'Error Message',
          type: 'text',
          rows: 2,
          initialValue: 'Something went wrong. Please try again.',
        },
      ],
    },

    // Email settings
    {
      name: 'emailSettings',
      title: 'Email Settings',
      type: 'object',
      fields: [
        {
          name: 'subjectPrefix',
          title: 'Email Subject Prefix',
          type: 'string',
          description: 'Prefix for email subject line',
          initialValue: '[UKAP]',
        },
        {
          name: 'subjectField',
          title: 'Use Field as Subject',
          type: 'string',
          description: 'Field name to use as email subject (leave empty for default)',
        },
        {
          name: 'recipients',
          title: 'Recipients (Distribution List)',
          type: 'array',
          description: 'All these emails will receive submissions',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'email',
                  title: 'Email Address',
                  type: 'string',
                  validation: Rule => Rule.required().email(),
                },
                {
                  name: 'name',
                  title: 'Name',
                  type: 'string',
                },
              ],
              preview: {
                select: { title: 'email', subtitle: 'name' },
              },
            },
          ],
        },
        {
          name: 'sendConfirmation',
          title: 'Send Confirmation to Submitter',
          type: 'boolean',
          description: 'Send a confirmation email to the person who submitted',
          initialValue: false,
        },
        {
          name: 'confirmationMessage',
          title: 'Confirmation Email Message',
          type: 'text',
          rows: 4,
          hidden: ({ parent }) => !parent?.sendConfirmation,
        },
      ],
    },

    // Styling
    {
      name: 'styling',
      title: 'Styling',
      type: 'object',
      fields: [
        {
          name: 'variant',
          title: 'Form Style',
          type: 'string',
          options: {
            list: [
              { title: 'Default (Dark)', value: 'default' },
              { title: 'Light', value: 'light' },
              { title: 'Bordered', value: 'bordered' },
              { title: 'Card', value: 'card' },
              { title: 'Minimal', value: 'minimal' },
            ],
          },
          initialValue: 'default',
        },
        {
          name: 'maxWidth',
          title: 'Max Width',
          type: 'string',
          options: {
            list: [
              { title: 'Small (400px)', value: 'sm' },
              { title: 'Medium (500px)', value: 'md' },
              { title: 'Large (600px)', value: 'lg' },
              { title: 'Full Width', value: 'full' },
            ],
          },
          initialValue: 'md',
        },
      ],
    },

    {
      name: 'isDefault',
      title: 'Default Homepage Form',
      type: 'boolean',
      description: 'Use this form on the homepage',
      initialValue: false,
    },
  ],
  preview: {
    select: {
      title: 'name',
      fields: 'fields',
      recipients: 'emailSettings.recipients',
    },
    prepare({ title, fields, recipients }) {
      const fieldCount = fields?.length || 0
      const recipientCount = recipients?.length || 0
      return {
        title,
        subtitle: `${fieldCount + 1} fields • ${recipientCount} recipient${recipientCount !== 1 ? 's' : ''}`,
      }
    },
  },
}

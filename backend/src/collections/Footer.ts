import type { CollectionConfig } from 'payload'

export const Footer: CollectionConfig = {
  slug: 'footer',
  admin: {
    useAsTitle: 'title',
    description: 'Global footer configuration - appears on all pages',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      if (!user) return false
      return ['admin', 'editor'].includes((user as any).role)
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      return ['admin', 'editor'].includes((user as any).role)
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return (user as any).role === 'admin'
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Footer Configuration',
      admin: {
        description: 'Internal title for admin panel',
        readOnly: true,
      },
    },
    {
      name: 'companyName',
      type: 'text',
      required: true,
      admin: {
        description: 'Company name displayed in footer',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Short company description or tagline',
      },
    },
    {
      name: 'address',
      type: 'group',
      fields: [
        {
          name: 'street',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
        },
        {
          name: 'postalCode',
          type: 'text',
        },
        {
          name: 'country',
          type: 'text',
        },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        {
          name: 'email',
          type: 'email',
        },
        {
          name: 'phone',
          type: 'text',
        },
      ],
    },
    {
      name: 'socialMedia',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Twitter/X', value: 'twitter' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'TikTok', value: 'tiktok' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            description: 'Full URL to social media profile',
          },
        },
      ],
    },
    {
      name: 'links',
      type: 'array',
      admin: {
        description: 'Footer navigation links',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            description: 'Internal path (e.g., /about) or external URL',
          },
        },
      ],
    },
    {
      name: 'copyrightText',
      type: 'text',
      admin: {
        description: 'Copyright notice (e.g., "© 2025 Company Name. All rights reserved.")',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Footer logo (optional)',
      },
    },
  ],
}

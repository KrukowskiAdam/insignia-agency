import type { CollectionConfig } from 'payload'
import { formatSlug } from '../utils/formatSlug'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
  },
  access: {
    read: () => true, // Public read access
    create: ({ req: { user } }) => {
      // Only admin and editor can create
      if (!user) return false
      return ['admin', 'editor'].includes((user as any).role)
    },
    update: ({ req: { user } }) => {
      // Only admin and editor can update
      if (!user) return false
      return ['admin', 'editor'].includes((user as any).role)
    },
    delete: ({ req: { user } }) => {
      // Only admin can delete
      if (!user) return false
      return (user as any).role === 'admin'
    },
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-generate slug from title if slug is empty
        if (data.title && !data.slug) {
          data.slug = formatSlug(data.title)
        }
        return data
      },
    ],
    afterChange: [
      ({ doc, operation }) => {
        console.log(`Page "${doc.title}" was ${operation}d`)
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Page title (e.g., "O nas", "Kontakt")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL slug - auto-generated from title if left empty (Polish chars converted)',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            // Format slug on input
            if (value) {
              return formatSlug(value)
            }
            // Auto-generate from title if empty
            if (!value && data?.title) {
              return formatSlug(data.title)
            }
            return value
          },
        ],
      },
    },
    {
      name: 'isHomepage',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark this page as the homepage (displayed at "/")',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'published',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    {
      name: 'blocks',
      type: 'blocks',
      required: true,
      blocks: [
        {
          slug: 'hero',
          fields: [
            {
              name: 'heading',
              type: 'text',
              required: true,
            },
            {
              name: 'subheading',
              type: 'textarea',
            },
            {
              name: 'backgroundImage',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          slug: 'content',
          fields: [
            {
              name: 'text',
              type: 'textarea',
              required: true,
            },
          ],
        },
        {
          slug: 'cards',
          fields: [
            {
              name: 'title',
              type: 'text',
              admin: {
                description: 'Section title (optional)',
              },
            },
            {
              name: 'selectedCards',
              type: 'relationship',
              relationTo: 'cards',
              hasMany: true,
              required: true,
              admin: {
                description: 'Select cards to display in this section',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          admin: {
            description: 'SEO title (optional, defaults to page title)',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          admin: {
            description: 'SEO meta description',
          },
        },
        {
          name: 'metaImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'SEO share image (optional)',
          },
        },
      ],
    },
  ],
}

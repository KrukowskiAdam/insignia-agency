import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status'],
  },
  access: {
    read: () => true, // Public read access
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
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
        description: 'URL slug (e.g., "home", "o-nas", "kontakt"). Use "home" for homepage.',
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
      defaultValue: 'draft',
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

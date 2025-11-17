import type { CollectionConfig } from 'payload'
import { formatSlug } from '../utils/formatSlug'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
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
              name: 'cards',
              type: 'array',
              fields: [
                {
                  name: 'Enumeration',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Big Text', value: 'Block_BigText' },
                    { label: 'Description Text', value: 'Block_DescText' },
                    { label: 'Video', value: 'Block_Video' },
                    { label: 'Image', value: 'Block_Image' },
                  ],
                },
                {
                  name: 'column',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Left', value: 'left' },
                    { label: 'Middle', value: 'middle' },
                    { label: 'Right', value: 'right' },
                  ],
                },
                {
                  name: 'size',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Small', value: 'small' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'Large', value: 'large' },
                  ],
                },
                {
                  name: 'order',
                  type: 'number',
                  defaultValue: 0,
                },
                // BigText fields
                {
                  name: 'titleLine1',
                  type: 'text',
                  admin: {
                    condition: (data, siblingData) => siblingData.Enumeration === 'Block_BigText',
                  },
                },
                {
                  name: 'titleLine2',
                  type: 'text',
                  admin: {
                    condition: (data, siblingData) => siblingData.Enumeration === 'Block_BigText',
                  },
                },
                {
                  name: 'titleColor',
                  type: 'select',
                  options: [
                    { label: 'Red', value: 'red' },
                    { label: 'Blue', value: 'blue' },
                    { label: 'Green', value: 'green' },
                  ],
                  admin: {
                    condition: (data, siblingData) => siblingData.Enumeration === 'Block_BigText',
                  },
                },
                // DescText, Video, Image fields
                {
                  name: 'title',
                  type: 'text',
                  admin: {
                    condition: (data, siblingData) => ['Block_DescText', 'Block_Video', 'Block_Image'].includes(siblingData.Enumeration),
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  admin: {
                    condition: (data, siblingData) => ['Block_DescText', 'Block_Video', 'Block_Image'].includes(siblingData.Enumeration),
                  },
                },
                {
                  name: 'category',
                  type: 'text',
                  admin: {
                    condition: (data, siblingData) => ['Block_Video', 'Block_Image'].includes(siblingData.Enumeration),
                  },
                },
                // Image fields
                {
                  name: 'imageSrc',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (data, siblingData) => siblingData.Enumeration === 'Block_Image',
                  },
                },
                {
                  name: 'imageAlt',
                  type: 'text',
                  admin: {
                    condition: (data, siblingData) => siblingData.Enumeration === 'Block_Image',
                  },
                },
                // Video fields
                {
                  name: 'videoWebm',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (data, siblingData) => siblingData.Enumeration === 'Block_Video',
                  },
                },
                {
                  name: 'videoMp4',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (data, siblingData) => siblingData.Enumeration === 'Block_Video',
                  },
                },
                // Footer fields
                {
                  name: 'footerTitle',
                  type: 'text',
                },
                {
                  name: 'footerDescription',
                  type: 'text',
                },
                {
                  name: 'buttonText',
                  type: 'text',
                },
                {
                  name: 'buttonColor',
                  type: 'select',
                  options: [
                    { label: 'Red', value: 'red' },
                    { label: 'Blue', value: 'blue' },
                    { label: 'Green', value: 'green' },
                  ],
                },
                {
                  name: 'buttonLinkType',
                  type: 'select',
                  options: [
                    { label: 'None', value: 'none' },
                    { label: 'External Link', value: 'external' },
                    { label: 'Internal Link', value: 'internal' },
                  ],
                  defaultValue: 'none',
                },
                {
                  name: 'buttonLinkValue',
                  type: 'text',
                },
              ],
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

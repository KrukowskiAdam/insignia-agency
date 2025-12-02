import type { CollectionConfig, Field } from 'payload'
import { formatSlug } from '../utils/formatSlug'

const cardFields: Field[] = [
  {
    name: 'Enumeration',
    type: 'select',
    required: true,
    defaultValue: 'Block_BigText',
    options: [
      { label: 'Big Text', value: 'Block_BigText' },
      { label: 'Description Text', value: 'Block_DescText' },
      { label: 'Video', value: 'Block_Video' },
      { label: 'Image', value: 'Block_Image' },
    ],
  },
  {
    name: 'size',
    type: 'select',
    required: true,
    defaultValue: 'medium',
    options: [
      { label: 'Small', value: 'small' },
      { label: 'Medium', value: 'medium' },
      { label: 'Large', value: 'large' },
    ],
  },
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
]

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
      ],
    },
    {
      name: 'homepageColumns',
      type: 'group',
      admin: {
        condition: (data) => Boolean(data?.isHomepage),
        description: 'Available only on the homepage – controls the 3-column cards layout.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'Optional heading displayed above the columns.',
          },
        },
        {
          name: 'cards',
          type: 'array',
          minRows: 1,
          fields: cardFields,
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

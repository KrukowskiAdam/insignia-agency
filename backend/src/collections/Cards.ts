import type { CollectionConfig } from 'payload'

export const Cards: CollectionConfig = {
  slug: 'cards',
  admin: {
    useAsTitle: 'Enumeration',
    defaultColumns: ['Enumeration', 'column', 'size', 'order'],
  },
  access: {
    read: () => true, // Public read access for frontend
  },
  fields: [
    // Basic Configuration
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
      admin: {
        description: 'Select card type - fields will change based on your selection',
      },
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
      admin: {
        description: 'Display order (lower numbers appear first)',
      },
    },

    // Content Fields - BigText Only
    {
      name: 'titleLine1',
      type: 'text',
      required: true,
      admin: {
        condition: (data) => data.Enumeration === 'Block_BigText',
        description: 'First line of title (only for BigText cards)',
      },
    },
    {
      name: 'titleLine2',
      type: 'text',
      admin: {
        condition: (data) => data.Enumeration === 'Block_BigText',
        description: 'Second line of title (optional)',
      },
    },
    {
      name: 'titleColor',
      type: 'select',
      required: true,
      options: [
        { label: 'Red', value: 'red' },
        { label: 'Blue', value: 'blue' },
        { label: 'Green', value: 'green' },
      ],
      admin: {
        condition: (data) => data.Enumeration === 'Block_BigText',
      },
    },

    // Content Fields - DescText, Video, Image
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        condition: (data) => ['Block_DescText', 'Block_Video', 'Block_Image'].includes(data.Enumeration),
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        condition: (data) => ['Block_DescText', 'Block_Video', 'Block_Image'].includes(data.Enumeration),
      },
    },
    {
      name: 'category',
      type: 'text',
      required: true,
      admin: {
        condition: (data) => ['Block_Video', 'Block_Image'].includes(data.Enumeration),
      },
    },

    // Media Fields - Image Only
    {
      name: 'imageSrc',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        condition: (data) => data.Enumeration === 'Block_Image',
      },
    },
    {
      name: 'imageAlt',
      type: 'text',
      admin: {
        condition: (data) => data.Enumeration === 'Block_Image',
      },
    },

    // Media Fields - Video Only
    {
      name: 'videoWebm',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        condition: (data) => data.Enumeration === 'Block_Video',
        description: 'WebM video file',
      },
    },
    {
      name: 'videoMp4',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data) => data.Enumeration === 'Block_Video',
        description: 'MP4 video file (fallback)',
      },
    },

    // Button & Link Fields
    {
      name: 'buttonText',
      type: 'text',
      admin: {
        description: 'Button text (leave empty for no button)',
      },
    },
    {
      name: 'buttonColor',
      type: 'select',
      options: [
        { label: 'Red', value: 'red' },
        { label: 'Blue', value: 'blue' },
        { label: 'Green', value: 'green' },
      ],
      admin: {
        condition: (data) => !!data.buttonText,
      },
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
      admin: {
        condition: (data) => !!data.buttonText,
      },
    },
    {
      name: 'buttonLinkValue',
      type: 'text',
      admin: {
        condition: (data) => !!data.buttonText && data.buttonLinkType !== 'none',
        description: 'External: full URL with https://, Internal: path starting with /',
      },
    },

    // Footer Fields
    {
      name: 'footerTitle',
      type: 'text',
    },
    {
      name: 'footerDescription',
      type: 'text',
    },
  ],
}

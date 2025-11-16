import type { CollectionConfig } from 'payload'

export const Menu: CollectionConfig = {
  slug: 'menu',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'url', 'order'],
  },
  access: {
    read: () => true, // Public read access
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: {
        description: 'Menu item text (e.g., "Home", "About", "Contact")',
      },
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        description: 'URL or path (e.g., "/", "/about", "https://example.com")',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Order of appearance in menu (lower number = appears first)',
      },
    },
    {
      name: 'openInNewTab',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Open link in new tab',
      },
    },
  ],
}

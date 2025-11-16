import type { CollectionConfig } from 'payload'

export const Menu: CollectionConfig = {
  slug: 'menu',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'url', 'order'],
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

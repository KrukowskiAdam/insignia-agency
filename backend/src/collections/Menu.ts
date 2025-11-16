import type { CollectionConfig } from 'payload'

export const Menu: CollectionConfig = {
  slug: 'menu',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'url', 'order'],
  },
  access: {
    read: () => true, // Public read access
    create: ({ req: { user } }) => {
      console.log('[MENU ACCESS] Create attempt - User:', user ? `${(user as any).email} (${(user as any).role})` : 'NO USER')
      if (!user) return false
      const hasAccess = ['admin', 'editor'].includes((user as any).role)
      console.log('[MENU ACCESS] Create access:', hasAccess)
      return hasAccess
    },
    update: ({ req: { user } }) => {
      console.log('[MENU ACCESS] Update attempt - User:', user ? `${(user as any).email} (${(user as any).role})` : 'NO USER')
      if (!user) return false
      const hasAccess = ['admin', 'editor'].includes((user as any).role)
      console.log('[MENU ACCESS] Update access:', hasAccess)
      return hasAccess
    },
    delete: ({ req: { user } }) => {
      console.log('[MENU ACCESS] Delete attempt - User:', user ? `${(user as any).email} (${(user as any).role})` : 'NO USER')
      if (!user) return false
      const hasAccess = (user as any).role === 'admin'
      console.log('[MENU ACCESS] Delete access:', hasAccess)
      return hasAccess
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

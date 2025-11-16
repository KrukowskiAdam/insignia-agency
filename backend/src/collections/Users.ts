import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    disableLocalStrategy: false,
  },
  access: {
    // Allow first user creation without authentication
    create: ({ req }) => {
      // If no user is logged in, allow creation (for first admin setup)
      return true
    },
    read: () => true,
    update: ({ req: { user } }) => {
      // Users can update themselves, admins can update anyone
      if (!user) return false
      if ((user as any).role === 'admin') return true
      return {
        id: {
          equals: user.id,
        },
      }
    },
    delete: ({ req: { user } }) => {
      // Only admins can delete users
      if (!user) return false
      return (user as any).role === 'admin'
    },
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
        {
          label: 'Viewer',
          value: 'viewer',
        },
      ],
      admin: {
        description: 'Admin: full access, Editor: can create/edit, Viewer: read-only',
      },
    },
    {
      name: 'name',
      type: 'text',
      admin: {
        description: 'Full name of the user',
      },
    },
  ],
}

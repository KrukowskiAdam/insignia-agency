import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
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

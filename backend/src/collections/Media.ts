import type { CollectionConfig } from 'payload'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
})

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*', 'video/*'],
  },
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        // Upload to Cloudinary after file is saved locally
        if (operation === 'create' && doc.filename) {
          try {
            const localPath = `media/${doc.filename}`
            const result = await cloudinary.uploader.upload(localPath, {
              folder: 'insignia-media',
              public_id: doc.filename.split('.')[0],
              resource_type: 'auto',
            })
            
            // Update document with Cloudinary URL
            await req.payload.update({
              collection: 'media',
              id: doc.id,
              data: {
                url: result.secure_url,
              },
            })
          } catch (error) {
            console.error('Cloudinary upload error:', error)
          }
        }
        return doc
      },
    ],
  },
}

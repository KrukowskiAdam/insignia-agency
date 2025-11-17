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
  upload: true,
  hooks: {
    beforeChange: [
      async ({ req, data }) => {
        // Upload to Cloudinary BEFORE saving to disk
        if (req.file) {
          try {
            const fileName = req.file.name
            const fileBuffer = req.file.data
            
            console.log('🔄 Starting Cloudinary upload for:', fileName)
            
            // Upload from buffer (memory) instead of disk
            const result: any = await new Promise((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                {
                  folder: 'insignia-media',
                  public_id: fileName.split('.')[0],
                  resource_type: 'auto',
                },
                (error, result) => {
                  if (error) reject(error)
                  else resolve(result)
                }
              )
              uploadStream.end(fileBuffer)
            })
            
            console.log('✅ Cloudinary upload success:', result.secure_url)
            
            // Set Cloudinary URL instead of local path
            data.url = result.secure_url
            
          } catch (error) {
            console.error('❌ Cloudinary upload error:', error)
          }
        }
        return data
      },
    ],
  },
}

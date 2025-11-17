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
    mimeTypes: ['image/*', 'video/*'],
    disableLocalStorage: true,
    adminThumbnail: ({ doc }) => (doc.url as string) || '',
  },
  hooks: {
    beforeChange: [
      async ({ req, data }) => {
        // Upload to Cloudinary instead of local storage
        if (req.file) {
          try {
            const fileName = req.file.name
            const fileBuffer = req.file.data
            
            console.log('🔄 Starting Cloudinary upload for:', fileName)
            
            // Upload from buffer (memory) to Cloudinary
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
            
            // Store Cloudinary URL in req for afterChange hook
            // @ts-ignore
            req.cloudinaryURL = result.secure_url
            
            // Set fields for initial save
            data.url = result.secure_url
            data.filename = fileName
            data.mimeType = req.file.mimetype
            data.filesize = req.file.size
            data.width = result.width
            data.height = result.height
            
          } catch (error) {
            console.error('❌ Cloudinary upload error:', error)
            throw error // Prevent saving if upload fails
          }
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, req, operation }) => {
        // Fix URL after Payload overwrites it
        // @ts-ignore
        if (req.cloudinaryURL && operation === 'create') {
          // @ts-ignore
          const cloudinaryURL = req.cloudinaryURL
          
          // Update document with correct Cloudinary URL
          await req.payload.update({
            collection: 'media',
            id: doc.id,
            data: {
              url: cloudinaryURL,
            },
          })
          
          console.log('🔧 Fixed URL to Cloudinary:', cloudinaryURL)
        }
        return doc
      },
    ],
  },
}

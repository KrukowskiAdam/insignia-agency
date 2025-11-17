import type { Adapter } from '@payloadcms/plugin-cloud-storage/types'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
})

export const cloudinaryAdapter: Adapter = () => ({
  name: 'cloudinary',
  
  // Generate public URL for files
  generateURL: ({ filename }) => {
    // Return Cloudinary URL
    const publicId = filename.split('.')[0]
    return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/insignia-media/${publicId}`
  },

  // Handle file upload
  handleUpload: async ({ data, req }) => {
    if (!req.file) return data

    try {
      const fileName = req.file.name
      const fileBuffer = req.file.data

      console.log('🔄 Cloudinary adapter uploading:', fileName)

      // Upload to Cloudinary
      const result = await new Promise<{secure_url: string; width?: number; height?: number}>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'insignia-media',
            public_id: fileName.split('.')[0],
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result as {secure_url: string; width?: number; height?: number})
          }
        )
        uploadStream.end(fileBuffer)
      })

      console.log('✅ Cloudinary adapter success:', result.secure_url)

      // Return updated data
      return {
        ...data,
        url: result.secure_url,
        filename: fileName,
      }
    } catch (error) {
      console.error('❌ Cloudinary adapter error:', error)
      throw error
    }
  },

  // Handle file deletion
  handleDelete: async ({ filename }) => {
    try {
      const publicId = `insignia-media/${filename.split('.')[0]}`
      console.log('🗑️ Deleting from Cloudinary:', publicId)
      
      await cloudinary.uploader.destroy(publicId)
      console.log('✅ Deleted from Cloudinary')
    } catch (error) {
      console.error('❌ Cloudinary delete error:', error)
    }
  },

  // Static file handler (not used with disablePayloadAccessControl: true)
  staticHandler: async () => {
    return new Response('Not Found', { status: 404 })
  },
})

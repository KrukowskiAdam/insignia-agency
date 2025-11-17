// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Menu } from './collections/Menu'
import { Pages } from './collections/Pages'
import { Footer } from './collections/Footer'
import { cloudinaryAdapter } from './storage/cloudinaryAdapter'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Icon: {
          path: '/components/Icon#Icon',
        },
        Logo: {
          path: '/components/Logo#Logo',
        },
      },
    },
    meta: {
      titleSuffix: '- Insignia',
    },
  },
  plugins: [
    cloudStoragePlugin({
      collections: {
        media: {
          adapter: cloudinaryAdapter,
          disablePayloadAccessControl: true,
        },
      },
    }),
  ],
  collections: [Users, Media, Menu, Pages, Footer],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || 'mongodb://localhost/insignia',
  }),
  sharp,
  cors: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://insignia-agency-production.up.railway.app',
    'https://frontend-isnisgnias-projects.vercel.app',
    'https://*.vercel.app',
    'https://*.railway.app',
    'https://*.onrender.com',
  ],
  csrf: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://insignia-agency-production.up.railway.app',
    'https://frontend-isnisgnias-projects.vercel.app',
    'https://*.vercel.app',
    'https://*.railway.app',
    'https://*.onrender.com',
  ],
})

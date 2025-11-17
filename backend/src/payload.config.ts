// storage-adapter-import-placeholder
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Cards } from './collections/Cards'
import { Menu } from './collections/Menu'
import { Pages } from './collections/Pages'

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
  collections: [Users, Media, Cards, Menu, Pages],
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
    'https://*.vercel.app',
    'https://*.railway.app',
    'https://*.onrender.com',
  ],
  csrf: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://insignia-agency-production.up.railway.app',
    'https://*.vercel.app',
    'https://*.railway.app',
    'https://*.onrender.com',
  ],
  plugins: [
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.PAYLOAD_BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})

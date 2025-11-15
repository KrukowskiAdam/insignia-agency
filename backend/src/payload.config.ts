// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Cards } from './collections/Cards'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Cards],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: process.env.DATABASE_URI && process.env.DATABASE_URI.startsWith('mongodb')
    ? mongooseAdapter({
        url: process.env.DATABASE_URI,
      })
    : sqliteAdapter({
        client: {
          url: process.env.DATABASE_URI || 'file:./payload.db',
        },
      }),
  sharp,
  cors: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://*.vercel.app',
    'https://frontend-9av66b71p-isnisgnias-projects.vercel.app',
    'https://frontend-bcwf0hq9d-isnisgnias-projects.vercel.app',
  ],
  csrf: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://*.vercel.app',
    'https://frontend-9av66b71p-isnisgnias-projects.vercel.app',
    'https://frontend-bcwf0hq9d-isnisgnias-projects.vercel.app',
  ],
  plugins: [
    // storage-adapter-placeholder
  ],
})

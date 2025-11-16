import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    // Try to get user from request
    const user = (req as any).user
    
    // Get cookies
    const cookies = req.cookies.getAll()
    
    // Get headers
    const headers = {
      authorization: req.headers.get('authorization'),
      cookie: req.headers.get('cookie'),
      origin: req.headers.get('origin'),
      referer: req.headers.get('referer'),
    }
    
    console.log('=== DEBUG SESSION ===')
    console.log('User:', user ? `${user.email} (${user.role})` : 'NO USER')
    console.log('Cookies:', cookies)
    console.log('Headers:', headers)
    console.log('====================')
    
    return NextResponse.json({
      user: user ? { email: user.email, role: user.role, id: user.id } : null,
      cookiesCount: cookies.length,
      hasPayloadToken: cookies.some(c => c.name.includes('payload-token')),
      headers,
    })
  } catch (error) {
    console.error('[DEBUG SESSION ERROR]', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

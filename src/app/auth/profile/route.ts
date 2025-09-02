import { NextResponse } from 'next/server'
import { Auth0Client } from '@auth0/nextjs-auth0/server'

export async function GET() {
  try {
    // Deriva domain e base URL dalle env già usate nel progetto
    const issuer = process.env.AUTH0_ISSUER_BASE_URL
    const baseUrl = process.env.AUTH0_BASE_URL

    const domain = issuer ? new URL(issuer).host : undefined
    const appBaseUrl = baseUrl

    const auth0 = new Auth0Client({ domain, appBaseUrl })
    const session = await auth0.getSession()

    if (!session || !session.user) {
      return NextResponse.json({}, { status: 200 })
    }
    return NextResponse.json(session.user)
  } catch (err) {
    // In caso di configurazione mancante restituisci oggetto vuoto
    return NextResponse.json({}, { status: 200 })
  }
}

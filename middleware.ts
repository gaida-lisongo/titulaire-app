import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Obtenir le token depuis les cookies
  const token = request.cookies.get('auth-token')?.value

  // Chemin de la requête actuelle
  const { pathname } = request.nextUrl

  // Chemins publics qui ne nécessitent pas d'authentification
  const publicPaths = [
    '/auth'
  ]

  // Vérifier si le chemin actuel est un chemin public
  const isPathPublic = publicPaths.some(path => pathname.startsWith(path))

  // Vérifier si la requête contient des ressources statiques
  const isStaticResource = pathname.match(/\.(jpg|jpeg|png|gif|svg|css|js)$/i)

  // Si l'utilisateur accède à un chemin public ou à une ressource statique, on le laisse passer
  if (isPathPublic || isStaticResource) {
    return NextResponse.next()
  }

  // Si le token n'existe pas, rediriger vers /auth
  if (!token) {
    const url = new URL('/auth', request.url)
    url.searchParams.set('callbackUrl', encodeURI(pathname))
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Configurer les chemins sur lesquels le middleware s'applique
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. /_vercel (Vercel internals)
     * 5. Static files (e.g. /favicon.ico, /sitemap.xml, /robots.txt)
     */
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
}
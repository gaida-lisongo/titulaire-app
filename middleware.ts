import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Obtenir le token depuis les cookies
  const token = request.cookies.get('auth-token')?.value;
  
  // Chemin de la requête actuelle
  const { pathname } = request.nextUrl;
  
  console.log('Middleware running on path:', pathname);
  
  // Chemins publics qui ne nécessitent pas d'authentification
  const publicPaths = [
    '/auth',  // Ce chemin est accessible publiquement (l'URL réelle, pas le chemin du fichier)
  ];
  
  // Routes à ignorer (API, ressources statiques, etc.)
  const ignoredRoutes = [
    '/api/',
    '/_next/',
    '/favicon.ico',
    '/images/',
    '/fonts/',
    '/.well-known/'
  ];
  
  // Vérifier si le chemin doit être ignoré
  const shouldIgnore = ignoredRoutes.some(route => pathname.startsWith(route));
  if (shouldIgnore) {
    console.log('Ignoring path:', pathname);
    return NextResponse.next();
  }
  
  // Vérifier si le chemin actuel est un chemin public
  const isPathPublic = publicPaths.some(path => pathname === path || pathname.startsWith(path + '/'));
  
  // Si c'est un chemin public, on laisse passer
  if (isPathPublic) {
    console.log('Public path detected:', pathname);
    return NextResponse.next();
  }
  
  // Si le token n'existe pas, rediriger vers /auth
  if (!token) {
    console.log(`Redirecting from ${pathname} to /auth because token is missing`);
    const url = new URL('/auth', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

// Configurer les chemins sur lesquels le middleware s'applique de façon plus précise
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /images (static files)
     * 4. All static files with extensions
     */
    '/((?!api|_next|static|images|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp|js|css)).*)'
  ],
};
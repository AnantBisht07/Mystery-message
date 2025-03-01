import type { NextRequest } from 'next/server'
export {default} from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt'


// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({req: request})
    const url = request.nextUrl

    if(token && 
        ( // means agr token hai, to in route pai kyu jare ho? like signin user rho to kyu jana?
            // If the user is logged in, don't let them access auth routes
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify') ||
            url.pathname.startsWith('/')
        )
    ) {
        // return NextResponse.redirect(new URL('/dashboard', request.url))
    }

//   return NextResponse.redirect(new URL('/home', request.url))
  // Default redirection (if needed)
  
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*', // means dashboard ke pass jitne bhi path honge sbme
    '/verify/:path*'
  ]
}
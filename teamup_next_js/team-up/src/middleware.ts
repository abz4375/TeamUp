import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '../auth'
/*
import { RequestQuote } from '@mui/icons-material'

// export { auth as middleware } from "./auth"
// export function middleware(request: NextRequest) {
//     if (request.nextUrl.pathname.startsWith('/log-in')) {
//         console.log('/log-in route detected')
//     //   return NextResponse.rewrite(new URL('/about-2', request.url))
//     }

//     // if (request.nextUrl.pathname.startsWith('/dashboard')) {
//     //   return NextResponse.rewrite(new URL('/dashboard/user', request.url))
//     // }
//   }
// export { default } from 'next-auth/middleware'

// export default auth((req) => {
//     if (req.nextUrl.pathname === '/' || req.nextUrl.pathname === '/log-in') {
//         console.log('path is public');
//     }
//     else {
//         if (!req.auth) {
//             const url = req.url.replace(req.nextUrl.pathname, "/log-in")
//             return Response.redirect(url)
//         }
//         console.log('path is private');
//         // const session = await auth();
//         // if (!session?.user) {
//         //     console.log('Please Sign In First');
//         //     return NextResponse.rewrite(new URL('/log-in', req.url))
//         // }
//     }
// })
*/

export default async function middleware(req:NextRequest) {
    const session = await auth();
    const { pathname } = req.nextUrl;

    if (!session?.user && (pathname.startsWith('/api') || pathname.startsWith('/home')) && !pathname.startsWith('/api/auth/callback')) {
        const url = req.nextUrl.clone();
        url.pathname = '/log-in';
        return NextResponse.redirect(url);
    }

    if (session?.user && pathname.startsWith('/log-in')) {
        const url = req.nextUrl.clone();
        url.pathname = '/home';
        return NextResponse.redirect(url);
    }

    if (pathname == '/') {
        const url = req.nextUrl.clone();
        url.pathname = '/log-in';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}
/*
// export const config = {
//     matcher: [
      
//         // '/'
//         // missing: [
//         //   { type: 'header', key: 'next-router-prefetch' },
//         //   { type: 'header', key: 'purpose', value: 'prefetch' },
//         // ],
//     //   ,
   
      
//     //     '/home/:path*'
//     //     // has: [
//     //     //   { type: 'header', key: 'next-router-prefetch' },
//     //     //   { type: 'header', key: 'purpose', value: 'prefetch' },
//     //     // ],
//     //   ,
   
      
//         '/api/:path*'
//         // has: [{ type: 'header', key: 'x-present' }],
//         // missing: [{ type: 'header', key: 'x-missing', value: 'prefetch' }],
//       ,
//     ],
//   }
*/
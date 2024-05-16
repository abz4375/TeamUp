import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './auth'
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

export default auth(async(req) => {
    // console.log(req.nextUrl.pathname)
    // if(req.auth && req.nextUrl.pathname === '/log-in')
    // if (!req.auth && (req.nextUrl.pathname.startsWith('/api') || req.nextUrl.pathname.startsWith('/home') )) {
    //     const url = req.url.replace(req.nextUrl.pathname, "/log-in")
    //     return Response.redirect(url)
    // } 

    // const fetchData = async () => {
        const session = await auth();
        if (!session?.user && (req.nextUrl.pathname.startsWith('/api') || req.nextUrl.pathname.startsWith('/home')) && (!req.nextUrl.pathname.startsWith('/api/auth/callback')) ) {
            const url = req.url.replace(req.nextUrl.pathname, "/log-in")
            return Response.redirect(url)
        }
        if(session?.user && req.nextUrl.pathname.startsWith('/log-in')) {
            const url = req.url.replace(req.nextUrl.pathname, "/home")
            return Response.redirect(url)
        }
})

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
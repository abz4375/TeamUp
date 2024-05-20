// import { NextRequest, NextResponse } from "next/server";

// export async function GET(request: NextRequest) {
//         try {

//         const queryParams = new URLSearchParams(request.nextUrl.searchParams);
//         const code = queryParams.get('code');
//         console.log("code is: ", code);

//         return NextResponse.json({ message: 'User authenticated !'}, { status: 200 });
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ message: 'Error authenticating user' }, { status: 500 });
//     } finally {
//             // Close the connection if needed (optional)
//         // await mongoose.disconnect();
//     }
// }

// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// const handler = NextAuth({
//   // Configure your Google provider credentials here
//   providers: [
//     GoogleProvider({
//       clientId: process.env.AUTH_GOOGLE_ID,
//       clientSecret: process.env.AUTH_GOOGLE_SECRET,
//     }),
//   ],
//   // Optional: Customize session handling (e.g., JWT)
//   // ... other NextAuth options
//   callbacks:{
//     async signIn({user}) {
//         console.log("name is: ",user.name)
//         return true;
//     },
//   }
// });

// export {handler as GET, handler as POST}

// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.AUTH_GOOGLE_ID,
//       clientSecret: process.env.AUTH_GOOGLE_SECRET,
//     }),
//   ],
// };
// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
import { handlers } from "../../../../../auth";
export const { GET, POST } = handlers

// export { GET, POST } from "../../../../../auth"; // change the route to the auth.ts path if it's not the same

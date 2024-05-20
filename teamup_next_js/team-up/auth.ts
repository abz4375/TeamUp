import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
// import Nodemailer from "next-auth/providers/nodemailer"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  // callbacks:{
  //   async signIn({user}) {
  //     console.log(user.name)  
  //     return true;
  //   },
  // }
})
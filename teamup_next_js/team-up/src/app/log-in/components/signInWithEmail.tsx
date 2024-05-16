"use server";
import { signIn } from '../../../../auth'

export const signInEmailBtnFunc = async () => {
  // console.log('submit initialised')
  await signIn("nodemailer", {redirectTo:'/home'});
};

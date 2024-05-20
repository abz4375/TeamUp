"use server";
import { signIn } from '../../../../auth'

export const signInBtnFunc = async () => {
  // console.log('submit initialised')
  return await signIn("google", {redirectTo:'/home'});
};

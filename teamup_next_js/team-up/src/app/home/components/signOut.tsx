"use server";
import { signOut } from "../../../../auth";

export const signOutBtnFunc = async () => {
  await signOut({redirectTo:'/log-in'});
};

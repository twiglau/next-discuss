"use server";

import { signIn } from "@/server/auth";

export const signInAction = async () => {
  return signIn("github");
};

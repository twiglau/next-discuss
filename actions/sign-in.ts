"use server";

import { signIn } from "@/server/auth";
// import { trpcServerCaller } from "@/trpc-caller/server";

export const signInAction = async () => {
  return signIn("github");
};

"use server";

import { signOut } from "@/server/auth";
// import { trpcServerCaller } from "@/trpc-caller/server";

export const signOutAction = async () => {
  return signOut();
};

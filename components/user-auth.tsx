"use client";

import SigninButton from "./auth/signin-button";
import SignoutButton from "./auth/signout-button";
import React from "react";
import UserAvatar from "./user-avatar";
import { Spinner } from "@heroui/react";
import { useSession } from "next-auth/react";

export default function App() {
  const { data: session, status } = useSession();
  let userInfo: React.ReactNode = null
  if(status === 'loading') {
    userInfo = <div>
      <Spinner />
    </div>
  }else if(session?.user) {
    userInfo = <div>
      <UserAvatar />
    </div>
  } else {
    userInfo = <>
        <div className="hidden lg:flex">
          <SigninButton />
        </div>
        <div>
          <SignoutButton />
        </div>
    </>
  }
  return userInfo;
}

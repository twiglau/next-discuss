"use client";

import SigninButton from "./auth/signin-button";
import SignoutButton from "./auth/signout-button";
import React from "react";
import UserAvatar from "./user-avatar";
import { NavbarItem } from "@heroui/navbar";
import { useSession } from "next-auth/react";


export default function App() {
//   const session = await auth();
  // 和auth 区别，没有用到 cookies, 在build时，app/page.tsx 在没有其他因素影响时，变为静态渲染
  const { data: session } = useSession();
  let userInfo: React.ReactNode = null
  if(session?.user) {
    userInfo = <NavbarItem>
      <UserAvatar />
    </NavbarItem>
  } else {
    userInfo = <>
        <NavbarItem className="hidden lg:flex">
          <SigninButton />
        </NavbarItem>
        <NavbarItem>
          <SignoutButton />
        </NavbarItem>
    </>
  }
  return userInfo;
}

"use client";

import { Avatar } from "@heroui/avatar";
import { useSession } from "next-auth/react";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import SignoutButton from "./auth/signout-button";

export default function UserAvatar() {
  const { data: session } = useSession();

  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <Avatar
          src={session?.user?.image || "https://i.pravatar.cc/150?u=a042581f4e29026024d"}
          name={session?.user?.name || "User"}
          className="cursor-pointer"
        />
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2">
          <SignoutButton />
        </div>
      </PopoverContent>
    </Popover>
  );
}
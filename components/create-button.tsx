"use client";

import { Button } from "@heroui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type CreateButtonProps = {
  children:React.ReactNode;
  path:string;
}

export default function CreateButton({children, path}: CreateButtonProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const onCreate = () => {
     if(!session?.user) {
       router.replace('/api/auth/signin', {})
       return
     } 
     router.push(path)
  }
  return (
    <Button className="ml-auto max-w-20" color="secondary" variant="bordered"  onPress={onCreate}>
      {children}
    </Button>
  )
}
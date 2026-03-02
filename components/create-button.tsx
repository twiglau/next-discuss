"use client";

import { Button } from "@heroui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function CreateButton() {
  const router = useRouter()
  const { data: session } = useSession()
  const onCreate = () => {
     if(!session?.user) {
       router.replace('/api/auth/signin', {})
       return
     } 
     router.push('/new')
  }
  return (
    <Button color="secondary" variant="bordered"  onPress={onCreate}>
      创建
    </Button>
  )
}
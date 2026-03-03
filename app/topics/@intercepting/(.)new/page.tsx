"use client";

import BackableModal from "./backable-modal";
import CreatePost from "@/app/topics/new/page"

export default function InterceptingNewPage() {
  return (
    <BackableModal>
      {({close}) => (
        <CreatePost isTitle={false} onClose={close}/>
      )}
    </BackableModal>   
  )
}
"use client";

import BackableModal from "./backable-modal";
import CreateTopic from "@/app/new/page"

export default function InterceptingNewPage() {
  return (
    <BackableModal>
      {({close}) => (
        <CreateTopic isTitle={false} onClose={close}/>
      )}
    </BackableModal>   
  )
}
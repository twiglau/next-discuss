"use client";

import React from "react"
import { useRouter } from "next/navigation"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@heroui/react";

export default function BackableModal(props: {children: (args: {close: () => void}) => React.ReactNode}) {
    const { children } = props
    const router = useRouter()

    return (
      <Modal 
        isOpen={true} 
        onOpenChange={(open) => {
          if (!open) {
            router.back();
          }
        }}
        defaultOpen={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">创建帖子</ModalHeader>
              <ModalBody>
                {children({close: onClose})}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    )
}
"use client";

import React from "react"
import { useRouter } from "next/navigation"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from "@heroui/react";

export default function BackableModal(props: React.PropsWithChildren) {
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
              <ModalHeader className="flex flex-col gap-1">创建话题</ModalHeader>
              <ModalBody>
                {children}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button color="primary" onPress={onClose}>
                  创建
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    )
}
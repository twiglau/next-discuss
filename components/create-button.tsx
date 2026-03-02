"use client";

import { Button } from "@heroui/react";
import Link from "next/link";


export default function CreateButton() {
  return (
    <Button color="secondary" variant="bordered" as={Link} href="/new">
      创建
    </Button>
  )
}
"use client";

import { Pagination } from "@heroui/pagination";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function CommentListPagination({ 
  totalPages, 
  currentPage 
}: { 
  totalPages: number; 
  currentPage: number; 
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Pagination
      total={totalPages}
      initialPage={currentPage}
      onChange={handlePageChange}
      color="primary"
      variant="flat"
    />
  );
}

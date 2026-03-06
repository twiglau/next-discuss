"use client";

import { Listbox, ListboxItem } from "@heroui/react";

export default function PostList() {
  return (
    <Listbox
      aria-label="TOP Post List"
      className="p-0 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 bg-content1 max-w-[300px] overflow-visible shadow-small rounded-medium"
      itemClasses={{
        base: "px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/80",
      }}
    >
      <ListboxItem
        key="issues"
        endContent={"lafdkalkdfjakdfk"}
        startContent={"2222222"}
      >
        Issues
      </ListboxItem>
    </Listbox>
  );
}

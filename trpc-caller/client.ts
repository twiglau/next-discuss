import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "@/server/trpc/router";
import { httpBatchLink } from "@trpc/client";

const trpcClientReact = createTRPCReact<AppRouter>({});

const trpcPureClient = trpcClientReact.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
    }),
  ],
});

export { trpcClientReact, trpcPureClient };
export type { AppRouter };

import { NextRequest } from "next/server";
import { appRouter } from "@/server/trpc/router";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { auth } from "@/server/auth";

const handler = (request: NextRequest) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: async () => {
      const session = await auth();
      return {
        session,
      };
    },
  });
};

export { handler as GET, handler as POST };

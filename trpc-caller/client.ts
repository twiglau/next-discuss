import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "@/server/trpc/router";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";

// 1. 定义 React 封装的客户端（这里的类型会自动带出服务端配置的 transformer 类型）
const trpcClientReact = createTRPCReact<AppRouter>({});

// 2. 创建真正的运行客户端
const trpcPureClient = trpcClientReact.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      // 这里必须再次指定 superjson，否则网络传输层不知道该如何编解码
      transformer: superjson,
    }),
  ],
});

export { trpcClientReact, trpcPureClient };
export type { AppRouter };

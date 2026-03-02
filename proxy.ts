import NextAuth from "next-auth";
import { authConfig } from "@/server/auth/config";

const { auth: proxy } = NextAuth(authConfig);

export default proxy;

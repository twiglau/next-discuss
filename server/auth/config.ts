import { type NextAuthConfig, type DefaultSession } from "next-auth";
import GitHub from "next-auth/providers/github";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
    };
  }
}

const authConfig: NextAuthConfig = {
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

export { authConfig };

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import { syncUserToSupabase } from "./actions/sync-user.action";
import { logger } from "@/lib/logger";
import { createCacheClient } from "@/lib/supabase/server";
import type { RoleOption } from "./constants";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!googleClientId || !googleClientSecret) {
  throw new Error("Missing Google OAuth environment variables.");
}

const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile, user, trigger: _trigger }) {
      if (account && (profile || user)) {
        const userId = profile?.sub ?? user?.id ?? token.sub;
        const email = profile?.email ?? user?.email ?? token.email;
        const name = profile?.name ?? user?.name ?? token.name;

        if (userId && email) {
          syncUserToSupabase({
            id: userId,
            email: email as string,
            name: (name as string) || null,
            provider: account.provider,
          }).catch((error) => {
            logger.error('Failed to sync user to Supabase', { error, userId });
          });
        }

        token.sub = userId;
        token.email = email;
        token.name = name;
        token.provider = account.provider;
      }

      if (token.sub) {
        try {
          const supabase = createCacheClient();
          const { data } = await supabase
            .from('users')
            .select('role')
            .eq('user_id', token.sub)
            .single();

          token.role = (data?.role as RoleOption) ?? null;
        } catch (error) {
          logger.warn('Failed to fetch user role', { error, userId: token.sub });
          token.role = null;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.email = token.email ?? session.user.email;
        session.user.name = (token.name as string) ?? session.user.name;
        // @ts-expect-error - extending session.user with role
        session.user.role = token.role ?? null;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

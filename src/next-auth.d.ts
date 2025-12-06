import "next-auth";
import type { DefaultSession } from "next-auth";

type UserRole = 'applicant' | 'recruiter' | 'admin' | 'techno_warlord' | null;

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: DefaultSession["user"] & {
      id?: string;
      role?: UserRole;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    provider?: string;
  }
}

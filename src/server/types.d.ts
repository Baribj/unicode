import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

// Extend the JWT and Session interfaces to include sessionId
declare module "next-auth/jwt" {
  interface JWT {
    sessionId?: string; // Add custom sessionId field
    jti?: string; // Optionally include jti
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      sessionId?: string; // Add sessionId to the session
      id?: string; // Optionally include user id or other fields
    } & DefaultSession["user"];
  }

  interface User {
    id: string; // Ensure user object contains an id field (or other fields as necessary)
    sessionId?: string; // Add sessionId to the User interface
  }
}

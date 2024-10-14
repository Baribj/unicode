import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { UserModel } from "@/schema/User";
import { getDb } from "@/server/db";
import { SessionModel } from "@/schema/Session";
import { ObjectId } from "mongodb";
import { error } from "console";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials) return null;

        const db = await getDb();

        const userDocument = await db.collection<UserModel>("users").findOne({
          email: credentials.email,
        });

        if (!userDocument) {
          return null;
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          userDocument.password
        );

        if (!isCorrectPassword) {
          return null;
        }

        const now = new Date();

        const sessionId = new ObjectId();

        await db.collection<SessionModel>("sessions").insertOne({
          _id: sessionId,
          userId: new ObjectId(userDocument._id),
          revoked: false,
          createdAt: now,
          updatedAt: now,
        });

        return {
          id: userDocument._id.toString(),
          name: userDocument.name,
          email: userDocument.email,
          sessionId: sessionId.toString(),
        };
      },
    }),
  ],
  pages: {
    signIn: "/accounts/log-in",
    newUser: "/accounts/sign-up",
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (token.sessionId) {
        const db = await getDb();

        const sessionDocument = await db
          .collection<SessionModel>("sessions")
          .findOne({
            _id: new ObjectId(token.sessionId),
            revoked: false,
          });

        if (!sessionDocument) {
          throw new Error();
        }
      } else {
        token = { ...token, id: user.id, sessionId: user.sessionId };
      }

      return token;
    },

    async session({ session, token }) {
      if (token.id) {
        return { ...session, user: { ...session.user, id: token.id } };
      }
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      const db = await getDb();
      if (token.sessionId) {
        await db
          .collection<SessionModel>("sessions")
          .updateOne(
            { _id: new ObjectId(token.sessionId) },
            { $set: { revoked: true } }
          );
      }
    },
  },
};

export default NextAuth(authOptions);

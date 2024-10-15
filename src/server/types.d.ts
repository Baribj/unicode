import { DefaultSession } from "next-auth";

declare module "next-auth/jwt" {
  interface JWT {
    sessionId?: string;
    jti?: string;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      sessionId?: string;
      id?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    sessionId?: string;
  }
}

declare module "http" {
  interface Server {
    io?: SocketIOServer;
  }
}

declare module "next" {
  interface NextApiRequest {
    socket: {
      server: HTTPServer & {
        io: SocketIOServer;
      };
    };
  }
}

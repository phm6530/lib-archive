import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      nickname: string;
      role: "admin" | "super";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    nickname: string;
    role: "admin" | "super";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    nickname: string;
    role: "admin" | "super";
  }
}

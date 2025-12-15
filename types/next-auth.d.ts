import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      image: string;
    };
    token?: JWT;
  }
}
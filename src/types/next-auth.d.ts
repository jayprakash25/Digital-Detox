import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
  }

  interface Profile {
    sub: string;
    name: string;
    email: string;
    picture: string;
  }

  interface Session {
    user: {
      id?: string;
      name?: string;
      email?: string;
      image?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    name?: string;
    email?: string;
    picture?: string;
  }
}

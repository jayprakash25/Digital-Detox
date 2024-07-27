import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
callbacks:{
  async session({ session, token }) {
    if (token) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.image = token.picture;
    }

    return session;
  },
  async jwt({ token, account, profile }) {
    if (account?.provider === "google" && profile) {
      console.log(profile)
      token.id = profile.sub;
      token.name = profile.name;
      token.email = profile.email;
      token.picture = profile.picture;
    }

    return token;
  },
},
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

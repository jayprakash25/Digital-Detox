import dbConnection from "@/lib/db";
import { UserModel } from "@/models/User";
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
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        await dbConnection();

        if (profile?.sub) {
          const existingUser = await UserModel.findOne({
            googleId: profile.sub,
          });
  
          if (!existingUser) {
            // Create a new user if one doesn't already exist
            await UserModel.create({
              googleId: profile.sub,
              name: profile.name,
              email: profile.email,
              image: profile.picture,
              interests: [],
            });
          } else {
            // Update the user if they already exist
            await UserModel.findOneAndUpdate(
              { googleId: profile.sub },
              {
                name: profile.name,
                email: profile.email,
                image: profile.picture,
                updatedAt: new Date(),
              }
            );
          }
          return true;
        } else {
          console.error('Profile sub is null or undefined');
          return false; // Cancel sign-in if the profile sub is invalid
        }
      }
      return false;
    },
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
        console.log(profile);
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

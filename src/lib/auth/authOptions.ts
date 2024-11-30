import { kv } from "@vercel/kv";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { WishlistKey } from "../wishlists/constants";
import { UserDB } from "./types";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile: async (profile) => {
        // logExpiry(profile.exp);
        const userId = `uid-${profile.sub}`;
        const user = {
          id: userId,
          name: profile.name,
          firstname: profile.given_name,
          lastname: profile.family_name,
          email: profile.email,
          image: profile.picture,
          moreStuff: {
            ...profile,
          },
        };
        const { id, name, firstname, lastname, email, image } = user;
        await kv.hset(`${WishlistKey.User}:${user.id}`, {
          id,
          name,
          firstname,
          lastname,
          email,
          image,
        } satisfies UserDB);
        return user;
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
        },
      };
    },
  },
} satisfies NextAuthOptions;

export const logExpiry = (exp: number) => {
  const expireDate = new Date(0);
  expireDate.setUTCSeconds(exp);
  const now = new Date();
  const ms = expireDate.getTime() - now.getTime();
  const seconds = Math.round(ms / 1000);
  const minutes = Math.round(seconds / 60);
  const timeFormatter = new Intl.RelativeTimeFormat("sv-SE");
  const remainingSeconds = timeFormatter.format(seconds, "second");
  const remainingMinutes = timeFormatter.format(minutes, "minute");
  console.log(`Går ut ${remainingMinutes} - (${remainingSeconds})`);
};

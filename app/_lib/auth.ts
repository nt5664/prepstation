import { headers } from "next/headers";
import { betterAuth, TwitchProfile } from "better-auth";
import { unstable_noStore as noStore } from "next/cache";
import { createUser, getUser } from "@/app/_lib/data/user-service";

export const auth = betterAuth({
  appName: "PrepStation",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  user: {
    additionalFields: {
      platformId: {
        type: "string",
      },
      internalId: {
        type: "string",
      },
      role: {
        type: "string",
      },
      status: {
        type: "string",
      },
    },
  },
  socialProviders: {
    twitch: {
      clientId: process.env.TWITCH_CLIENT_ID as string,
      clientSecret: process.env.TWITCH_CLIENT_SECRET as string,
      getUserInfo: async (token) => {
        if (!token.idToken) return null;

        const profile = parseJwt(token.idToken) as TwitchProfile;
        const dbUser =
          (await getUser(profile.sub)) ??
          (await createUser(profile.sub, profile.preferred_username));

        return {
          user: {
            id: profile.sub,
            platformId: profile.sub,
            internalId: dbUser.id,
            role: dbUser.role,
            status: dbUser.status,
            name: profile.preferred_username,
            image: profile.picture,
            email: "REDACTED",
            emailVerified: profile.email_verified,
          },
          data: profile,
        };
      },
    },
  },
});

export async function getServerSession() {
  noStore();

  const headersObj: Record<string, string> = {};
  for (const [k, v] of await headers()) {
    headersObj[k] = v;
  }

  return await auth.api.getSession({ headers: headersObj });
}

function parseJwt(token: string) {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}

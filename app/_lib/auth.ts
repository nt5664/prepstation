import { headers } from "next/headers";
import { betterAuth, TwitchProfile } from "better-auth";
import { createUser, getUser } from "@/app/_lib/data-service";

export const auth = betterAuth({
  appName: "PrepStation",
  baseURL: process.env.APP_BASE_URL,
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

        console.log(dbUser);

        return {
          user: {
            id: profile.sub,
            platformId: profile.sub,
            internalId: dbUser.id,
            role: dbUser.role,
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
  const headersObj: Record<string, string> = {};
  for (const [k, v] of await headers()) {
    headersObj[k] = v;
  }

  return await auth.api.getSession({ headers: headersObj });
}

function parseJwt(token: string) {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}

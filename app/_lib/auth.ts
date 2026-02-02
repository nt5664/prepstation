import { headers } from "next/headers";
import { betterAuth, TwitchProfile } from "better-auth";
import { unstable_noStore as noStore } from "next/cache";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { randomUUID } from "crypto";
import { prisma } from "@/app/_lib/prisma";

export const auth = betterAuth({
  appName: "PrepStation",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  databaseHooks: {
    user: {
      create: {
        before: async (data) => {
          return {
            data: {
              ...data,
              id: data.id ?? randomUUID(),
              role: data.role ?? "USER",
              status: data.status ?? "ACTIVE",
            },
          };
        },
      },
    },
  },
  user: {
    additionalFields: {
      platformId: {
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
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["twitch"],
      allowDifferentEmails: true,
    },
  },
  session: {
    storeSessionInDatabase: true,
    cookieCache: { enabled: false },
  },
  socialProviders: {
    twitch: {
      clientId: process.env.TWITCH_CLIENT_ID as string,
      clientSecret: process.env.TWITCH_CLIENT_SECRET as string,
      getUserInfo: async (token) => {
        if (!token.idToken) return null;

        const profile = parseJwt(token.idToken) as TwitchProfile;

        return {
          user: {
            id: profile.sub,
            platformId: profile.sub,
            name: profile.preferred_username,
            image: profile.picture,
            email: `${profile.sub}@redacted`,
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

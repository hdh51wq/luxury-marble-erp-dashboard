import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer } from "better-auth/plugins";
import { db } from "@/db/index";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [bearer()],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes cache
    },
  },
  trustedOrigins: [process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000"],
});

// Session validation helper
export async function getCurrentUser(request) {
  const session = await auth.api.getSession({ 
    headers: request?.headers 
  });
  return session?.user || null;
}
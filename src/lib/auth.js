import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { bearer } from "better-auth/plugins";
import { getMongoDb, getMongoClient } from "@/db/mongodb";

let authInstance = null;

async function getAuthInstance() {
  if (authInstance) {
    return authInstance;
  }

  const db = await getMongoDb();
  const client = await getMongoClient();

  authInstance = betterAuth({
    database: mongodbAdapter(db, {
      client: client,
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

  return authInstance;
}

export const auth = {
  get handler() {
    return async (request) => {
      const instance = await getAuthInstance();
      return instance.handler(request);
    };
  },
  get api() {
    return new Proxy({}, {
      get: (target, prop) => {
        return async (...args) => {
          const instance = await getAuthInstance();
          return instance.api[prop](...args);
        };
      },
    });
  },
};

// Session validation helper
export async function getCurrentUser(request) {
  const instance = await getAuthInstance();
  const session = await instance.api.getSession({ 
    headers: request?.headers 
  });
  return session?.user || null;
}
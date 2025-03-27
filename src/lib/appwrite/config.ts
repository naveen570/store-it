import { env } from "@/lib/env";

export const appwriteConfig = {
  projectId: env.NEXT_PUBLIC_APPWRITE_PROJECT,
  endpoint: env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  usersCollection: env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION,
  filesCollection: env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION,
  bucket: env.NEXT_PUBLIC_APPWRITE_BUCKET,
  database: env.NEXT_PUBLIC_APPWRITE_DATATBASE,
  key: env.NEXT_APPWRITE_KEY,
};

import { z } from "zod";
const envSchema = z.object({
  NEXT_PUBLIC_APPWRITE_PROJECT: z.string(),
  NEXT_PUBLIC_APPWRITE_DATATBASE: z.string(),
  NEXT_PUBLIC_APPWRITE_USERS_COLLECTION: z.string(),
  NEXT_PUBLIC_APPWRITE_FILES_COLLECTION: z.string(),
  NEXT_PUBLIC_APPWRITE_BUCKET: z.string(),
  NEXT_PUBLIC_APPWRITE_ENDPOINT: z.string(),
  NEXT_APPWRITE_KEY: z.string(),
});
// export const env = envSchema.parse(process.env);
export const env = envSchema.safeParse(process.env).data;
console.log(env);

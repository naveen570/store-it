"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { avatarPlaceholderURL } from "@/constants";
import { actionClient } from "@/lib/safe-action";
import { userNotFoundError } from "@/lib/errors";
import { redirect } from "next/navigation";
import { ID, Query } from "node-appwrite";
import { userSchema } from "@/lib/schema";
import { cookies } from "next/headers";
import { z } from "zod";

const handleError = (error: unknown, message: string): never => {
  console.error(message, error);
  throw new Error(message);
};

const emailSchema = z.object({ email: z.string().email() });
const createAccountSchema = z.object({
  email: z.string().email(),
  fullName: z.string(),
});
const verifyOTPSchema = z.object({ accountId: z.string(), otp: z.string() });
export const getUserByEmail = actionClient
  .schema(emailSchema)
  .action(async ({ parsedInput: { email } }) => {
    try {
      const client = await createAdminClient();
      const { documents } = await client.databases.listDocuments(
        appwriteConfig.database,
        appwriteConfig.usersCollection,
        [Query.equal("email", email)],
      );
      return documents[0] || null;
    } catch (error) {
      handleError(error, "Failed to fetch user by email");
    }
  });

export const sendEmailOTP = actionClient
  .schema(emailSchema)
  .action(async ({ parsedInput: { email } }) => {
    try {
      const { account } = await createAdminClient();
      const session = await account.createEmailToken(ID.unique(), email);
      return { accountId: session.userId };
    } catch (error) {
      handleError(error, "Failed to send email OTP");
    }
  });

export const createAccount = actionClient
  .schema(createAccountSchema)
  .action(async ({ parsedInput: { email, fullName } }) => {
    const existingUser = await getUserByEmail({ email });
    const result = await sendEmailOTP({ email });

    if (!existingUser?.data) {
      const { databases } = await createAdminClient();
      databases.createDocument(
        appwriteConfig.database,
        appwriteConfig.usersCollection,
        ID.unique(),
        {
          email,
          full_name: fullName,
          avatar: avatarPlaceholderURL,
          account_id: result?.data?.accountId,
        },
      );
    }
    return { accountId: result?.data?.accountId };
  });
export const signIn = actionClient
  .schema(emailSchema)
  .action(async ({ parsedInput: { email } }) => {
    const existingUser = await getUserByEmail({ email });
    if (!existingUser?.data) {
      userNotFoundError();
    }
    const result = await sendEmailOTP({ email });
    return { accountId: result?.data?.accountId };
  });
export const verifyOTP = actionClient
  .schema(verifyOTPSchema)
  .action(async ({ parsedInput: { accountId, otp } }) => {
    try {
      const { account } = await createAdminClient();
      const session = await account.createSession(accountId, otp);
      (await cookies()).set("appwrite-session", session.secret, {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "strict",
      });
      return { sessionId: session.$id };
    } catch (error) {
      handleError(error, "Failed to verify OTP");
    }
  });

export const getCurrentUser = actionClient
  .outputSchema(userSchema.nullable())
  .action(async () => {
    try {
      const { account, databases } = await createSessionClient();
      const result = await account.get();
      const { documents } = await databases.listDocuments(
        appwriteConfig.database,
        appwriteConfig.usersCollection,
        [Query.equal("account_id", result.$id)],
      );
      return documents[0] ? userSchema.parse(documents[0]) : null;
    } catch (error) {
      console.error(error, "Failed to get current user");
      throw error;
    }
  });
export const signOut = actionClient.action(async () => {
  try {
    const { account } = await createSessionClient();
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    console.error(error, "Failed to sign out");
    throw error;
  } finally {
    redirect("/sign-in");
  }
});

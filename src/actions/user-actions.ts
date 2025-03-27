"use server";

import { appwriteConfig } from "@/lib/appwrite/config";
import { createAdminClient } from "@/lib/appwrite";
import { actionClient } from "@/lib/safe-action";
import { parseStringify } from "@/lib/utils";
import { ID, Query } from "node-appwrite";
import { cookies } from "next/headers";
import { z } from "zod";

const getUserByEmailSchema = z.object({
  email: z.string().email(),
});
export const getUserByEmail = actionClient
  .schema(getUserByEmailSchema)
  .action(async ({ parsedInput: { email } }) => {
    const client = await createAdminClient();
    const { documents, total } = await client.databases.listDocuments(
      appwriteConfig.database,
      appwriteConfig.usersCollection,
      [Query.equal("email", email)],
    );
    if (total === 0) return null;
    return documents[0];
  });

const sendEmailOTPSchema = z.object({
  email: z.string().email(),
});
const handleError = (error: unknown, message: string) => {
  console.error(error, message);
  throw error;
};
export const sendEmailOTP = actionClient
  .schema(sendEmailOTPSchema)
  .action(async ({ parsedInput: { email } }) => {
    try {
      const { account } = await createAdminClient();
      const session = await account.createEmailToken(ID.unique(), email);
      return session.userId;
    } catch (error) {
      handleError(error, "Failed to send email OTP");
    }
  });

const createAccountSchema = z.object({
  email: z.string().email(),
  fullName: z.string(),
});
export const createAccount = actionClient
  .schema(createAccountSchema)
  .action(async ({ parsedInput: { email, fullName } }) => {
    const existingUser = await getUserByEmail({ email });
    const accountId = await sendEmailOTP({ email });

    if (!existingUser?.data) {
      const { databases } = await createAdminClient();
      databases.createDocument(
        appwriteConfig.database,
        appwriteConfig.usersCollection,
        ID.unique(),
        {
          email,
          full_name: fullName,
          avatar:
            "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png",
          account_id: accountId?.data,
        },
      );
    }
    return parseStringify({ accountId: accountId?.data });
  });

const verifyOTPSchema = z.object({
  accountId: z.string(),
  otp: z.string(),
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
      return parseStringify({ sessionId: session.$id });
    } catch (error) {
      handleError(error, "Failed to verify OTP");
    }
  });

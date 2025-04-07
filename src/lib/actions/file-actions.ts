"use server";
import { constructFileUrl, getFileType } from "@/lib/utils";
import { appwriteConfig } from "@/lib/appwrite/config";
import { createAdminClient } from "@/lib/appwrite";
import { actionClient } from "@/lib/safe-action";
import { InputFile } from "node-appwrite/file";
import { revalidatePath } from "next/cache";
import { handleError } from "@/lib/utils";
import { ID } from "node-appwrite";
import { z } from "zod";

const uploadNewFileSchema = z.object({
  file: z.instanceof(File),
  ownerId: z.string(),
  accountId: z.string(),
  path: z.string().optional(),
});

const fileDocumentSchema = z.object({
  type: z.string(),
  extension: z.string(),
  owner: z.string(),
  account_id: z.string(),
  name: z.string(),
  url: z.string().url(),
  size: z.number(),
  users: z.array(z.string()),
  bucket_file_id: z.string(),
});

const uploadProgressSchema = z.object({
  $id: z.string(),
  progress: z.number().min(0).max(100),
  sizeUploaded: z.number().nonnegative(),
  chunksTotal: z.number().int().nonnegative(),
  chunksUploaded: z.number().int().nonnegative(),
});

const uploadFileSchema = z.object({
  file: z.instanceof(File),
  onProgress: z.function().args(uploadProgressSchema).optional(),
});

const deleteFileSchema = z.object({
  fileId: z.string(),
});

export const uploadFile = actionClient
  .schema(uploadFileSchema)
  .action(async ({ parsedInput: { file, onProgress } }) => {
    const { storage } = await createAdminClient();
    const inputFile = InputFile.fromBuffer(file, file.name);
    const result = await storage.createFile(
      appwriteConfig.bucket,
      ID.unique(),
      inputFile,
      [],
      onProgress,
    );
    return result;
  });

export const deleteFile = actionClient
  .schema(deleteFileSchema)
  .action(async ({ parsedInput: { fileId } }) => {
    const { storage } = await createAdminClient();
    try {
      await storage.deleteFile(appwriteConfig.bucket, fileId);
    } catch (error) {
      handleError(error, "Failed to delete file");
    }
  });

export const uploadNewFile = actionClient
  .schema(uploadNewFileSchema)
  .action(async ({ parsedInput: { file, ownerId, accountId, path } }) => {
    const { databases } = await createAdminClient();
    const uploadResult = await uploadFile({
      file,
      onProgress: (data) => console.log(data, "upload progress"),
    });
    if (!uploadResult?.data) {
      throw new Error("File upload failed");
    }
    const { data: bucketFile } = uploadResult;
    const { type, extension } = getFileType(file.name);

    const fileDocument = fileDocumentSchema.parse({
      type,
      extension,
      owner: ownerId,
      account_id: accountId,
      name: file.name,
      url: constructFileUrl(bucketFile.$id),
      size: bucketFile.sizeOriginal,
      users: [],
      bucket_file_id: bucketFile.$id,
    });
    try {
      const newFile = await databases.createDocument(
        appwriteConfig.database,
        appwriteConfig.filesCollection,
        ID.unique(),
        fileDocument,
      );
      if (path) {
        revalidatePath(path);
      }
      return newFile;
    } catch (error) {
      const result = await deleteFile({ fileId: bucketFile.$id });
      if (result?.serverError) {
        handleError(result.serverError, "Failed to delete file");
      }
      throw error;
    }
  });

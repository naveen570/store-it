"use client";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import { uploadNewFile } from "@/lib/actions/file-actions";
import React, { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { MAX_FILE_SIZE } from "@/constants";
import { FileUploaderProps } from "@/types";
import { Thumbnail } from "../thumbnail";
import { Button } from "../ui/button";
import Image from "next/image";
import { toast } from "sonner";

export const FileUploader = (props: FileUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const path = usePathname();
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
      const uploadeFilePromises = acceptedFiles.map((file) => {
        if (file.size > MAX_FILE_SIZE) {
          setFiles((prevFiles) =>
            prevFiles.filter((f) => f.name !== file.name),
          );
          return toast.error(`${file.name} is too large`);
        }
        return uploadNewFile({
          accountId: props.accountId,
          ownerId: props.ownerId,
          file,
          path: path,
        })
          .then((result) => {
            console.log(result, "result");
            if (result?.serverError) {
              return toast.error(result?.serverError);
            }
            toast.success(`${file.name} uploaded successfully`);
            setFiles((prevFiles) =>
              prevFiles.filter((f) => f.name !== file.name),
            );
          })
          .catch((error) => {
            console.error(error, "error");
            toast.error(error.message);
            setFiles((prevFiles) =>
              prevFiles.filter((f) => f.name !== file.name),
            );
          });
      });
      await Promise.all(uploadeFilePromises);
    },
    [path, props.accountId, props.ownerId],
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const handleRemoveFile = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    fileName: string,
  ) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };
  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button className={cn("uploader-button", props.className)} type="button">
        <Image
          src={"/assets/icons/upload.svg"}
          alt="upload"
          width={24}
          height={24}
        />
        <p>Upload</p>
      </Button>
      {files.length > 0 && (
        <div className="uploader-preview-list">
          <h4 className="h4">Uploading</h4>
          <ul className="flex flex-col gap-3">
            {files.map((file, index) => {
              const { extension, type } = getFileType(file.name);
              return (
                <li key={index} className="uploader-preview-item">
                  <div className="flex items-center gap-3">
                    <Thumbnail
                      extension={extension}
                      type={type}
                      url={convertFileToUrl(file)}
                    />
                    <div className="preview-item-name">
                      <p>{file.name}</p>
                      <Image
                        src={"/assets/icons/file-loader.gif"}
                        alt="loader"
                        width={80}
                        height={26}
                      />
                    </div>
                  </div>
                  <Image
                    src="/assets/icons/remove.svg"
                    alt="remove"
                    className="hover:opacity-80"
                    width={24}
                    height={24}
                    onClick={(e) => handleRemoveFile(e, file.name)}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

import { cn, getFileIcon } from "@/lib/utils";
import { ThumbnailProps } from "@/types";
import Image from "next/image";

export const Thumbnail = ({
  extension,
  type,
  url,
  className,
  imageClassName,
}: ThumbnailProps) => {
  const isImage = type === "image" && extension !== "svg";
  return (
    <figure className={cn("thumbnail", className)}>
      <Image
        src={isImage ? url : getFileIcon(extension, type)}
        alt="file"
        width={100}
        height={100}
        className={cn(
          isImage && "thumbnail-image",
          imageClassName,
          "size-8 object-contain",
        )}
      />
    </figure>
  );
};

"use client";
import { useUser } from "@/lib/provider/user-provider";
import { signOut } from "@/lib/actions/user-actions";
import { Button } from "@/components/ui/button";
import { FileUploader } from "./file-uploader";
import { Search } from "./search";
import Image from "next/image";
import React from "react";

export const Header = () => {
  const user = useUser();
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploader
          ownerId={user?.$id || ""}
          accountId={user?.account_id || ""}
        />

        <Button variant={"sign-out"} onClick={async () => await signOut()}>
          <Image
            src={"/assets/icons/logout.svg"}
            alt="Logout"
            width={24}
            height={24}
            className="w-6"
          />
        </Button>
      </div>
    </header>
  );
};

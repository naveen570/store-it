import { signOut } from "@/lib/actions/user-actions";
import { Button } from "@/components/ui/button";
import { FileUploader } from "./file-uploader";
import { Search } from "./search";
import Image from "next/image";
import React from "react";

export const Header = () => {
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploader />
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <Button variant={"sign-out"}>
            <Image
              src={"/assets/icons/logout.svg"}
              alt="Logout"
              width={24}
              height={24}
              className="w-6"
            />
          </Button>
        </form>
      </div>
    </header>
  );
};

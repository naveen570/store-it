"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { avatarPlaceholderURL, navItems } from "@/constants";
import { useUser } from "@/lib/provider/user-provider";
import { signOut } from "@/lib/actions/user-actions";
import { FileUploader } from "./file-uploader";
import { usePathname } from "next/navigation";
import { Separator } from "../ui/separator";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
export const MobileNavbar = () => {
  const [open, setOpen] = useState(false);
  const user = useUser();
  const pathname = usePathname();
  return (
    <header className="mobile-header py-4">
      <Image
        src={"/assets/icons/logo-full-brand.svg"}
        alt="Logo"
        width={120}
        height={52}
        className="object-contain"
      />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image
            src={"/assets/icons/menu.svg"}
            alt="Logo"
            width={24}
            height={24}
            className="cursor-pointer object-contain"
          />
        </SheetTrigger>
        <SheetContent className="shad-sheet h-screen px-3">
          <SheetHeader>
            <SheetTitle>
              <div className="header-user">
                <Image
                  src={user?.avatar || avatarPlaceholderURL}
                  alt="Logo"
                  width={40}
                  height={40}
                  className="header-user-avatar"
                />
                <div className="sm:hidden">
                  <p className="subtitle-2 capitalize">{user?.full_name}</p>
                  <p className="caption">{user?.email}</p>
                </div>
              </div>
              <Separator className="bg-light-200/20 mb-4" />
            </SheetTitle>
          </SheetHeader>
          <nav className="mobile-nav">
            <ul className="mobile-nav-list">
              {navItems.map((item) => {
                const active = item.url === pathname;
                return (
                  <li key={item.name} className="lg:w-full">
                    <Link
                      href={item.url}
                      className={cn("mobile-nav-item", {
                        "shad-active": active,
                      })}
                    >
                      <Image
                        src={item.icon}
                        alt={item.name}
                        width={26}
                        height={26}
                        className={cn(
                          "nav-icon size-[26px] object-contain transition-all",
                          {
                            "nav-icon-active": active,
                          },
                        )}
                      />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <Separator className="bg-light-200/20 my-5" />
          <FileUploader />

          <Button
            variant={"sign-out"}
            className="mobile-sign-out-button"
            onClick={async () => await signOut()}
          >
            <Image
              src={"/assets/icons/logout.svg"}
              alt="Logout"
              width={24}
              height={24}
              className="w-6"
            />
            <span>Logout</span>
          </Button>
        </SheetContent>
      </Sheet>
    </header>
  );
};

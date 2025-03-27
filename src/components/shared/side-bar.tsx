"use client";
import { avatarPlaceholderURL, navItems } from "@/constants";
import { useUser } from "@/lib/provider/user-provider";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const SideBar = () => {
  const pathName = usePathname();
  const user = useUser();
  return (
    <aside className="sidebar">
      <Link href={"/"}>
        <Image
          src={"/assets/icons/logo-full-brand.svg"}
          alt="Logo"
          width={160}
          height={52}
          className="hidden object-contain transition-all lg:block"
        />
        <Image
          src={"/assets/icons/logo-brand.svg"}
          alt="Logo"
          width={52}
          height={52}
          className="size-[52px] object-contain transition-all lg:hidden"
        />
      </Link>
      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          {navItems.map((item) => {
            const active = item.url === pathName;
            return (
              <li key={item.name} className="lg:w-full">
                <Link
                  href={item.url}
                  className={cn("sidebar-nav-item", {
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
                  <span className="hidden lg:block">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <Image
        src={"/assets/images/files-2.png"}
        alt="Logo"
        width={506}
        height={418}
        className="w-full"
      />
      <div className="sidebar-user-info">
        <Image
          src={user?.avatar ?? avatarPlaceholderURL}
          alt="Logo"
          width={506}
          height={418}
          className="sidebar-user-avatar"
        />
        <div className="hidden flex-col gap-1 lg:flex">
          <p className="subtitle-2 capitalize">{user?.full_name ?? ""}</p>
          <p className="caption">{user?.email ?? ""}</p>
        </div>
      </div>
    </aside>
  );
};

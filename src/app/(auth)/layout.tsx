import Image from "next/image";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <section className="bg-brand flex max-w-[580px] flex-col items-center gap-10 p-16">
        <Image
          src="/assets/icons/logo-full.svg"
          alt="Logo"
          width={223}
          height={81}
          className="h-auto self-start object-contain"
        />
        <div className="space-y-5 text-white">
          <h1 className="h1">Manage your files the best way</h1>
          <p>
            Awesome, we&apos;ve created the perfect place for you to store all
            your documents.
          </p>
        </div>
        <Image
          src={"/assets/images/illustration.png"}
          alt="Illustration"
          width={330}
          height={330}
          className="size-[330px] object-contain transition-all hover:rotate-2 hover:scale-105"
        />
      </section>
      {children}
    </div>
  );
};

export default Layout;

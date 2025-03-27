import Image from "next/image";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <section className="bg-brand hidden w-1/2 flex-col items-center justify-center p-16 lg:flex xl:w-2/5">
        <div className="flex max-w-[430px] flex-col items-center gap-10">
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
        </div>
      </section>
      <section className="flex flex-1 flex-col gap-16 bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0">
        <Image
          src="/assets/icons/logo-full-brand.svg"
          alt="Logo"
          width={223}
          height={81}
          className="h-auto object-contain lg:hidden"
        />
        {children}
      </section>
    </div>
  );
};

export default Layout;

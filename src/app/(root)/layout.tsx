import { MobileNavbar } from "@/components/shared/mobile-nav-bar";
import { UserProvider } from "@/lib/provider/user-provider";
import { getCurrentUser } from "@/lib/actions/user-actions";
import { redirect, RedirectType } from "next/navigation";
import { SideBar } from "@/components/shared/side-bar";
import { Header } from "@/components/shared/header";

const Layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const user = await getCurrentUser();
  if (!user?.data) {
    return redirect("/sign-in", RedirectType.replace);
  }
  return (
    <UserProvider user={user.data}>
      <main className="flex h-screen">
        <SideBar />
        <section className="flex h-full flex-1 flex-col">
          <MobileNavbar />
          <Header />
          <div className="overflow-y-auto"> {children}</div>
        </section>
      </main>
    </UserProvider>
  );
};

export default Layout;

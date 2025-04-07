import { Toaster } from "@/components/ui/sonner";
import { Poppins } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  preload: true,
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Store it",
  description: "Store your data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-poppins antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

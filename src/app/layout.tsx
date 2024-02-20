import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Provider } from "@/app/components/Provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Simple Reader View",
  description: "Enter a URL to get a simplified view of a page's content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="lofi">
      <body className={inter.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}

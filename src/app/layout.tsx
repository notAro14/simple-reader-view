import type { Metadata } from "next";
import { Container } from "@radix-ui/themes";

import { Provider } from "src/components/Provider";

import "@radix-ui/themes/styles.css";
import "src/styles/globals.css";

export const metadata: Metadata = {
  title: "TLDRify",
  description:
    "Summarise any web page content. Paste the page URL and get a TLDR summary",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider>
          <Container size="1" p="4">
            {children}
          </Container>
        </Provider>
      </body>
    </html>
  );
}

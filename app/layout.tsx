import type { Metadata } from "next";
import type { ReactNode } from "react";
import { FitLogProvider } from "@/components/fit-log-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "FitLog — Train with intent",
  description: "A no-nonsense workout library and daily training plan.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <FitLogProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </FitLogProvider>
      </body>
    </html>
  );
}

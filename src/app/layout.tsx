import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dayone Lunch Dashboard",
  description: "Dayone Lunch Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <NextTopLoader showSpinner={false} />
        {children}
      </body>
    </html>
  );
}

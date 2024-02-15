import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ThemeProvider } from "@/providers/theme-provider";
import ConvexClientProvider from "@/providers/convex-client-provider";
import { Toaster } from "@/components/ui/sonner";
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });
export const metadata: Metadata = {
  title: "NextVideo",
  description: "A quick, fun video-sharing platform for everyone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ConvexClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="mx-8">{children}</main>
            <Toaster richColors />
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}

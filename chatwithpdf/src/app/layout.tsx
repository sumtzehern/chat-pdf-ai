import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Providers from "@/components/Providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat with Document",
  description: "Ask questions to your document",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <Providers>
        <html lang="en" suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <body className={inter.className}>{children}</body>
          </ThemeProvider>
          <Toaster
            toastOptions={{
              style: {
                marginLeft: "auto",
                marginRight: "auto",
                transform: "translateX(-50%)",
                top: "30px",
                position: "fixed",
                right: "50%",
              },
            }}
          />
        </html>
      </Providers>
    </ClerkProvider>
  );
}

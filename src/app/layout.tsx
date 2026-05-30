import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ui/ErrorReporter";
import Script from "next/script";
import { ThemeProvider } from "next-themes";
import { ParallaxComponent } from "@/components/ui/parallax-scrolling";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata: Metadata = {
  title: "prathapsk",
  description: "Prathap Selvakumar - Robotic Graduate Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YCW9NQLJXG"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-YCW9NQLJXG');
          `}
        </Script>
      </head>
      <body className="antialiased">
        <LanguageProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ErrorReporter />
            <Script
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
              strategy="afterInteractive"
              data-target-origin="*"
              data-message-type="ROUTE_CHANGE"
              data-include-search-params="true"
              data-only-in-iframe="true"
              data-debug="true"
              data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
            />
            <ParallaxComponent />
            {children}
            <VisualEditsMessenger />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
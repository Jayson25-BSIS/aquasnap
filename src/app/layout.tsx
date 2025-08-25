import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import { ResponseLogger } from "@/components/response-logger";
import { cookies } from "next/headers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "AQUASNAP - Marine Learning Platform",
  description: "Discover marine life with AQUASNAP, a gamified learning platform for identifying marine species. Play educational games, earn points, manage your virtual aquarium, and become a marine conservation expert!",
  keywords: [
    "marine biology",
    "ocean conservation",
    "marine species identification", 
    "educational games",
    "virtual aquarium",
    "sustainability",
    "marine learning",
    "ocean education"
  ],
  authors: [{ name: "AQUASNAP Team" }],
  creator: "AQUASNAP",
  publisher: "AQUASNAP",
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestId = cookies().get("x-request-id")?.value;

  return (
    <html lang="en">
      <head>
        {requestId && <meta name="x-request-id" content={requestId} />}
      </head>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        {children}
        {/* <ResponseLogger /> */}
      </body>
    </html>
  );
}

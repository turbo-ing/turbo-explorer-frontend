import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import { Geist, Geist_Mono, Jura } from "next/font/google";
import "./globals.css";
import NavBar from "../components/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// TODO: Add Jura font
// Jura is Turbo themed font
// const jura = Jura({
//   subsets: ['latin'],
//   weight: ['300', '400', '500', '600', '700'],
//   variable: '--font-jura',
// });


// TODO: Add Open Graph and Twitter Card images
export const metadata: Metadata = {
  title: "Turbo Explorer",
  description: "Turbo Explorer lets you explore games on the Turbo platform, check out zk proofs from players, and verify them with ease.",
  keywords: "Turbo Explorer, blockchain explorer, zk proofs, game tracking, verification, Turbo platform",
  openGraph: {
    title: "Turbo Explorer - Track Games & Proofs",
    description: "Discover and verify games and zk proofs on the Turbo platform with Turbo Explorer.",
    type: "website",
    url: "https://explorer.turbo.ing",
    // images: [
    //   {
    //     url: "https://explorer.turbo.ing/og-image.jpg",
    //     width: 1200,
    //     height: 630,
    //     alt: "Turbo Explorer Banner",
    //   },
    // ],
  },
  twitter: {
    // card: "summary_large_image",
    card: "summary",
    title: "Turbo Explorer - Track Games & Proofs",
    description: "Explore and verify games and zk proofs easily with Turbo Explorer.",
    // images: ["https://explorer.turbo.ing/twitter-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-gray-100 max-w-[100vw] overflow-x-hidden">
      <head>
        <link
          rel="icon"
          type="image/x-icon"
          href="/favicon.svg"
        />
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="/favicon.svg"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 grid grid-rows-[78px_1fr] h-full min-h-[100dvh] max-w-[100vw]`}>
        <NavBar />
        <main className="text-stone-900 ">
          {children}
        </main>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Poppins, Prompt } from 'next/font/google';
import "./globals.css";
import { Balthazar, Istok_Web, Inter } from "next/font/google";
import MotionProvider from "@/components/MotionProvider";

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});


const istokWeb = Istok_Web({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-istok-web',
  display: 'swap',
});

// Add to body className: ${istokWeb.variable}
const balthazar = Balthazar({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-balthazar',
  display: 'swap',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
});

const prompt = Prompt({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'thai'],
  variable: '--font-prompt',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "GENOMIX, DNA sequence alignment",
  description: "Explore DNA alignment with Needleman-Wunsch and Smith-Waterman. Compare sequences from NCBI, FASTA uploads, or curated research examples.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
     <body className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${prompt.variable} ${balthazar.variable} ${istokWeb.variable} ${inter.variable} ${inter.className} antialiased`}>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
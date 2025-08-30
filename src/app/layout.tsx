import type { Metadata } from "next";
import { Share_Tech } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const shareTech = Share_Tech({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "relay.VirtualKemomimi.net",
  description: "VRChatとかResoniteとかClusterとかそのあたりのユーザーを想定した小規模ActivityPubサーバー向けのリレーサーバーです。",
  icons: {
    icon: 'https://media.VirtualKemomimi.net/files/99d997d5-d878-45f1-af1f-e5d22c03e877.png',
  },
  openGraph: {
    siteName: "relay.VirtualKemomimi.net",
    title: "relay.VirtualKemomimi.net",
    description: "VRChatとかResoniteとかClusterとかそのあたりのユーザーを想定した小規模ActivityPubサーバー向けのリレーサーバーです。",
    images: [
      {
        url: 'https://media.virtualkemomimi.net/files/12aeab85-704e-41db-b634-78ab4d0080da.webp',
      },
    ],
  },
  twitter: {
    card: "summary",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={shareTech.className}>
        {children}
        <Script src="https://kit.fontawesome.com/d0f4691213.js" crossOrigin="anonymous" />
      </body>
    </html>
  );
}
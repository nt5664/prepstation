import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import Header from "./_components/Header";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Footer from "./_components/Footer";

const workSans = Work_Sans({
  subsets: ["latin"],
});

// const lato = Lato({
//   variable: "--font-lato-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: { default: "PrepStation", template: "%s | PrepStation" },
  description:
    "Event schedule management app made for online speedrunning marathons and competitions",
  openGraph: {
    title: "PrepStation",
    description:
      "Event schedule management app made for online speedrunning marathons and competitions",
    url: process.env.BASE_URL,
    siteName: "PrepStation",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-gray-900 text-emerald-100 ${workSans.className}`}>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
          }}
        />
        <div className="flex h-dvh flex-col">
          <Header />
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="min-h-full flex flex-col">
              <main>{children}</main>
              <Footer />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

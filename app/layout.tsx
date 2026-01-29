import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Header from "@/app/_components/Header";
import "@/app/globals.css";
import Footer from "@/app/_components/Footer";
import LoaderSmall from "./_components/LoaderSmall";

const appFont = Exo_2({
  subsets: ["latin"],
});

export const dynamic = "force-dynamic";

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
      <body className={`bg-gray-900 text-emerald-100 ${appFont.className}`}>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 5000,
            success: {
              className: "border-2 border-lime-400",
              style: {
                background: "oklch(45.3% 0.124 130.933)",
                color: "oklch(84.1% 0.238 128.85)",
              },
              iconTheme: {
                primary: "oklch(84.1% 0.238 128.85)",
                secondary: "oklch(45.3% 0.124 130.933)",
              },
            },
            error: {
              className: "border-2 border-red-600",
              style: {
                background: "oklch(25.8% 0.092 26.042)",
                color: "oklch(57.7% 0.245 27.325)",
              },
              iconTheme: {
                primary: "oklch(57.7% 0.245 27.325)",
                secondary: "oklch(25.8% 0.092 26.042)",
              },
            },
            loading: {
              className: "border-2 border-sky-300",
              style: {
                background: "oklch(50% 0.134 242.749)",
                color: "oklch(82.8% 0.111 230.318)",
              },
              icon: <LoaderSmall />,
            },
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

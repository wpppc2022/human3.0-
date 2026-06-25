import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Human 3.0 自我发展评估",
  description: "看见你当前的人生系统：认知、身体、意义与事业如何协同运转。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

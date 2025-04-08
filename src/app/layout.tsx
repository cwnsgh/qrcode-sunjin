import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider"; // 방금 만든 AuthProvider 임포트

export const metadata: Metadata = {
  title: "건물 관리 QR 시스템", // 앱 이름 설정
  description: "QR 코드로 간편하게 건물 시설을 관리하세요.", // 앱 설명 설정
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      {" "}
      {/* 언어 설정 */}
      <body>
        {/* AuthProvider로 children(페이지 내용)을 감싸줍니다 */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

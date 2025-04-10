"use client"; // Sidebar 상태 관리를 위해 useState 사용 -> 클라이언트 컴포넌트로 변경!

import "./globals.css";
import { useState } from "react"; // useState 임포트
import type { Metadata } from "next"; // Metadata 타입은 유지 가능
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import Header from "@/components/layout/Header"; // Header 임포트
import Slider from "@/components/layout/Slider"; // Sidebar 임포트

const inter = Inter({ subsets: ["latin"] });

// metadata는 서버 컴포넌트 기능이므로, 클라이언트 컴포넌트에서는 직접 export 불가
// 필요하다면 별도 파일로 분리하거나, Head 태그 직접 사용 고려
// export const metadata: Metadata = { ... }; // 이 부분은 주석 처리 또는 이동

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 사이드바 상태

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <html lang="ko">
      <head>
        <title>건물 관리 QR 시스템</title>
        <meta
          name="description"
          content="QR 코드로 간편하게 건물 시설을 관리하세요."
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header toggleSidebar={toggleSidebar} />{" "}
            <div className="flex flex-1">
              <Slider isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              <main className={"flex-1"}>
                <div className="p-4">{children}</div>
              </main>
            </div>
            {isSidebarOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={toggleSidebar}
              ></div>
            )}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

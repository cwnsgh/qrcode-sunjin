// src/components/layout/Header.tsx
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react"; // 세션, 로그아웃 사용
import { Role } from "@prisma/client";

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const { data: session, status } = useSession(); // 세션 정보 가져오기
  const userRole = session?.user?.role;

  // 역할별 메뉴 항목 정의 (사이드바와 유사하게)
  const getDesktopMenuItems = () => {
    const baseItems = [
      { href: "/", label: "홈" },
      { href: "/facilities", label: "시설" },
    ];
    if (userRole === Role.ADMIN || userRole === Role.MANAGER) {
      baseItems.push(
        { href: "/checklists", label: "점검표" },
        { href: "/workers", label: "작업자" },
        { href: "/settings", label: "설정" }
      );
    }
    return baseItems;
  };

  const desktopMenuItems = getDesktopMenuItems();

  return (
    <header className="bg-gray-400 text-white p-4 flex items-center justify-between">
      {" "}
      {/* justify-between 추가 */}
      <div className="flex items-center">
        {" "}
        {/* 로고와 햄버거 묶음 */}
        {/* 햄버거 버튼 (모바일 전용) */}
        <button onClick={toggleSidebar} className="mr-4 p-2 rounded md:hidden">
          {" "}
          {/* md:hidden 유지 */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
        <Link href="/" className="text-xl font-bold">
          건물관리QR
        </Link>
      </div>
      {/* --- ✨ 데스크탑용 네비게이션 메뉴 추가! --- */}
      <nav className="hidden md:flex space-x-4 items-center">
        {" "}
        {/* hidden md:flex */}
        {status === "authenticated" &&
          desktopMenuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-gray-300 text-sm"
            >
              {item.label}
            </Link>
          ))}
        {/* 로그인/로그아웃 버튼 */}
        {status === "authenticated" ? (
          <button
            onClick={() => signOut()}
            className="ml-4 px-3 py-1 bg-red-600 rounded hover:bg-red-700 text-sm"
          >
            로그아웃
          </button>
        ) : (
          <Link
            href="/login"
            className="ml-4 px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 text-sm"
          >
            로그인
          </Link>
        )}
      </nav>
      {/* ----------------------------------------- */}
    </header>
  );
}

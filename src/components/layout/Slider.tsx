// src/components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Role } from "@prisma/client";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Slider({ isOpen, toggleSidebar }: SidebarProps) {
  const { data: session, status } = useSession();
  const userRole = session?.user?.role;

  if (status === "loading") return null;

  const getMenuItems = () => {
    // ... (메뉴 항목 정의 로직은 동일)
    const baseItems = [
      { href: "/", label: "홈" },
      { href: "/facilities", label: "시설" },
    ];
    if (userRole === Role.ADMIN || userRole === Role.MANAGER) {
      baseItems.push(
        { href: "/checklists", label: "점검표 관리" },
        { href: "/workers", label: "작업자 관리" },
        { href: "/settings", label: "설정" }
      );
    }
    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-gray-800 text-white p-4 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full" // 열림/닫힘 애니메이션
      } transition-transform duration-300 ease-in-out z-50 w-64 shadow-lg`} // z-index 와 너비, 그림자 추가
    >
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 text-white p-1"
      >
        {/* 닫기 아이콘 (X) */}
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <h2 className="text-xl font-bold mb-6 mt-8">메뉴</h2>{" "}
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.href} className="mb-4">
              <Link
                href={item.href}
                onClick={toggleSidebar}
                className="block py-1 hover:text-gray-300"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* 로그인/로그아웃 버튼 */}
      <div className="absolute bottom-4 left-4 right-4">
        {session ? (
          <div>
            <p className="text-sm mb-2 truncate">
              {session.user?.name ?? session.user?.email}
            </p>{" "}
            {/* 긴 이름 잘림 처리 */}
            <button
              onClick={() => signOut()}
              className="w-full px-4 py-2 bg-red-600 rounded hover:bg-red-700 text-sm"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="w-full block text-center px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-sm"
          >
            로그인
          </Link>
        )}
      </div>
    </aside>
  );
}

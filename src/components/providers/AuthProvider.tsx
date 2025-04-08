// src/components/providers/AuthProvider.tsx
"use client"; // SessionProvider는 클라이언트 컴포넌트여야 합니다!

import { SessionProvider } from "next-auth/react";
import React from "react"; // React 임포트 추가 (필수는 아니지만 명시적)

// SessionProvider를 감싸는 래퍼(wrapper) 컴포넌트
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // SessionProvider가 세션 데이터를 context를 통해 하위 컴포넌트에 제공
  return <SessionProvider>{children}</SessionProvider>;
}

"use client"; // useSession, signIn, signOut 훅/함수는 클라이언트 컴포넌트에서 사용해야 함!

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react"; // 이메일, 비밀번호 입력을 위해 useState 사용

export default function HomePage() {
  // useSession 훅을 사용하여 세션 데이터와 상태 가져오기
  const { data: session, status } = useSession();

  // 로그인 폼 입력 상태 관리
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 로그인 시도 함수
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); // 폼 기본 제출 동작 방지
    // signIn 함수 호출 (첫 번째 인자: provider ID, 두 번째 인자: 옵션 객체)
    // Credentials 로그인 시 provider ID는 'credentials'
    const result = await signIn("credentials", {
      redirect: false, // 로그인 후 페이지 리디렉션 방지 (결과 직접 처리 위함)
      email: email,
      password: password,
    });

    if (result?.error) {
      // 로그인 실패 시 오류 처리 (예: 알림 표시)
      console.error("Login failed:", result.error);
      alert("로그인 실패: " + result.error); // 간단한 알림
    } else if (result?.ok) {
      // 로그인 성공 시 (필요하다면 추가 작업)
      console.log("Login successful!");
      // 보통 페이지 리디렉션은 여기서 하거나, useSession 상태 변경으로 자동 처리됨
      // 여기서는 redirect: false 했으므로, UI는 useSession 상태에 따라 자동으로 업데이트됨
      // 입력 필드 초기화
      setEmail("");
      setPassword("");
    }
  };

  // 로딩 상태 표시
  if (status === "loading") {
    return <p>로딩 중...</p>;
  }

  // 로그인 상태에 따른 UI 렌더링
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">건물 관리 QR 시스템</h1>

      {session ? (
        // 로그인된 경우
        <div>
          <p>환영합니다, {session.user?.name ?? session.user?.email}님!</p>
          <p>당신의 역할은: {session.user?.role ?? "알 수 없음"}</p>{" "}
          {/* role 표시 */}
          <p>당신의 아이디는: {session.user?.id ?? "알 수 없음"}</p>{" "}
          {/* id 표시 */}
          <button
            onClick={() => signOut()} // signOut 함수 호출
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            로그아웃
          </button>
        </div>
      ) : (
        // 로그인되지 않은 경우
        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">로그인</h2>
          <div>
            <label htmlFor="email">이메일:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-2 border rounded text-black" // Tailwind CSS 적용 (text-black 추가)
            />
          </div>
          <div>
            <label htmlFor="password">비밀번호:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-2 border rounded text-black" // Tailwind CSS 적용
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            로그인하기
          </button>
          <p className="mt-4 text-sm">
            (아직 계정이 없다면 관리자에게 문의하세요.)
          </p>
        </form>
      )}
    </main>
  );
}

// src/lib/db.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// 개발 환경에서는 globalThis에 prisma 인스턴스를 저장하여
// Next.js의 HMR(Hot Module Replacement) 시 새로운 인스턴스가
// 계속 생성되는 것을 방지합니다.
export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    // Prisma 로그
    log: ["query", "info", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

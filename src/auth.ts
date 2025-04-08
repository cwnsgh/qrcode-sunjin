import NextAuth, {
  type DefaultSession,
  type User as NextAuthUser,
  type AuthOptions, // ✨ AuthOptions 임포트
} from "next-auth";
import { Adapter } from "next-auth/adapters";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./lib/db"; // 경로 확인!
import bcrypt from "bcrypt";
import { Role, User as PrismaUser } from "@prisma/client"; // Prisma User에 별칭

// NextAuth 설정을 별도 객체로 분리하고 AuthOptions 타입 지정
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    // --- ✨ JWT 전략으로 변경 ---
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials): Promise<NextAuthUser | null> {
        if (!credentials?.email || !credentials?.password) return null;
        const { email, password } = credentials;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) return null;

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatch) return null;

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          image: null, // NextAuthUser 기본 필드 (없으면 null)
        };
      },
    }),
  ],
  callbacks: {
    // --- ✨ JWT 전략 사용 시 'jwt' 콜백 ---
    async jwt({ token, user }) {
      // user 객체는 authorize에서 반환된 객체 (id: string)
      if (user) {
        // 최초 로그인 시 user 객체가 존재
        token.id = user.id;
        // DB에서 role 조회하여 토큰에 추가
        const userIdInt = parseInt(user.id, 10);
        if (!isNaN(userIdInt)) {
          const userFromDb = await prisma.user.findUnique({
            where: { id: userIdInt },
          });
          if (userFromDb) {
            token.role = userFromDb.role;
          }
        }
      }
      return token; // 토큰 반환
    },
    // --- ✨ JWT 전략 사용 시 'session' 콜백은 'token'을 받음 ---
    async session({ session, token }) {
      // 파라미터가 token으로 바뀜!
      if (session.user && token) {
        session.user.id = token.id as string; // token.id 사용 (string 타입 단언)
        session.user.role = token.role as Role; // token.role 사용 (Role 타입 단언)
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET!,
  // pages: { signIn: '/login' }, // 필요시 설정
  debug: process.env.NODE_ENV === "development",
};

// 설정 객체를 default export
export default NextAuth(authOptions);

// --- 타입 확장 (JWT) ---
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // id 타입 string
      role?: Role; // role은 optional
    } & DefaultSession["user"]; // name, email, image 상속
  }
  // User 인터페이스 확장은 제거된 상태 유지
}

// --- JWT 타입 확장 ---
declare module "next-auth/jwt" {
  interface JWT {
    id?: string; // id 필드 추가 (optional)
    role?: Role; // role 필드 추가 (optional)
  }
}

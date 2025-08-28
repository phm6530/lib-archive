import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.picture = user.image;
        token.nickname = user.nickname;
        token.role = user.role!;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.nickname = token.nickname as string;
        session.user.image = token.picture as string;
        session.user.role = token.role as "admin" | "super";
      }
      return session;
    },
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const response = await fetch(
            `${process.env.AUTH_API}/api/authorization`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          if (!response.ok) {
            throw new Error("인증에 실패했습니다.");
          }

          const data = await response.json();

          return {
            id: data.user.id,
            email: data.user.email,
            nickname: data.user.nickname,
            role: data.user.role,
            image: data.user.image,
          };
        } catch (e) {
          throw new Error((e as Error).message);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 15 * 60,
  },
});

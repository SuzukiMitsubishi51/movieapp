import NextAuth, { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { pool } from "@/lib/db";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("MISSING CREDENTIALS");
          return null;
        }

        console.log("LOGIN ATTEMPT EMAIL:", credentials.email);
        console.log("LOGIN ATTEMPT PASSWORD:", JSON.stringify(credentials.password));

        const result = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [credentials.email]
        );

        console.log("DB RAW RESULT:", result.rows);

        const user = result.rows[0];

        if (!user) {
          console.log("USER NOT FOUND");
          return null;
        }

        console.log("USER FOUND:", {
          id: user.id,
          email: user.email,
          password: JSON.stringify(user.password),
        });

        const dbPassword = String(user.password).trim();
        const inputPassword = String(credentials.password).trim();

        console.log("PASSWORD COMPARE:", {
          dbPassword,
          inputPassword,
          match: dbPassword === inputPassword,
        });

        if (dbPassword !== inputPassword) {
          console.log("PASSWORD MISMATCH");
          return null;
        }

        console.log("LOGIN SUCCESS");

        return {
          id: String(user.id),
          email: user.email,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = (user as any).id;
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
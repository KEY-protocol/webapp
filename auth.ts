import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [],

  // Using JWT strategy — no database needed for now
  session: {
    strategy: "jwt",
  },

  callbacks: {
    /**
     * JWT callback — runs when a JWT is created or updated.
     */
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.id = profile.sub;
        token.picture = profile.picture;
        // TODO: When backend is ready, save/update user in database here
        // and attach internal user ID + role to the token
      }
      return token;
    },

    /**
     * Session callback — exposes JWT data to the client session.
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.image = token.picture as string;
      }
      return session;
    },

    /**
     * Redirect callback — handle safe post-login redirection.
     */
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return `${baseUrl}/home`;
    },
  },

  pages: {
    // Redirect to root (login page) on sign-in
    signIn: "/",
    // TODO: Customize error page when needed
  },

  // TODO: When backend is ready, add a database adapter (e.g. Prisma)
  // to persist sessions and user data:
  // adapter: PrismaAdapter(prisma),
});

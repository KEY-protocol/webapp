import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // TODO: [GOOGLE-AUTH] Reactivar el proveedor de Google cuando las credenciales de OAuth (AUTH_GOOGLE_ID y AUTH_GOOGLE_SECRET) estén listas.
    /*
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    */
  ],

  // Using JWT strategy — no database needed for now
  session: {
    strategy: "jwt",
  },

  callbacks: {
    /**
     * JWT callback — runs when a JWT is created or updated.
     * Here we add the user's profile info from the Google provider to the token.
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

import { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { sign } from "jsonwebtoken";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;


const authConfig: NextAuthConfig = {
    session: {
        strategy: "jwt"
    },

    providers: [
        Google({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET
        })
    ],

    callbacks: {
        async jwt( {token, user }) {
            if (user) {
                token.name = user.name!
                token.email = user.email!
                token.picture = user.image!
            }
            return token
        },

        async session({ session, token }) {
            session.user.name = token.name!
            session.user.email = token.email!
            session.user.image = token.picture!
            session.token = token!
            return session 
        },

        async signIn({ user }) {
            if (!user?.email) {
                throw new Error('Failed to get user info from Google')
            }
            const token = sign(
                {
                    name: user.name,
                    email: user.email,
                    picture: user.image,
                },
                NEXTAUTH_SECRET!,
                { expiresIn: "10m" }
            )

            const res  = await fetch("https://localhost:9000/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) {
                console.error("Login refused by backend");
                return false;
            } else {
                return true;
            }
        }
    }
}

const handler = NextAuth(authConfig)
export { handler as GET, handler as POST }
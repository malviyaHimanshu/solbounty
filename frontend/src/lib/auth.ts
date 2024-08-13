import { getServerSession, NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { redirect } from 'next/navigation';

export const authConfig: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_AUTH_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_AUTH_CLIENT_SECRET as string
    })
  ],
  pages: {
    signIn: '/',
  }
}

export async function loginIsRequiredServer() {
  const session = await getServerSession(authConfig);
  if(!session) return redirect('/');
}
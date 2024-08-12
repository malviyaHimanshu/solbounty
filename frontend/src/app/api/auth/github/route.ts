import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.GITHUB_AUTH_CLIENT_ID;
  const redirectUri = encodeURIComponent(`${process.env.NEXT_AUTH_URI}/api/auth/github/callback`);

  // Redirect the user to the GitHub OAuth URL
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`;
  return NextResponse.redirect(githubAuthUrl);
}
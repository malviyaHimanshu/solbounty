import { NextResponse } from "next/server";
import axios from "axios";
import { serialize } from 'cookie';
import { createToken } from "@/lib/auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if(!code) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const client_id = process.env.GITHUB_AUTH_CLIENT_ID;
  const client_secret = process.env.GITHUB_AUTH_CLIENT_SECRET;

  try {
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      null,
      {
        params: {
          client_id: client_id,
          client_secret: client_secret,
          code
        },
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    const access_token = tokenResponse.data.access_token;
    // Fetch user information from GitHub
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const user = userResponse.data;
    const token = createToken({ access_token, user });
    const cookie = serialize('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })

    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    response.headers.append('Set-Cookie', cookie);
    return response;
  } catch (error) {
    console.error("Error during GitHub authentication: ", error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
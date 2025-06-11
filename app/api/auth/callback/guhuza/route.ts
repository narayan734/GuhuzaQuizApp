import { NextRequest, NextResponse } from 'next/server';
import { getCookie, deleteCookie } from 'cookies-next';
import { signIn } from '@/auth';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const token = searchParams.get('token');
  const state = searchParams.get('state');

  const storedState = await getCookie('loginState', { req });

  if (state !== storedState) {
    return NextResponse.redirect(new URL('/?error=invalid_state', req.url));
  }

  deleteCookie('loginState', { req });

  if (userId && token) {
    try {
      const signInResult = await signIn('credentials', {
        userId,
        token,
        redirect: false,
      });

      if (signInResult?.error) {
        return NextResponse.redirect(
          new URL(`/?error=${signInResult.error}`, req.url)
        );
      }

      return NextResponse.redirect(new URL('/quiz', req.url));
    } catch (error) {
      console.error('Error during sign in:', error);
      return NextResponse.redirect(new URL('/?error=signin_failed', req.url));
    }
  }

  return NextResponse.redirect(new URL('/?error=missing_params', req.url));
}

'use client';
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const state = searchParams.get('state');
    if (state) {
      // Automatically login as Anonymous
      router.push(`/api/login`);

    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <h1>Logging you in...</h1>
    </div>
  );
}

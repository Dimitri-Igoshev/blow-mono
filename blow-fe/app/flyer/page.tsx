'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OldPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return null
}
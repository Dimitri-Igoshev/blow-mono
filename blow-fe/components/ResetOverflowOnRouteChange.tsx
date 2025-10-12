'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ResetOverflowOnRouteChange() {
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = '';
    document.body.style.position = ''
  }, [pathname]);

  return null;
}
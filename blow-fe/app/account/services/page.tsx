import { Suspense } from 'react';
import PageServices from './PageServices'

export default function Page() {
  return (
    <Suspense>
      <PageServices />
    </Suspense>
  );
}

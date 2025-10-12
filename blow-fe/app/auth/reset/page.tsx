import { Suspense } from "react";

import ResetClient from "./ResetClient";

export default function ResetPage() {
  return (
    <main style={{ padding: 20 }}>
      <h1>Сброс пароля</h1>
      <Suspense fallback={<p>Загрузка...</p>}>
        <ResetClient />
      </Suspense>
    </main>
  );
}

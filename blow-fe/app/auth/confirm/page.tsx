import { Suspense } from "react";

import ConfirmClient from "./ConfirmClient";

export default function ResetPage() {
  return (
    <main style={{ padding: 20 }}>
      <h1>Подтверждение почты</h1>
      <Suspense fallback={<p>Загрузка...</p>}>
        <ConfirmClient />
      </Suspense>
    </main>
  );
}

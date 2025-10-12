export default function Layout({ children }: { children: React.ReactNode }) {
  // Форсим тёмную тему ТОЛЬКО внутри этого маршрута
  return (
    <div className="dark" data-theme="dark">
      {children}
    </div>
  );
}
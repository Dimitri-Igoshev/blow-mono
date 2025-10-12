import { useEffect, useState } from "react"

  export function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    function onResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", onResize);
    // мгновенно синхронизируемся (на случай SSR)
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return width;
}
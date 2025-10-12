import { useLayoutEffect } from "react";

function scrollElToBottom(el: HTMLElement, smooth = false) {
  if (!el) return;
  const behavior = smooth ? ("smooth" as ScrollBehavior) : ("auto" as ScrollBehavior);
  // если поддерживается native smooth:
  try { el.scrollTo({ top: el.scrollHeight, behavior }); }
  catch { el.scrollTop = el.scrollHeight; }
}

export function useScrollToBottom(
  ref: React.RefObject<HTMLElement>,
  deps: any[] = [],
  { smooth = false }: { smooth?: boolean } = {}
) {
  useLayoutEffect(() => {
    if (!ref.current) return;
    // ждём, пока DOM дорисует содержимое
    const el = ref.current;
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => scrollElToBottom(el, smooth));
      return () => cancelAnimationFrame(raf2);
    });
    return () => cancelAnimationFrame(raf1);
  // важны только смена чата и количество сообщений
  }, deps);
}

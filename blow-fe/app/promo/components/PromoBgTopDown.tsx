"use client";

import { motion, useReducedMotion } from "framer-motion";

export function PromoBgTopDown() {
  const reduce = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 bg-black"
    >
      <motion.div
        initial={reduce ? { opacity: 0 } : { y: "-100%", opacity: 0 }}
        animate={reduce ? { opacity: 1 } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="
          absolute inset-0
          bg-[url('/promo-bg.jpg')] bg-no-repeat bg-cover bg-top
        "
      />
      {/* Плавный переход в чёрный низ страницы */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85" />
    </div>
  );
}

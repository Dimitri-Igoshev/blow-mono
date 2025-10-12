// components/promo-bg-right-slide.tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";

export function PromoBgRightSlide() {
  const reduce = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 bg-black"
    >
      <motion.div
        initial={reduce ? { opacity: 0 } : { x: "100%", opacity: 0 }}
        animate={reduce ? { opacity: 1 } : { x: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="
          absolute inset-0
          bg-[url('/promo-bg.jpg')] bg-no-repeat bg-cover bg-right
        "
      />
      {/* лёгкий градиент, чтобы фон «вплавлялся» в чёрный слева */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/40 to-black/90" />
    </div>
  );
}

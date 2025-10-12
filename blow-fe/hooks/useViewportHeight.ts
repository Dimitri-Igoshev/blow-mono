"use client";

import { useEffect } from "react";

// Hook to set --vh CSS variable based on the current viewport height
export const useViewportHeight = () => {
  useEffect(() => {
    const setVh = () => {
      if (typeof window !== "undefined") {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
      }
    };

    setVh();
    window.addEventListener("resize", setVh);

    return () => {
      window.removeEventListener("resize", setVh);
    };
  }, []);
};

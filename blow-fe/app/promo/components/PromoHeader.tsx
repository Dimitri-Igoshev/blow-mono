"use client";

import NextLink from "next/link";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
  Image,
  Chip,
} from "@heroui/react";
import { motion, useReducedMotion } from "framer-motion";

export const PromoHeader = () => {
  const reduce = useReducedMotion();

  return (
    <div className="dark" data-theme="dark">
      {/* Анимационный контейнер: фиксированный, падает сверху вниз */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50"
        initial={reduce ? { opacity: 0 } : { y: "-100%", opacity: 0 }}
        animate={reduce ? { opacity: 1 } : { y: 0, opacity: 1 }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1], // плавная «спадная» кривая
        }}
      >
        {/* Сам Navbar больше НЕ делаем fixed, он внутри уже фиксирован контейнером */}
        <HeroUINavbar
          className="p-3 bg-black/90 backdrop-blur-md border-b border-white/5"
          isBlurred
          maxWidth="full"
          position="static"
        >
          <NavbarContent justify="start">
            <NavbarBrand className="max-w-fit">
              <NextLink
                className="flex items-center gap-2"
                href="/"
                onClick={() => {
                  document.body.style.overflow = "";
                }}
              >
                <Image
                  alt="BLOW"
                  className="w-[127px] h-[50px]"
                  radius="none"
                  src="/logo.png"
                />
              </NextLink>
            </NavbarBrand>
          </NavbarContent>

          {/* делаем видимым на всех экранах (или верни hidden md:flex, если надо скрывать на мобилке) */}
          <NavbarContent className="hidden sm:flex gap-3" justify="end">
            <NavbarItem>
              <Chip size="lg" className="bg-transparent border border-foreground">
                Приватно
              </Chip>
            </NavbarItem>
            <NavbarItem>
              <Chip size="lg" className="bg-transparent border border-foreground">
                Реальные анкеты
              </Chip>
            </NavbarItem>
            <NavbarItem>
              <Chip size="lg" className="bg-transparent border border-foreground">
                Общайся бесплатно
              </Chip>
            </NavbarItem>
          </NavbarContent>
        </HeroUINavbar>
      </motion.div>
    </div>
  );
};

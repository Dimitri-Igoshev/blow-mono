import { ROUTES } from "@/app/routes";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "BLOW",
  description: "Знакомства для содержанок и спонсоров. Мужчины и девушки для взаимовыгодных отношений и приятного досуга.",
  navItems: [
    {
      label: "Главная",
      href: "/",
    },
    {
      label: "Docs",
      href: "/docs",
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Профиль",
      href: ROUTES.PROFILE,
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
};

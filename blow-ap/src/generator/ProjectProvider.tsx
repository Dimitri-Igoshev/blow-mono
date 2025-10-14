import React, { createContext, useContext, useEffect, useState } from "react";

import api from "@/lib/axios";
import { ENV } from "@/config/env"

export type Project = {
  name: string;
  description?: string;
  slug: string;
  apiUrl: string;
  apiMediaUrl: string;
  token: {
    email: string;
    password: string;
  };
  config: {
    themeColors: {
      primary: string;
      secondary: string;
    };
    faviconUrl: string;
    logoUrl: string;
    logoBigUrl: string;
    bgUrl: string;
  };
};

type ProjectContextType = {
  project: Project | null;
  loading: boolean;
};

const ProjectContext = createContext<ProjectContextType>({
  project: null,
  loading: true,
});

export const useProject = () => useContext(ProjectContext);

export const ProjectProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let slug;

    if (localStorage.getItem("project")) {
      slug = localStorage.getItem("project");
    } else {
      slug = new URLSearchParams(window.location.search).get("project") || "";
      localStorage.setItem("project", slug);
    }

    // api
    //   .get<Project>(`/projects/slug/${slug}`)
    //   .then((res) => {
    setProject({
      // _id: "687059ff52b5bebf3df39225",
      name: "Blow",
      slug: "blow",
      // apiUrl: "https://api.blow.ru/api",
      apiUrl: ENV.API_URL,
      config: {
        themeColors: {
          primary: "#E31E24",
          secondary: "#2B2A29",
        },
        bgUrl: `${ENV.MEDIA_URL}/core/bg-blow.png`,
        logoUrl: `${ENV.MEDIA_URL}/core/BLOW%201.png`,
        logoBigUrl: `${ENV.MEDIA_URL}/core/BLOW%202.png`,
        faviconUrl: `${ENV.MEDIA_URL}/core/favicon.ico`,
      },
      // owner: "68704800696a9aa45ce211a9",
      // members: [
      //     "68704800696a9aa45ce211a9"
      // ],
      // status: "active",
      // createdAt: "2025-07-11T00:25:35.421Z",
      // updatedAt: "2025-07-11T00:25:35.421Z",
      // __v: 0,
      description: "Поиск лучших содержанок и самых успешных мужчин",
      // apiMediaUrl: "https://api.blow.ru",
      apiMediaUrl: ENV.MEDIA_URL,
      token: {
        email: "dimi.igoshev@gmail.com",
        password: "mungic-gysky9-Basjap",
      },
    });
    // applyTheme(res.data);
    // })
    // .catch((err) => {
    //   console.error('Ошибка загрузки проекта:', err);
    // })
    // .finally(() => {
    //   setLoading(false);
    // });
  }, []);

  return (
    <ProjectContext.Provider value={{ project, loading }}>
      {loading ? null : children}
    </ProjectContext.Provider>
  );
};

function applyTheme(project: Project) {
  const root = document.documentElement;
  const { primary, secondary } = project.config.themeColors;

  root.style.setProperty("--color-primary", primary);
  root.style.setProperty("--color-secondary", secondary);

  // Title
  if (project.name) {
    document.title = `${project.name} — Панель управления`;
  }

  // Description
  const description = project?.description || "Панель управления";

  //@ts-ignore
  setOrUpdateMetaTag("og:description", description);
  //@ts-ignore
  setOrUpdateMetaTag("description", description);

  // og:title
  //@ts-ignore
  setOrUpdateMetaTag("og:title", project.name);

  // favicon
  if (project.config?.faviconUrl) {
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;

    if (link) {
      link.href = project.config.faviconUrl;
    }
  } else {
    console.warn("⚠️ faviconUrl не указан в проекте — используется дефолтный");
  }
}

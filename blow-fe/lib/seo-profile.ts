// компактный нормализатор и "умный" description для профиля
export function cut(s: string, n = 180) {
  if (!s) return "";
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > n ? t.slice(0, n - 1).trimEnd() + "…" : t;
}

type P = {
  firstName?: string;
  name?: string;
  sex?: "male" | "female";
  age?: number;
  city?: string;
  about?: string;
  sponsor?: boolean;
  relationships?: boolean;
  evening?: boolean;
  traveling?: boolean;
  photos?: Array<{ url?: string } | string>;
  createdAt?: string | number | Date;
};

export function makeProfileTitle(p: P) {
  const nm = p.firstName || p.name || "Профиль";
  const age = p.age ? `, ${p.age}` : "";
  const city = p.city ? ` — ${p.city}` : "";
  return `${nm}${age}${city}`;
}

export function makeProfileDescription(p: P): string {
  // безопасные геттеры
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const hasText = (v: unknown) => typeof v === "string" && v.trim().length > 0;

  // 1) приоритет — about
  if (hasText(p?.about)) {
    return `${makeProfileTitle(p)} ${cut(str(p.about).trim(), 180)}`;
  }

  // 2) факты анкеты (всё с фоллбэками)
  const sex = str((p as any)?.sex);
  const who =
    hasText((p as any)?.firstName)
      ? str((p as any).firstName).trim()
      : sex === "male"
        ? "мужчина"
        : sex === "female"
          ? "девушка"
          : "пользователь";

  const agePart = Number.isFinite((p as any)?.age)
    ? `${Number((p as any).age)} лет`
    : "";

  const cityPart = hasText((p as any)?.city)
    ? str((p as any).city).trim()
    : "";

  const withPhoto =
    Array.isArray((p as any)?.photos) && (p as any).photos.length > 0
      ? " С фотографиями."
      : "";

  const goals: string[] = [];
  if ((p as any)?.sponsor) goals.push(sex === "male" ? "стану спонсором" : "ищу спонсора");
  if ((p as any)?.relationships) goals.push("серьёзные отношения");
  if ((p as any)?.evening) goals.push("провести вечер");
  if ( (p as any)?.traveling) goals.push("совместные путешествия");

  const bits = [
    who,
    agePart,
    cityPart && `— ${cityPart}`,
  ].filter(Boolean) as string[];

  const head = bits.join(", ").replace(", —", " —"); // косметика

  const goalsPart = goals.length ? ` Цели: ${goals.join(", ")}.` : "";

  const base = `${head}. Анкета на BLOW.${withPhoto}${goalsPart} - ${p?.createdAt}`;

  return cut(base, 180);
}

/** Решаем, индексировать ли профиль.
 * Если вообще нет возраста, города и целей, и нет about — лучше noindex, чтобы не плодить дублей.
 */
export function shouldIndexProfile(p: P) {
  const hasAbout = Boolean(p.about && p.about.trim());
  const hasAny =
    hasAbout ||
    Boolean(p.age) ||
    Boolean(p.city) ||
    Boolean(p.sponsor || p.relationships || p.evening || p.traveling);
  return hasAny;
}

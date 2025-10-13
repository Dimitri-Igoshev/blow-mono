const getEnv = (key: string, fallback?: string) => {
  const value = process.env[key];

  if (value === undefined || value === "") {
    return fallback;
  }

  return value;
};

const pickEnv = (...keys: string[]) => {
  for (const key of keys) {
    const value = getEnv(key);

    if (value !== undefined) {
      return value;
    }
  }

  return undefined;
};

const ensureHttps = (rawUrl: string) => {
  try {
    const url = new URL(rawUrl);

    if (url.protocol === "http:" && url.hostname.endsWith("kutumba.ru")) {
      url.protocol = "https:";

      return url.toString();
    }

    return url.toString();
  } catch {
    // Ignore invalid URLs and return the original value.
  }

  return rawUrl;
};

const isRelativeUrl = (value: string) => /^(\.\/|\.\.\/|\/)/.test(value);

const normalizeProxyPath = (value: string) => {
  if (!value) {
    return "/api/proxy";
  }

  if (isRelativeUrl(value)) {
    return value.startsWith("/") ? value : `/${value}`;
  }

  return value;
};

const pickServerApiUrl = () => {
  const backendUrl = pickEnv("NEXT_PUBLIC_BACKEND_URL", "API_INTERNAL_BASE");

  if (backendUrl && !isRelativeUrl(backendUrl)) {
    return ensureHttps(backendUrl);
  }

  const publicApiUrl = pickEnv("NEXT_PUBLIC_API_URL", "NEXT_PUBLIC_API_BASE");

  if (publicApiUrl && !isRelativeUrl(publicApiUrl)) {
    return ensureHttps(publicApiUrl);
  }

  return ensureHttps("https://api.kutumba.ru/api");
};

const serverApiUrl = pickServerApiUrl();

const proxyPath = normalizeProxyPath(
  getEnv("NEXT_PUBLIC_API_PROXY_PATH", "/api/proxy")!,
);

const browserFallbackPath = normalizeProxyPath(
  getEnv("NEXT_PUBLIC_API_BROWSER_FALLBACK_PATH", "/api"),
);

const getBrowserApiUrl = () => {
  const explicitUrl = pickEnv("NEXT_PUBLIC_API_URL", "NEXT_PUBLIC_API_BASE");

  if (!explicitUrl) {
    if (browserFallbackPath) {
      return browserFallbackPath;
    }

    return proxyPath;
  }

  if (isRelativeUrl(explicitUrl)) {
    return explicitUrl;
  }

  try {
    const parsed = new URL(explicitUrl);

    if (
      typeof window !== "undefined" &&
      parsed.origin !== window.location.origin
    ) {
      return proxyPath;
    }

    return ensureHttps(parsed.toString());
  } catch {
    return explicitUrl;
  }
};

const apiUrl =
  typeof window === "undefined" ? serverApiUrl : getBrowserApiUrl();

const mediaUrl = ensureHttps(
  getEnv("NEXT_PUBLIC_MEDIA_URL") ||
    new URL(
      "..",
      serverApiUrl.endsWith("/") ? serverApiUrl : `${serverApiUrl}/`,
    )
      .toString()
      .replace(/\/$/, ""),
);

export const config = {
  API_URL: apiUrl,
  SERVER_API_URL: serverApiUrl,
  API_PROXY_PATH: proxyPath,
  API_PROXY_TARGET: serverApiUrl,
  MEDIA_URL: mediaUrl,
  NEXT_PUBLIC_APP_URL: getEnv("NEXT_PUBLIC_APP_URL", "https://kutumba.ru"),
  NEXT_PUBLIC_API_URL: apiUrl,
  NEXT_PUBLIC_API_BASE: apiUrl,
  NEXT_PUBLIC_YOOMONEY_CLIENT_ID: getEnv("NEXT_PUBLIC_YOOMONEY_CLIENT_ID"),
  NEXT_YOOMONEY_CLIENT_SECRET: getEnv("NEXT_YOOMONEY_CLIENT_SECRET"),
  YOOMONEY_REDIRECT_URI: getEnv("YOOMONEY_REDIRECT_URI"),
  YOOMONEY_NOTIFICATION_SECRET: getEnv("YOOMONEY_NOTIFICATION_SECRET"),
  TBANK_TERMINAL_KEY: getEnv("TBANK_TERMINAL_KEY"),
  TBANK_PASSWORD: getEnv("TBANK_PASSWORD"),
};

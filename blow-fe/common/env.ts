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

const hasProtocol = /^[a-zA-Z][a-zA-Z\d+-.]*:\/\//;
const hasScheme = /^[a-zA-Z][a-zA-Z\d+-.]*:/;

const appendProtocol = (value: string, protocol: "http:" | "https:") => {
  if (hasProtocol.test(value)) {
    return value;
  }

  const normalized = value.startsWith("//") ? value.slice(2) : value;

  return `${protocol}//${normalized}`;
};

const isProbablyLocalhost = (value: string) =>
  /(^|\/\/)(localhost|127\.0\.0\.1)(?::\d+)?(\/|$)/i.test(value);

const normalizeAppUrl = (rawUrl: string) => {
  const trimmed = rawUrl.trim();

  if (!trimmed) {
    return trimmed;
  }

  const defaultProtocol = isProbablyLocalhost(trimmed) ? "http:" : "https:";

  return ensureHttps(appendProtocol(trimmed, defaultProtocol));
};

const ensureApiUrl = (rawUrl: string) => {
  const secured = ensureHttps(rawUrl);

  try {
    const url = new URL(secured);

    return url.toString();
  } catch {
    // Ignore invalid URLs and return the original value.
  }

  return secured;
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
    return ensureApiUrl(backendUrl);
  }

  const publicApiUrl = pickEnv("NEXT_PUBLIC_API_URL", "NEXT_PUBLIC_API_BASE");

  if (publicApiUrl && !isRelativeUrl(publicApiUrl)) {
    return ensureApiUrl(publicApiUrl);
  }

  return ensureApiUrl("https://kutumba.ru/api");
};

const pickAppUrl = () => {
  const explicitAppUrl = getEnv("NEXT_PUBLIC_APP_URL");

  if (explicitAppUrl) {
    return normalizeAppUrl(explicitAppUrl);
  }

  const vercelUrl = getEnv("VERCEL_URL");

  if (vercelUrl) {
    return normalizeAppUrl(vercelUrl);
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "http://localhost:3000";
};

const getBrowserApiUrl = (
  serverApiUrl: string,
  proxyPath: string,
  browserFallbackPath: string,
) => {
  const explicitUrl =
    pickEnv("NEXT_PUBLIC_API_URL", "NEXT_PUBLIC_API_BASE") ?? serverApiUrl;

  if (!explicitUrl) {
    return browserFallbackPath || proxyPath;
  }

  if (isRelativeUrl(explicitUrl)) {
    return explicitUrl;
  }

  try {
    const parsed = new URL(explicitUrl);

    return ensureApiUrl(parsed.toString());
  } catch {
    return explicitUrl;
  }
};

const createConfig = () => {
  const serverApiUrl = pickServerApiUrl();
  const proxyPath = normalizeProxyPath(
    getEnv("NEXT_PUBLIC_API_PROXY_PATH", "/api/proxy")!,
  );
  const browserFallbackPath = normalizeProxyPath(
    getEnv("NEXT_PUBLIC_API_BROWSER_FALLBACK_PATH", "/api") ?? "/api",
  );

  const apiUrl =
    typeof window === "undefined"
      ? serverApiUrl
      : getBrowserApiUrl(serverApiUrl, proxyPath, browserFallbackPath);

  const mediaUrl = ensureHttps(
    getEnv("NEXT_PUBLIC_MEDIA_URL") ||
      new URL(
        "..",
        serverApiUrl.endsWith("/") ? serverApiUrl : `${serverApiUrl}/`,
      )
        .toString()
        .replace(/\/$/, ""),
  );

  return {
    API_URL: apiUrl,
    SERVER_API_URL: serverApiUrl,
    API_PROXY_PATH: proxyPath,
    API_PROXY_TARGET: serverApiUrl,
    MEDIA_URL: mediaUrl,
    NEXT_PUBLIC_APP_URL: pickAppUrl(),
    NEXT_PUBLIC_API_URL: apiUrl,
    NEXT_PUBLIC_API_BASE: apiUrl,
    NEXT_PUBLIC_YOOMONEY_CLIENT_ID: getEnv("NEXT_PUBLIC_YOOMONEY_CLIENT_ID"),
    NEXT_YOOMONEY_CLIENT_SECRET: getEnv("NEXT_YOOMONEY_CLIENT_SECRET"),
    YOOMONEY_REDIRECT_URI: getEnv("YOOMONEY_REDIRECT_URI"),
    YOOMONEY_NOTIFICATION_SECRET: getEnv("YOOMONEY_NOTIFICATION_SECRET"),
    TBANK_TERMINAL_KEY: getEnv("TBANK_TERMINAL_KEY"),
    TBANK_PASSWORD: getEnv("TBANK_PASSWORD"),
  } as const;
};

type AppConfig = ReturnType<typeof createConfig>;

let cachedConfig: AppConfig | null = null;

const resolveConfig = (): AppConfig => {
  if (process.env.NODE_ENV !== "development") {
    if (!cachedConfig) {
      cachedConfig = createConfig();
    }
    return cachedConfig;
  }

  return createConfig();
};

export const config: AppConfig = new Proxy({} as AppConfig, {
  get(_target, prop) {
    return resolveConfig()[prop as keyof AppConfig];
  },
  ownKeys() {
    return Reflect.ownKeys(resolveConfig());
  },
  getOwnPropertyDescriptor(_target, prop) {
    const value = resolveConfig()[prop as keyof AppConfig];
    return {
      configurable: true,
      enumerable: true,
      value,
      writable: false,
    };
  },
});

const trimLeadingSlashes = (value: string) => value.replace(/^\/+/, "");
const trimTrailingSlashes = (value: string) => value.replace(/\/+$/, "");

const ensureHttpScheme = (rawUrl: string) =>
  hasProtocol.test(rawUrl) ? ensureHttps(rawUrl) : rawUrl;

export const resolveMediaUrl = (path?: string | null) => {
  if (!path) {
    return undefined;
  }

  if (hasScheme.test(path)) {
    return ensureHttpScheme(path);
  }

  const base = trimTrailingSlashes(config.MEDIA_URL);
  const normalizedPath = trimLeadingSlashes(path);

  if (!normalizedPath) {
    return base;
  }

  return `${base}/${normalizedPath}`;
};

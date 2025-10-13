const getEnv = (key: string, fallback?: string) => {
  const value = process.env[key];
  if (value === undefined || value === "") {
    return fallback;
  }
  return value;
};

const apiUrl =
  getEnv("NEXT_PUBLIC_API_URL") ||
  getEnv("NEXT_PUBLIC_BACKEND_URL") ||
  "https://api.kutumba.ru/api";

const mediaUrl =
  getEnv("NEXT_PUBLIC_MEDIA_URL") ||
  new URL("..", apiUrl.endsWith("/") ? apiUrl : `${apiUrl}/`).toString().replace(/\/$/, "");

export const config = {
  API_URL: apiUrl,
  MEDIA_URL: mediaUrl,
  NEXT_PUBLIC_APP_URL: getEnv("NEXT_PUBLIC_APP_URL", "https://kutumba.ru"),
  NEXT_PUBLIC_API_URL: apiUrl,
  NEXT_PUBLIC_YOOMONEY_CLIENT_ID: getEnv("NEXT_PUBLIC_YOOMONEY_CLIENT_ID"),
  NEXT_YOOMONEY_CLIENT_SECRET: getEnv("NEXT_YOOMONEY_CLIENT_SECRET"),
  YOOMONEY_REDIRECT_URI: getEnv("YOOMONEY_REDIRECT_URI"),
  YOOMONEY_NOTIFICATION_SECRET: getEnv("YOOMONEY_NOTIFICATION_SECRET"),
  TBANK_TERMINAL_KEY: getEnv("TBANK_TERMINAL_KEY"),
  TBANK_PASSWORD: getEnv("TBANK_PASSWORD"),
};

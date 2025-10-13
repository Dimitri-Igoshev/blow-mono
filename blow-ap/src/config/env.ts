const apiUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "https://api.kutumba.ru/api";

const mediaUrl =
  import.meta.env.VITE_MEDIA_URL ||
  new URL("..", apiUrl.endsWith("/") ? apiUrl : `${apiUrl}/`).toString().replace(/\/$/, "");

export const ENV = {
  API_URL: apiUrl,
  MEDIA_URL: mediaUrl,
};

// src/auth/getRoles.ts
import { jwtDecode } from "jwt-decode";

type JwtAny = {
  role?: string | string[];
  roles?: string[];
  // частые варианты:
  "https://schemas.example.com/roles"?: string[];
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
  realm_access?: { roles?: string[] }; // Keycloak
};

export function getRolesFromToken(token?: string | null): string[] {
  if (!token) return [];
  const t = token.replace(/^Bearer\s+/i, "");
  const payload = jwtDecode<JwtAny>(t);

  // нормализация
  const bag = new Set<string>([
    ...(Array.isArray(payload.role) ? payload.role : payload.role ? [payload.role] : []),
    ...(payload.roles ?? []),
    ...(payload["https://schemas.example.com/roles"] ?? []),
    ...(payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      ? [payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] as string]
      : []),
    ...(payload.realm_access?.roles ?? []),
  ]);

  return [...bag];
}

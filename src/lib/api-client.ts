export type ProfileType = "PROFESOR" | "ESTUDIANTE";
export type TeacherVerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";
export type Stage = "CONCEPTOS_CLAVE" | "IMPLEMENTACION_TECNICA";
export type JoinRequestStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ProfileTrack = "TEACHER" | "STUDENT";

export interface SessionUser {
  id: string;
  email: string;
  displayName: string | null;
  profileType: ProfileType;
  isAdmin: boolean;
  teacherVerificationStatus?: TeacherVerificationStatus;
  hasCompletedRouteAPreview?: boolean;
}

export interface Community {
  id: string;
  name: string;
  topic: string;
  profileTrack: ProfileTrack;
  stage: Stage;
  graduated?: boolean;
  memberCount?: number;
  teacher?: { id: string; displayName: string | null };
}

export interface JoinRequestSummary {
  id: string;
  status: JoinRequestStatus;
  rejectReason: string | null;
  createdAt: string;
  reviewedAt: string | null;
  community: Pick<Community, "id" | "name" | "profileTrack" | "stage">;
}

// ── Error uniforme ───────────────────────────────────────────────────────────

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    credentials: "include", // viaja la cookie de sesión de Better Auth
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  // 204 / sin body.
  const raw = await res.text();
  const data = raw ? JSON.parse(raw) : null;

  if (!res.ok) {
    const message =
      (data && (data.error ?? data.message)) || `Error ${res.status}`;
    throw new ApiError(res.status, message);
  }

  return data as T;
}

// ── Auth ─────────────────────────────────────────────────────────────────────

/**
 * Sesión actual, leída directamente del endpoint de Better Auth
 * (GET /api/auth/get-session). Devuelve null si no hay sesión.
 *
 * Se usa esto (y no Astro.locals.user) en cualquier componente que viva en
 * una página con `prerender = true` (como la landing), porque ahí no hay
 * request en tiempo real y el middleware nunca corre.
 */
export async function getSession(): Promise<SessionUser | null> {
  try {
    const data = await apiFetch<{ user: Record<string, any> } | null>(
      "/api/auth/get-session",
      { method: "GET" },
    );
    if (!data?.user) return null;
    const u = data.user;
    return {
      id: u.id,
      email: u.email,
      displayName: u.displayName ?? u.name ?? null,
      profileType: u.profileType,
      isAdmin: Boolean(u.isAdmin),
      teacherVerificationStatus: u.teacherVerificationStatus,
      hasCompletedRouteAPreview: Boolean(u.hasCompletedRouteAPreview),
    };
  } catch {
    // Sin sesión / error de red → tratamos como "no autenticado".
    return null;
  }
}

export function register(input: {
  email: string;
  password: string;
  profileType: ProfileType;
  displayName?: string;
  turnstileToken: string;
  // Campos extra de Profesor/instructor. OJO: el backend todavía NO los
  // persiste (User no tiene country/institution/wantsCommunity y register.js
  // no los reenvía). Se envían ya para que, al agregar soporte en el backend,
  // funcione sin tocar el front.
  country?: string;
  institution?: string;
  wantsCommunity?: boolean;
}) {
  return apiFetch<{ user: { id: string; email: string; profileType: ProfileType } }>(
    "/api/auth/register",
    { method: "POST", body: JSON.stringify(input) },
  );
}

export function login(input: { email: string; password: string }) {
  // Nota: /api/auth/login solo devuelve {id, email, profileType, isAdmin} —
  // no displayName ni teacherVerificationStatus. Para el perfil completo tras
  // iniciar sesión, usar getSession() (lee /api/auth/get-session).
  return apiFetch<{
    user: Pick<SessionUser, "id" | "email" | "profileType" | "isAdmin">;
  }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function logout() {
  return apiFetch<{ ok: true }>("/api/auth/logout", { method: "POST" });
}

// ── Comunidades / perfil ─────────────────────────────────────────────────────

export function listCommunities() {
  return apiFetch<{ communities: Community[] }>("/api/communities");
}

export function createCommunity(input: {
  name: string;
  topic: string;
  profileTrack: ProfileTrack;
}) {
  return apiFetch<{ community: Community }>("/api/communities", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getCommunityStatus() {
  return apiFetch<{
    hasCommunity: boolean;
    owned: Community[];
    member: Community[];
  }>("/api/users/me/community-status");
}

export function getMyJoinRequests() {
  return apiFetch<{ requests: JoinRequestSummary[] }>(
    "/api/users/me/join-requests",
  );
}

export function requestToJoinCommunity(communityId: string) {
  return apiFetch<{ joinRequest: { id: string; status: JoinRequestStatus } }>(
    `/api/communities/${communityId}/join-requests`,
    { method: "POST" },
  );
}

export function getCommunityMembers(communityId: string) {
  return apiFetch<{
    community: Pick<Community, "id" | "name" | "profileTrack" | "stage">;
    members: Array<{
      id: string;
      email: string;
      displayName: string | null;
      role: string;
      isOwner: boolean;
      joinedAt: string | null;
      progress: number;
    }>;
    memberCount: number;
  }>(`/api/communities/${communityId}/members`);
}

export function getCommunityChallenges(communityId: string) {
  return apiFetch<{
    challenges: Array<{
      id: string;
      title: string;
      summary: string | null;
      requiredStage: Stage;
      createdAt: string;
    }>;
  }>(`/api/communities/${communityId}/challenges`);
}

export function updateRoutePreviewProgress() {
  return apiFetch<{ hasCompletedRouteAPreview: boolean }>(
    "/api/users/me/route-preview-progress",
    { method: "PATCH" },
  );
}

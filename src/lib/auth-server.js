import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "./prisma.js";

const SECRET = process.env.BETTER_AUTH_SECRET;
if (!SECRET) {
  throw new Error(
    "[auth-server] Falta la variable de entorno BETTER_AUTH_SECRET. " +
      "Genera una cadena larga y aleatoria y agrégala a tu .env " +
      "(ej: openssl rand -base64 32).",
  );
}

const PROFILE_TYPES = ["PROFESOR", "ESTUDIANTE"];

export const auth = betterAuth({
  secret: SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:4321",

  database: prismaAdapter(prisma, { provider: "sqlite" }),

  // ── Email + password ────────────────────────────────────────────────────
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
  },

  advanced: {
    cookiePrefix: "ua",
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 días, igual que el JWT anterior
    updateAge: 60 * 60 * 24, // renueva si queda a menos de 1 día de expirar
  },

  user: {
    fields: {
      name: "displayName",
    },
    additionalFields: {
      profileType: {
        type: "string",
        required: true,
        input: true,
      },
      // Extra de Profesor/instructor — opcionales, aceptables desde el
      // body de /sign-up/email. Se saltean/ignoran para ESTUDIANTE en
      // register.js antes de llegar acá.
      country: { type: "string", required: false, input: true },
      institution: { type: "string", required: false, input: true },
      wantsCommunity: {
        type: "boolean",
        required: false,
        input: true,
        defaultValue: false,
      },
      // El resto son server-only: nunca se aceptan desde el cliente
      isAdmin: { type: "boolean", required: false, input: false, defaultValue: false },
      teacherVerificationStatus: {
        type: "string",
        required: false,
        input: false,
        defaultValue: "PENDING",
      },
      hasCompletedRouteAPreview: {
        type: "boolean",
        required: false,
        input: false,
        defaultValue: false,
      },
    },
  },

  // ── Reglas de negocio en el momento de creación del usuario ──────────────
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (!PROFILE_TYPES.includes(user.profileType)) {
            throw new Error("profileType debe ser PROFESOR o ESTUDIANTE.");
          }
          return {
            data: {
              ...user,
              isAdmin: false,
              teacherVerificationStatus: "PENDING",
            },
          };
        },
      },
    },
  },
});

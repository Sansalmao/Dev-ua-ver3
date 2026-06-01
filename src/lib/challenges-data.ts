import { z } from "zod";

// Tipos básicos
export interface ChallengeModule {
  id: string;
  title: string;
  subtitle: string;
  accentHex: string;
  lightHex: string;
  borderHex: string;
}

export interface ChallengeCard {
  id: string;
  title: string;
  lang: string;
}

// RetoFrontmatter — schema de validación para el frontmatter de los retos
export const retoFrontmatterSchema = z.object({
  moduleId: z.string(),
  challengeId: z.string(),
  moduleTitle: z.string(),
  moduleDesc: z.string(),
  exerciseNum: z.string(),
  exerciseTitle: z.string(),
  exerciseItems: z.array(z.string()),
  solutionLang: z.enum(["java", "javascript", "python", "sql", "text"]),
  solutionCode: z.string(),
  draft: z.boolean().default(false),
});

export type RetoFrontmatter = z.infer<typeof retoFrontmatterSchema>;

// ─────────────────────────────────────────────────────────────
// EDUCATOR (profesor) – rutas básica y avanzada
// ─────────────────────────────────────────────────────────────
export const EDUCATOR_CHALLENGE_MODULES: ChallengeModule[] = [
  {
    id: "mod1",
    title: "Module 1",
    subtitle: "Unicode Programming Fundamentals",
    accentHex: "#e5621a",
    lightHex: "#fff7ed",
    borderHex: "#fed7aa",
  },
  {
    id: "mod2",
    title: "Module 2",
    subtitle: "Unicode Advanced Programming",
    accentHex: "#e5621a",
    lightHex: "#fff7ed",
    borderHex: "#fed7aa",
  },
  {
    id: "mod3",
    title: "Module 3",
    subtitle: "Unicode in Data Structures and Algorithms",
    accentHex: "#e5621a",
    lightHex: "#fff7ed",
    borderHex: "#fed7aa",
  },
  {
    id: "mod4",
    title: "Module 4",
    subtitle: "Unicode in Database Systems",
    accentHex: "#e5621a",
    lightHex: "#fff7ed",
    borderHex: "#fed7aa",
  },
  {
    id: "mod5",
    title: "Module 5",
    subtitle: "Unicode in Web Development",
    accentHex: "#e5621a",
    lightHex: "#fff7ed",
    borderHex: "#fed7aa",
  },
];

export const EDUCATOR_CHALLENGE_CARDS: Record<string, ChallengeCard[]> = {
  mod1: [
    { id: "c1", title: "Exercise 1", lang: "java" },
    { id: "c2", title: "Exercise 2", lang: "java" },
    { id: "c3", title: "Exercise 3", lang: "java" },
    { id: "c4", title: "Exercise 4", lang: "java" },
  ],
  mod2: [
    { id: "c1", title: "Exercise 1", lang: "java" },
    { id: "c2", title: "Exercise 2", lang: "java" },
    { id: "c3", title: "Exercise 3", lang: "java" },
    { id: "c4", title: "Exercise 4", lang: "java" },
  ],
  mod3: [
    { id: "c1", title: "Exercise 1", lang: "java" },
    { id: "c2", title: "Exercise 2", lang: "java" },
    { id: "c3", title: "Exercise 3", lang: "java" },
    { id: "c4", title: "Exercise 4", lang: "java" },
  ],
  mod4: [
    { id: "c1", title: "Exercise 1", lang: "java" },
    { id: "c2", title: "Exercise 2", lang: "java" },
    { id: "c3", title: "Exercise 3", lang: "java" },
    { id: "c4", title: "Exercise 4", lang: "java" },
  ],
  mod5: [
    { id: "c1", title: "Exercise 1", lang: "java" },
    { id: "c2", title: "Exercise 2", lang: "java" },
    { id: "c3", title: "Exercise 3", lang: "java" },
    { id: "c4", title: "Exercise 4", lang: "java" },
  ],
};

// ─────────────────────────────────────────────────────────────
// LEARNER (estudiante) – ruta básica (módulos 1-4 con cantidades variables)
// ─────────────────────────────────────────────────────────────
export const LEARNER_CHALLENGE_MODULES: ChallengeModule[] = [
  {
    id: "mod1",
    title: "Module 1",
    subtitle: "Unicode Programming Fundamentals",
    accentHex: "#e5621a",
    lightHex: "#fff7ed",
    borderHex: "#fed7aa",
  },
  {
    id: "mod2",
    title: "Module 2",
    subtitle: "Unicode Advanced Programming",
    accentHex: "#e5621a",
    lightHex: "#fff7ed",
    borderHex: "#fed7aa",
  },
  {
    id: "mod3",
    title: "Module 3",
    subtitle: "Unicode in Data Structures and Algorithms",
    accentHex: "#e5621a",
    lightHex: "#fff7ed",
    borderHex: "#fed7aa",
  },
  {
    id: "mod4",
    title: "Module 4",
    subtitle: "Unicode in Database Systems",
    accentHex: "#e5621a",
    lightHex: "#fff7ed",
    borderHex: "#fed7aa",
  },
];

export const LEARNER_CHALLENGE_CARDS: Record<string, ChallengeCard[]> = {
  mod1: [
    { id: "c1", title: "Exercise 1", lang: "java" },
    { id: "c2", title: "Exercise 2", lang: "java" },
    { id: "c3", title: "Exercise 3", lang: "java" },
    { id: "c4", title: "Exercise 4", lang: "java" },
  ],
  mod2: [
    { id: "c1", title: "Exercise 1", lang: "java" },
    { id: "c2", title: "Exercise 2", lang: "java" },
    { id: "c3", title: "Exercise 3", lang: "java" },
  ],
  mod3: [
    { id: "c1", title: "Exercise 1", lang: "java" },
    { id: "c2", title: "Exercise 2", lang: "java" },
  ],
  mod4: [
    { id: "c1", title: "Exercise 1", lang: "sql" },
    { id: "c2", title: "Exercise 2", lang: "sql" },
    { id: "c3", title: "Exercise 3", lang: "sql" },
  ],
};

// ─────────────────────────────────────────────────────────────
// LEARNER – ruta avanzada (Implementación Técnica) – módulos 5-8
// ─────────────────────────────────────────────────────────────
export const LEARNER_ADVANCED_MODULES: ChallengeModule[] = [
  {
    id: "mod5",
    title: "Module 5",
    subtitle: "Introducing Internationalized Domain Names (IDNs)",
    accentHex: "#e5621a",
    lightHex: "#fff7ed",
    borderHex: "#fed7aa",
  },
  {
    id: "mod6",
    title: "Module 6",
    subtitle: "Programming with Internationalized Domain Names (IDNs)",
    accentHex: "#e5621a",
    lightHex: "#fff7ed",
    borderHex: "#fed7aa",
  },
  {
    id: "mod7",
    title: "Module 7",
    subtitle: "Email Address Internationalization (EAI)",
    accentHex: "#e5621a",
    lightHex: "#fff7ed",
    borderHex: "#fed7aa",
  },
  {
    id: "mod8",
    title: "Module 8",
    subtitle: "Advanced Topics in Internationalized Domain Names (IDNs)",
    accentHex: "#e5621a",
    lightHex: "#fff7ed",
    borderHex: "#fed7aa",
  },
  {
    id: "mod9",
    title: "Module 9",
    subtitle: "Advanced Topics in Internationalized Domain Names (IDNs)",
    accentHex: "#e5621a",
    lightHex: "#fff7ed",
    borderHex: "#fed7aa",
  },
  {
    id: "mod10",
    title: "Module 10",
    subtitle: "Advanced Topics in Internationalized Domain Names (IDNs)",
    accentHex: "#e5621a",
    lightHex: "#fff7ed",
    borderHex: "#fed7aa",
  },
  {
    id: "mod11",
    title: "Module 11",
    subtitle: "Advanced Topics in Internationalized Domain Names (IDNs)",
    accentHex: "#e5621a",
    lightHex: "#fff7ed",
    borderHex: "#fed7aa",
  },
  {
    id: "mod12",
    title: "Module 12",
    subtitle: "Advanced Topics in Internationalized Domain Names (IDNs)",
    accentHex: "#e5621a",
    lightHex: "#fff7ed",
    borderHex: "#fed7aa",
  },
];

export const LEARNER_ADVANCED_CARDS: Record<string, ChallengeCard[]> = {
  mod5: [
    { id: "c1", title: "Exercise 1", lang: "text" },
    { id: "c2", title: "Exercise 2", lang: "text" },
    { id: "c3", title: "Exercise 3", lang: "text" },
    { id: "c4", title: "Exercise 4", lang: "text" },
    { id: "c5", title: "Exercise 5", lang: "text" },
  ],
  mod6: [
    { id: "c1", title: "Exercise 1", lang: "java" },
    { id: "c2", title: "Exercise 2", lang: "java" },
  ],
  mod7: [
    { id: "c1", title: "Exercise 1", lang: "text" },
    { id: "c2", title: "Exercise 2", lang: "text" },
    { id: "c3", title: "Exercise 3", lang: "text" },
  ],
  mod8: [
    { id: "c1", title: "Exercise 1", lang: "java" },
    { id: "c2", title: "Exercise 2", lang: "java" },
    { id: "c3", title: "Exercise 3", lang: "java" },
    { id: "c4", title: "Exercise 4", lang: "java" },
  ],
  mod9: [
    { id: "c1", title: "Exercise 1", lang: "python" },
    { id: "c2", title: "Exercise 2", lang: "java" },
  ],
  mod10: [
    { id: "c1", title: "Exercise 1", lang: "java" },
    { id: "c2", title: "Exercise 2", lang: "java" },
  ],
  mod11: [
    { id: "c1", title: "Exercise 1", lang: "text" },
    { id: "c2", title: "Exercise 2", lang: "text" },
    { id: "c3", title: "Exercise 3", lang: "text" },
  ],
  mod12: [
    { id: "c1", title: "Exercise 1", lang: "bash" },
    { id: "c2", title: "Exercise 2", lang: "bash" },
    { id: "c3", title: "Exercise 3", lang: "text" },
  ],
};

// ─────────────────────────────────────────────────────────────
// HELPERS – calcular totales por perfil/ruta
// ─────────────────────────────────────────────────────────────
export function getTotalChallenges(
  profile: "educator" | "learner",
  routeType: "basica" | "avanzada" = "basica",
): number {
  if (profile === "educator") {
    return Object.values(EDUCATOR_CHALLENGE_CARDS).reduce(
      (sum, cards) => sum + cards.length,
      0,
    );
  } else {
    if (routeType === "avanzada") {
      return Object.values(LEARNER_ADVANCED_CARDS).reduce(
        (sum, cards) => sum + cards.length,
        0,
      );
    } else {
      return Object.values(LEARNER_CHALLENGE_CARDS).reduce(
        (sum, cards) => sum + cards.length,
        0,
      );
    }
  }
}

// Mapas para acceso rápido (no usados en cliente pero se exportan por si acaso)
export const EDUCATOR_MODULE_MAP: Record<string, ChallengeModule> =
  EDUCATOR_CHALLENGE_MODULES.reduce((acc, m) => ({ ...acc, [m.id]: m }), {});
export const LEARNER_MODULE_MAP: Record<string, ChallengeModule> =
  LEARNER_CHALLENGE_MODULES.reduce((acc, m) => ({ ...acc, [m.id]: m }), {});
export const LEARNER_ADVANCED_MODULE_MAP: Record<string, ChallengeModule> =
  LEARNER_ADVANCED_MODULES.reduce((acc, m) => ({ ...acc, [m.id]: m }), {});

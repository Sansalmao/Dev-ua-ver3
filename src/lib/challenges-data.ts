import { z } from "zod";

/* ══════════════════════════════════════════════════════════════════════════
   TIPOS BÁSICOS
══════════════════════════════════════════════════════════════════════════ */

export interface ChallengeModule {
  id: string; // "mod1" … "mod5"
  title: string; // "Module 1"
  subtitle: string; // "Unicode Programming Fundamentals"
  accentHex: string;
  lightHex: string;
  borderHex: string;
}

export interface ChallengeCard {
  id: string; // "c1" … "c4"
  title: string;
  lang: string; // "java", "javascript", "sql", etc.
}

/* ══════════════════════════════════════════════════════════════════════════
   SCHEMA ZOD — frontmatter de los MDX en src/data/retos/
   (común para ambos perfiles)
══════════════════════════════════════════════════════════════════════════ */

export const retoFrontmatterSchema = z.object({
  moduleId: z.string(), // "mod1"
  challengeId: z.string(), // "c1"
  moduleTitle: z.string(),
  moduleDesc: z.string(),
  exerciseNum: z.string(), // "Exercise 1"
  exerciseTitle: z.string(),
  exerciseItems: z.array(z.string()),
  solutionLang: z.enum(["java", "javascript", "python", "sql"]),
  solutionCode: z.string(),
  draft: z.boolean().default(false),
});

export type RetoFrontmatter = z.infer<typeof retoFrontmatterSchema>;

/* ══════════════════════════════════════════════════════════════════════════
   CONFIGURACIÓN PARA PERFIL EDUCATOR (profesor / instructor)
   5 módulos × 4 retos = 20 retos
══════════════════════════════════════════════════════════════════════════ */

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

/* ══════════════════════════════════════════════════════════════════════════
   CONFIGURACIÓN PARA PERFIL LEARNER (estudiante / profesional)
   4 módulos × 4 retos = 16 retos (sin el módulo 5)
══════════════════════════════════════════════════════════════════════════ */

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
};

/* ══════════════════════════════════════════════════════════════════════════
   HELPERS Y EXPORTACIONES PARA USO EN COMPONENTES
══════════════════════════════════════════════════════════════════════════ */

export const CHALLENGES_PER_MODULE = 4;

// Mapas para acceso rápido (útiles si se necesitan en el servidor)
export const EDUCATOR_MODULE_MAP: Record<string, ChallengeModule> =
  EDUCATOR_CHALLENGE_MODULES.reduce(
    (acc, m) => ({ ...acc, [m.id]: m }),
    {} as Record<string, ChallengeModule>,
  );

export const LEARNER_MODULE_MAP: Record<string, ChallengeModule> =
  LEARNER_CHALLENGE_MODULES.reduce(
    (acc, m) => ({ ...acc, [m.id]: m }),
    {} as Record<string, ChallengeModule>,
  );

// Función para obtener la configuración completa según el perfil
export function getChallengeConfig(profile: "educator" | "learner") {
  if (profile === "educator") {
    return {
      modules: EDUCATOR_CHALLENGE_MODULES,
      cards: EDUCATOR_CHALLENGE_CARDS,
      moduleMap: EDUCATOR_MODULE_MAP,
      totalChallenges:
        EDUCATOR_CHALLENGE_MODULES.length * CHALLENGES_PER_MODULE,
    };
  } else {
    return {
      modules: LEARNER_CHALLENGE_MODULES,
      cards: LEARNER_CHALLENGE_CARDS,
      moduleMap: LEARNER_MODULE_MAP,
      totalChallenges: LEARNER_CHALLENGE_MODULES.length * CHALLENGES_PER_MODULE,
    };
  }
}

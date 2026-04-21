import { z } from "zod";

/* ══════════════════════════════════════════════════════════════════════════
   TIPOS
══════════════════════════════════════════════════════════════════════════ */

export interface ChallengeModule {
  id: string; // "mod1" … "mod4"
  title: string; // "Module 1"
  subtitle: string; // "Unicode Programming Fundamentals"
  accentHex: string;
  lightHex: string;
  borderHex: string;
}

export interface ChallengeCard {
  id: string; // "c1" … "c4"
  title: string;
  desc: string;
  duration: string;
  icon: string;
}

/* ══════════════════════════════════════════════════════════════════════════
   SCHEMA ZOD — frontmatter de los MDX en src/data/retos/
   Este schema es el equivalente de moduleFrontmatterSchema para los retos.
══════════════════════════════════════════════════════════════════════════ */

export const retoFrontmatterSchema = z.object({
  moduleId: z.string(), // "mod1"
  challengeId: z.string(), // "c1"
  moduleTitle: z.string(),
  moduleDesc: z.string(),
  exerciseNum: z.string(), // "Exercise 1"
  exerciseTitle: z.string(),
  exerciseItems: z.array(z.string()),
  solutionLang: z.enum(["java", "python", "sql"]),
  solutionCode: z.string(),
  draft: z.boolean().default(false),
});

export type RetoFrontmatter = z.infer<typeof retoFrontmatterSchema>;

/* ══════════════════════════════════════════════════════════════════════════
   CHALLENGE_MODULES
   Metadatos visuales de los cuatro módulos de retos.
   Los colores usan los mismos valores que los tokens del sistema,
   escritos como hex porque el cliente JS los aplica como inline style.
══════════════════════════════════════════════════════════════════════════ */

export const CHALLENGE_MODULES: ChallengeModule[] = [
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

/* ══════════════════════════════════════════════════════════════════════════
   CHALLENGE_CARDS
   Datos de las cards del grid (ChallengesPanel).
   El contenido del ejercicio (exerciseItems, solutionCode) vive en los MDX.
══════════════════════════════════════════════════════════════════════════ */

export const CHALLENGE_CARDS: Record<string, ChallengeCard[]> = {
  mod1: [
    {
      id: "c1",
      title: "Encoding Schemes Explorer",
      desc: "Implementa una función que identifique el esquema de codificación de un string y retorne su representación en UTF-8, UTF-16 y UTF-32.",
      duration: "45 min",
      icon: "code",
    },
    {
      id: "c2",
      title: "Unicode String Operations",
      desc: "Construye una utilidad que ejecute operaciones básicas sobre strings Unicode multilingüe: longitud, code points, iteración e indexación.",
      duration: "60 min",
      icon: "list",
    },
    {
      id: "c3",
      title: "Surrogate Pair Decoder",
      desc: "Escribe un decodificador de surrogate pairs UTF-16 que convierta pares alta/baja a su code point Unicode y viceversa.",
      duration: "50 min",
      icon: "network",
    },
    {
      id: "c4",
      title: "UTF-8 File Handler",
      desc: "Crea un manejador de archivos que lea y escriba texto Unicode en UTF-8, verificando la codificación y reportando caracteres fuera del BMP.",
      duration: "55 min",
      icon: "doc",
    },
  ],
  mod2: [
    {
      id: "c1",
      title: "Normalization Comparator",
      desc: "Implementa comparaciones de strings Unicode usando NFC, NFD, NFKC y NFKD, y detecta cuándo dos strings son canónicamente equivalentes.",
      duration: "60 min",
      icon: "check",
    },
    {
      id: "c2",
      title: "Character Database Lookup",
      desc: "Construye una herramienta de consulta a la Unicode Character Database que retorne nombre, categoría, bloque y propiedades de cualquier code point.",
      duration: "75 min",
      icon: "globe",
    },
    {
      id: "c3",
      title: "String Comparison Engine",
      desc: "Implementa un motor de comparación de strings Unicode con sensibilidad a mayúsculas, diacríticos y orden de scripts múltiples.",
      duration: "90 min",
      icon: "chart",
    },
    {
      id: "c4",
      title: "Bidirectional Text Renderer",
      desc: "Crea una función que detecte texto bidireccional y aplique correctamente el algoritmo Unicode BiDi para su visualización.",
      duration: "80 min",
      icon: "mail",
    },
  ],
  mod3: [
    {
      id: "c1",
      title: "Unicode List & Dict Builder",
      desc: "Construye listas y diccionarios con strings Unicode multilingüe como claves y verifica el comportamiento de hashing y ordenación.",
      duration: "45 min",
      icon: "list",
    },
    {
      id: "c2",
      title: "UCA Sort Implementation",
      desc: "Implementa el Unicode Collation Algorithm (UCA) para ordenar arrays de strings multilingüe respetando reglas de colación correctas.",
      duration: "70 min",
      icon: "chart",
    },
    {
      id: "c3",
      title: "Unicode Binary Search",
      desc: "Adapta la búsqueda binaria para que funcione correctamente con strings Unicode normalizados y colacionados con UCA.",
      duration: "60 min",
      icon: "code",
    },
    {
      id: "c4",
      title: "IDN Graph Traversal",
      desc: "Modela una red de dominios internacionalizados como grafo y recórrelo realizando búsquedas que soporten scripts no-ASCII.",
      duration: "85 min",
      icon: "network",
    },
  ],
  mod4: [
    {
      id: "c1",
      title: "Unicode Database Schema",
      desc: "Diseña y crea un esquema con collation utf8mb4_unicode_ci que almacene datos multilingüe en árabe, chino, etíope y japonés.",
      duration: "50 min",
      icon: "server",
    },
    {
      id: "c2",
      title: "Multilingual CRUD Operations",
      desc: "Implementa INSERT, SELECT, UPDATE y DELETE sobre la tabla Customers con registros multilingüe verificando la integridad del encoding.",
      duration: "60 min",
      icon: "edit",
    },
    {
      id: "c3",
      title: "Unicode Collation Sort Query",
      desc: "Escribe queries ORDER BY con COLLATE para ordenar datos multilingüe en MySQL (utf8mb4_unicode_ci) y PostgreSQL (und-x-icu).",
      duration: "55 min",
      icon: "chart",
    },
    {
      id: "c4",
      title: "Regex Unicode Search Engine",
      desc: "Crea un motor de búsqueda con expresiones regulares Unicode que soporte patrones en scripts no-ASCII con sensibilidad configurable.",
      duration: "65 min",
      icon: "code",
    },
  ],
};

/* ══════════════════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════════════════ */

/**
 * Lookup rápido por id. Evita repetir CHALLENGE_MODULES.find() en cada componente.
 */
export const CHALLENGE_MODULE_MAP: Record<string, ChallengeModule> =
  CHALLENGE_MODULES.reduce(
    (acc, m) => {
      acc[m.id] = m;
      return acc;
    },
    {} as Record<string, ChallengeModule>,
  );

/**
 * Total de retos por módulo — constante derivada de los datos.
 * Úsala donde antes usabas el literal 4.
 */
export const CHALLENGES_PER_MODULE = 4;

/**
 * Total global de retos — para el entry card del sidebar.
 */
export const TOTAL_CHALLENGES =
  CHALLENGE_MODULES.length * CHALLENGES_PER_MODULE; // 16

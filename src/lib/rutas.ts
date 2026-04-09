export interface Tema {
  id: string;
  titulo: string;
  nivel: "Básico" | "Avanzado";
  duracion: string;
  descripcion: string;
  icon: string;
  slug?: string;
}

export interface RutaData {
  titulo: string;
  subtitulo: string;
  desc: string;
  temas: Tema[];
}

export interface BasicaPorRolData {
  export: string;
  titulo: string;
  desc: string;
}

// ── Datos de rutas ────────────────────────────────────────────────────────────

export const RUTAS: Record<string, RutaData> = {
  educator_basica: {
    titulo: "Conceptos Clave",
    subtitulo: "Profesores Universitarios & Instructores",
    desc: "Fundamentos de internacionalización y aceptación universal para profesores universitarios e instructores que diseñan laboratorios y guían grupos de aprendizaje.",
    temas: [
      {
        id: "eb-00",
        titulo: "Módulo 0 - Introducción a la Aceptación Universal",
        nivel: "Básico",
        duracion: "30min",
        descripcion:
          "Conceptos fundamentales de UA, por qué importa y cómo impacta a los usuarios finales.",
        icon: "globe",
        slug: "eb-00-intro-profesores-ua",
      },
      {
        id: "eb-01",
        titulo: "Module 1 - Unicode Basics for Programmers",
        nivel: "Básico",
        duracion: "2h 00min",
        descripcion:
          "Cómo funcionan los dominios internacionalizados y su soporte en aplicaciones.",
        icon: "network",
        slug: "eb-01-unicode-basics",
      },
      {
        id: "eb-02",
        titulo: "Module 2 - Unicode Advanced Programming",
        nivel: "Básico",
        duracion: "1h 45min",
        descripcion:
          "Estándar EAI, casos de uso y cómo enseñarlo en entornos de formación técnica.",
        icon: "mail",
        slug: "eb-02-unicode-advanced",
      },
      {
        id: "eb-03",
        titulo: "Module 3 - Unicode in Data Structures and Algorithms",
        nivel: "Básico",
        duracion: "2h 15min",
        descripcion:
          "Metodologías para estructurar prácticas y evaluar el conocimiento de UA en tus alumnos.",
        icon: "flask",
        slug: "eb-03-unicode-data-structures",
      },
      {
        id: "eb-04",
        titulo: "Module 4 - Unicode in Database Systems",
        nivel: "Básico",
        duracion: "1h 30min",
        descripcion:
          "Lectura e interpretación de RFCs clave: RFC 5321, 6530, 6531 y 6532.",
        icon: "doc",
        slug: "eb-04-unicode-databases",
      },
    ],
  },

  learner_basica: {
    titulo: "Conceptos Clave",
    subtitulo: "Estudiantes & Profesionales",
    desc: "Fundamentos de internacionalización y aceptación universal orientados a estudiantes y profesionales que buscan certificar sus conocimientos y aplicarlos en proyectos digitales.",
    temas: [
      {
        id: "lb-01",
        titulo: "Module 1 - Unicode Programming Fundamentals",
        nivel: "Básico",
        duracion: "87 min",
        descripcion:
          "Provide the basic understanding of Unicode and its applications.",
        icon: "globe",
        slug: "lb-01-unicode-fundamentals",
      },
      {
        id: "lb-02",
        titulo: "Module 2 - Unicode Advanced Programming",
        nivel: "Básico",
        duracion: "287 min",
        descripcion:
          "Designed to expand your understanding and proficiency in working with Unicode by covering key aspects such as the character-glyph model, Unicode normalization, accessing the Unicode character database, and comparing Unicode strings.",
        icon: "code",
        slug: "lb-02-unicode-advanced",
      },
      {
        id: "lb-03",
        titulo: "Module 3 - Unicode in Data Structures and Algorithms",
        nivel: "Básico",
        duracion: "169 min",
        descripcion:
          "Comprehensive introduction to leveraging the power of Unicode in data structures and algorithms.",
        icon: "network",
        slug: "lb-03-unicode-data-structures",
      },
      {
        id: "lb-04",
        titulo: "Module 4 - Unicode in Database Systems",
        nivel: "Básico",
        duracion: "108 min",
        descripcion:
          "Concise introduction to the essential concepts and considerations when working with Unicode character data in the context of database systems.",
        icon: "server",
        slug: "lb-04-unicode-databases",
      },
    ],
  },

  avanzada: {
    titulo: "Implementación Técnica",
    subtitulo: "SysAdmins & Devs",
    desc: "Configuraciones de servidores, código y protocolos para implementar Aceptación Universal en producción.",
    temas: [
      {
        id: "av-01",
        titulo: "Configuración de Servidores DNS",
        nivel: "Avanzado",
        duracion: "4h 00min",
        descripcion:
          "Implementación práctica de zonas IDN, configuración de BIND y pruebas de resolución de nombres Unicode.",
        icon: "server",
      },
      {
        id: "av-02",
        titulo: "SMTP & EAI: Configuración",
        nivel: "Avanzado",
        duracion: "5h 00min",
        descripcion:
          "Postfix/Exim con soporte EAI, cabeceras UTF-8, reescritura de envolventes y compatibilidad con MUA legacy.",
        icon: "mail",
      },
      {
        id: "av-03",
        titulo: "Validación de Inputs Unicode",
        nivel: "Avanzado",
        duracion: "3h 30min",
        descripcion:
          "Implementar validación robusta de emails y dominios internacionales en backend con librerías actuales.",
        icon: "code",
      },
      {
        id: "av-04",
        titulo: "Normalización IDNA2008 vs UTS46",
        nivel: "Avanzado",
        duracion: "3h 00min",
        descripcion:
          "Diferencias entre estándares de normalización, casos de borde y cómo elegir la implementación correcta.",
        icon: "doc",
      },
      {
        id: "av-05",
        titulo: "APIs REST con Soporte UA",
        nivel: "Avanzado",
        duracion: "4h 30min",
        descripcion:
          "Diseño de endpoints, serialización JSON con Unicode y testing de integración para APIs UA-ready.",
        icon: "api",
      },
      {
        id: "av-06",
        titulo: "Testing y QA para UA",
        nivel: "Avanzado",
        duracion: "3h 00min",
        descripcion:
          "Suites de pruebas, casos de borde con scripts no-ASCII y herramientas de auditoría de conformidad.",
        icon: "flask",
      },
      {
        id: "av-07",
        titulo: "Seguridad: Ataques Homoglifos y Punycode",
        nivel: "Avanzado",
        duracion: "4h 00min",
        descripcion:
          "Vectores de ataque basados en similitud visual de caracteres Unicode y estrategias de mitigación.",
        icon: "shield",
      },
      {
        id: "av-08",
        titulo: "Monitoreo y Logging UA en Producción",
        nivel: "Avanzado",
        duracion: "2h 30min",
        descripcion:
          "Dashboards, alertas y logs que soporten caracteres internacionales sin pérdida de datos.",
        icon: "chart",
      },
    ],
  },
};

// ── Textos dinámicos del Paso 2 del modal (varían según el rol) ───────────────

export const BASICA_POR_ROL: Record<string, BasicaPorRolData> = {
  educator: {
    export: "export default 'Instructores'",
    titulo: "Conceptos Clave para Educadores",
    desc: "Para profesores universitarios e instructores. Diseña laboratorios y guía a tus estudiantes en los fundamentos de internacionalización y aceptación universal.",
  },
  learner: {
    export: "export default 'Estudiantes'",
    titulo: "Conceptos Clave",
    desc: "Para estudiantes y profesionales. Accede a rutas de aprendizaje y certifica tus conocimientos en aceptación universal.",
  },
};

// ── Función de resolución de ruta ─────────────────────────────────────────────

/**
 * Convierte la combinación rol+ruta en la clave del objeto RUTAS.
 * La ruta avanzada es la misma para educator y learner.
 */
export function resolverRuta(rol: string, ruta: string): string {
  if (ruta === "avanzada") return "avanzada";
  return rol === "educator" ? "educator_basica" : "learner_basica";
}

// ── Íconos SVG ────────────────────────────────────────────────────────────────

export const ICONS: Record<string, string> = {
  globe: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  network: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="2" width="6" height="6" rx="1"/><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="16" y="2" width="6" height="6" rx="1"/><path d="M5 8v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8M12 14v2"/></svg>`,
  mail: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  flask: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 3h6M9 3v7l-5 9a1 1 0 0 0 .9 1.5h14.2A1 1 0 0 0 20 19l-5-9V3"/></svg>`,
  doc: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  map: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="3,6 9,3 15,6 21,3 21,18 15,21 9,18 3,21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>`,
  server: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`,
  code: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="16,18 22,12 16,6"/><polyline points="8,6 2,12 8,18"/></svg>`,
  shield: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  chart: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>`,
  api: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`,
};

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
        titulo: "Guide 0 - Introducción a la Aceptación Universal",
        nivel: "Básico",
        duracion: "30 min",
        descripcion:
          "Propuesta para la modernización curricular mediante la integración de módulos de Aceptación Universal (UA) desarrollado por el WG de UA de ICANN.",
        icon: "globe",
        slug: "eb-00-intro-profesores-ua",
      },
      {
        id: "eb-01",
        titulo: "Guide 1 - Unicode Basics for Programmers",
        nivel: "Básico",
        duracion: "180 min",
        descripcion:
          "Introductory module on Unicode fundamentals covering encoding schemes, string operations, and practical applications in Python and Java.",
        icon: "network",
        slug: "eb-01-unicode-basics",
      },
      {
        id: "eb-02",
        titulo: "Guide 2 - Unicode Advanced Programming",
        nivel: "Básico",
        duracion: "136 min",
        descripcion:
          "Advanced module on Unicode covering the character-glyph model, normalization, Unicode Character Database, string comparison, and bidirectional scripts in Python and Java.",
        icon: "mail",
        slug: "eb-02-unicode-advanced",
      },
      {
        id: "eb-03",
        titulo: "Guide 3 - Unicode in Data Structures and Algorithms",
        nivel: "Básico",
        duracion: "180 min",
        descripcion:
          "Module on implementing Unicode-aware data structures and algorithms, covering sorting, searching, and collation techniques.",
        icon: "flask",
        slug: "eb-03-unicode-data-structures",
      },
      {
        id: "eb-04",
        titulo: "Guide 4 - Unicode in Database Systems",
        nivel: "Básico",
        duracion: "120 min",
        descripcion:
          "A concise introduction to the essential concepts and considerations for working with Unicode character data in database systems.",
        icon: "doc",
        slug: "eb-04-unicode-databases",
      },
    ],
  },

  educator_avanzada: {
    titulo: "Implementación Técnica",
    subtitulo: "SysAdmins & Devs",
    desc: "Configuraciones de servidores, código y protocolos para implementar Aceptación Universal en producción.",
    temas: [
      {
        id: "ea-01",
        titulo: "Guide 5 - Introducing Internationalized Domain Names (IDNs)",
        nivel: "Avanzado",
        descripcion:
          "Introduction to IDNs and their significance in the global Internet ecosystem.",
        icon: "server",
        slug: "ea-01-idn-introduction",
      },
      {
        id: "ea-02",
        titulo:
          "Guide 6 - Programming with Internationalized Domain Names (IDNs).",
        nivel: "Avanzado",
        descripcion:
          "Implementing the IDNA2008 protocol and exploring available compatible libraries in programming languages.",
        icon: "mail",
        slug: "ea-02-idn-programming",
      },
      {
        id: "ea-03",
        titulo: "Guide 7 - Email Address Internationalization (EAI).",
        nivel: "Avanzado",
        descripcion:
          "Email Address Internationalization (EAI) and its significance in today's globalized communication landscape.",
        icon: "code",
        slug: "ea-03-eai",
      },
      {
        id: "ea-04",
        titulo:
          "Guide 8 - Advanced Topics in Internationalized Domain Names (IDNs).",
        nivel: "Avanzado",
        descripcion:
          "Advanced analysis of IDN concepts and techniques, focused on identifying and addressing the limitations of the IDNA2008 protocol.",
        icon: "doc",
        slug: "ea-04-advanced-idns",
      },
      {
        id: "ea-05",
        titulo:
          "Guide 9 - Programming in Email Address Internationalization(EAI).",
        nivel: "Avanzado",
        descripcion:
          "Explore The fundamentals of EAI programming, including validation, encoding, parsing, and handling of internationalized email addresses.",
        icon: "api",
        slug: "ea-05-eai-programming",
      },
      {
        id: "ea-06",
        titulo: "Guide 10 - Processing IDNs and EAI In Mobile Apps",
        nivel: "Avanzado",
        descripcion:
          "Explore the essential aspects of Unicode character sets and their significance in mobile apps.",
        icon: "flask",
        slug: "ea-06-mobile-apps",
      },
      {
        id: "ea-07",
        titulo: "Guide 11 - IDN Security",
        nivel: "Avanzado",
        descripcion:
          "Explore the security vulnerabilities and challenges associated with Unicode, specifically in the context of Internationalized Domain Names (IDNs).",
        icon: "shield",
        slug: "ea-07-idn-security",
      },
      {
        id: "ea-08",
        titulo: "Guide 12 - Unicode, IDNs and EAI Support in Operating Systems",
        nivel: "Avanzado",
        descripcion:
          "Explore the fundamental concepts and mechanisms that are essential for Unicode support in contemporary operating systems.",
        icon: "chart",
        slug: "ea-08-unicode-os",
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

  learner_avanzada: {
    titulo: "Implementación Técnica",
    subtitulo: "SysAdmins & Devs",
    desc: "Configuraciones de servidores, código y protocolos para implementar Aceptación Universal en producción.",
    temas: [
      {
        id: "la-01",
        titulo: "Module 5 - Introducing Internationalized Domain Names (IDNs)",
        nivel: "Avanzado",
        duracion: "104 min",
        descripcion:
          "Introduction to IDNs and their significance in the global Internet ecosystem.",
        icon: "server",
      },
      {
        id: "la-02",
        titulo:
          "Module 6 - Programming with Internationalized Domain Names (IDNs).",
        nivel: "Avanzado",
        duracion: "60 min",
        descripcion:
          "Implementing the IDNA2008 protocol and exploring available compatible libraries in programming languages.",
        icon: "mail",
      },
      {
        id: "la-03",
        titulo: "Module 7 - Email Address Internationalization (EAI).",
        nivel: "Avanzado",
        duracion: "68 min",
        descripcion:
          "Email Address Internationalization (EAI) and its significance in today's globalized communication landscape.",
        icon: "code",
      },
      {
        id: "la-04",
        titulo:
          "Module 8 - Advanced Topics in Internationalized Domain Names (IDNs).",
        nivel: "Avanzado",
        duracion: "93 min",
        descripcion:
          "Advanced analysis of IDN concepts and techniques, focused on identifying and addressing the limitations of the IDNA2008 protocol.",
        icon: "doc",
      },
      {
        id: "la-05",
        titulo:
          "Module 9 - Programming in Email Address Internationalization(EAI).",
        nivel: "Avanzado",
        duracion: "185 min",
        descripcion:
          "Explore The fundamentals of EAI programming, including validation, encoding, parsing, and handling of internationalized email addresses.",
        icon: "api",
      },
      {
        id: "la-06",
        titulo: "Module 10 - Processing IDNs and EAI In Mobile Apps",
        nivel: "Avanzado",
        duracion: "94 min",
        descripcion:
          "Explore the essential aspects of Unicode character sets and their significance in mobile apps.",
        icon: "flask",
      },
      {
        id: "la-07",
        titulo: "Module 11 - IDN Security",
        nivel: "Avanzado",
        duracion: "130 min",
        descripcion:
          "Explore the security vulnerabilities and challenges associated with Unicode, specifically in the context of Internationalized Domain Names (IDNs).",
        icon: "shield",
      },
      {
        id: "la-08",
        titulo:
          "Module 12 -  Unicode, IDNs and EAI Support in Operating Systems",
        nivel: "Avanzado",
        duracion: "127 min",
        descripcion:
          "Explore the fundamental concepts and mechanisms that are essential for Unicode support in contemporary operating systems.",
        icon: "chart",
      },
    ],
  },
};

// ── Textos dinámicos que varían según el rol ───────────────

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

export function resolverRuta(rol: string, ruta: string): string {
  if (ruta === "avanzada") {
    return rol === "educator" ? "educator_avanzada" : "learner_avanzada";
  }
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

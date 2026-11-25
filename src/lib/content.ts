// Contenido editable de las estaciones. Se guarda en el navegador (localStorage)
// desde el panel /admin; DEFAULT_STATIONS es el contenido inicial.
export interface Card { icon?: string; title: string; text?: string; items?: string[]; tone?: "co" | "cl" | "good" | "bad" | "plain" }
export type Block =
  | { type: "heading"; text: string }
  | { type: "text"; text: string }
  | { type: "image"; url: string; caption?: string }
  | { type: "video"; url: string }
  | { type: "link"; url: string; label: string }
  | { type: "table"; rows: string[][] }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "cards"; cols?: number; cards: Card[] }
  | { type: "quote"; text: string }
  | { type: "route" };

export interface BookPage { title: string; clause?: string; body: string[] }

export type StationKind = "register" | "globe" | "books" | "tools" | "book";

export interface Station {
  id: string;
  title: string;
  subtitle: string;
  kind: StationKind;
  x: number; // columna del mapa (1-12)
  y: number; // fila del mapa (1-8)
  blocks: Block[];
  pages?: BookPage[]; // solo para el libro (kind "book")
}

export const KIND_LABEL: Record<StationKind, string> = {
  register: "Mostrador de recepción",
  globe: "Globo terráqueo",
  books: "Estante de libros",
  tools: "Tablero de herramientas",
  book: "Libro del contrato",
};

export const DEFAULT_STATIONS: Station[] = [
  {
    id: "s1",
    title: "Conoce a los protagonistas de esta alianza",
    subtitle: "Historia empresarial e identificación corporativa",
    kind: "register",
    x: 6,
    y: 7,
    blocks: [
      {
        type: "cards",
        cols: 2,
        cards: [
          {
            icon: "🇨🇴",
            tone: "co",
            title: "Organización Corona S.A. · Colombia",
            items: [
              "Sector: Secundario (Industrial y Manufacturero) / Comercio.",
              "Multinacional colombiana con 145 años de historia empresarial (fundada el 13 de agosto de 1881 en Caldas, Antioquia).",
              "Actividad: Fabricación y comercialización de productos para el hogar, la construcción, la industria, el comercio y el sector agroindustrial (lozas sanitarias, griferías, baldosas, insumos y materiales).",
              "5 Divisiones de Negocios: Baños y Cocinas; Superficies, Materiales y Pinturas; Insumos Industriales y Energía; Mesa Servida y Cemento.",
              "2 Unidades Comerciales: Almacenes Corona y Comercial Corona Colombia.",
              "Presencia industrial: 25 plantas en Colombia, 1 en EE.UU., 2 en Centroamérica y 2 en México; 43 tiendas Centro Corona, 6 Pintureras, 8 Red Azul y oficina en Asia.",
              "Impacto: Más de 8.600 empleos directos y exportación a EE.UU., Canadá, México, Brasil, Chile, Venezuela, Centroamérica, Caribe, Italia, España y Reino Unido.",
            ],
          },
          {
            icon: "🇨🇱",
            tone: "cl",
            title: "Grupo Falabella / Sodimac · Chile",
            items: [
              "Grupo empresarial de origen chileno líder en comercio minorista y grandes superficies en América Latina.",
              "Aportó el modelo de grandes superficies especializadas en mejoramiento del hogar y construcción en formato DIY ('hágalo usted mismo').",
              "Sistemas tecnológicos de vanguardia para gestión de inventarios, reabastecimiento eficiente y experiencia omnicanal.",
              "Capacidades de escala comercial para dinamizar y modernizar el mercado de retail en la región.",
            ],
          },
        ],
      },
      { type: "heading", text: "Sodimac Colombia S.A. (Empresa Conjunta / Alianza)" },
      {
        type: "cards",
        cols: 3,
        cards: [
          {
            icon: "📅",
            title: "Consolidada en 1993",
            text: "Joint Venture societario creado entre Organización Corona y Sodimac para transformar el comercio minorista de remodelación y construcción en Colombia.",
          },
          {
            icon: "🏬",
            title: "Marcas Líderes",
            text: "Opera y expande por todo el territorio colombiano las reconocidas cadenas de tiendas Homecenter y Constructor.",
          },
          {
            icon: "📊",
            title: "Estructura Accionaria",
            text: "51 % Organización Corona S.A. · 49 % Inversiones Falabella de Colombia S.A. (Grupo Falabella / Sodimac).",
          },
        ],
      },
      { type: "heading", text: "Reseña histórica de Organización Corona (4 grandes etapas)" },
      {
        type: "cards",
        cols: 2,
        cards: [
          {
            icon: "🏺",
            title: "1. Fundación y pionerismo (1881–1934)",
            items: [
              "1881: Teodomiro Llano Botero y el técnico alemán Reinhold Paschke fundan la Compañía Cerámica Antioqueña en Caldas (Antioquia).",
              "Objetivo: Aprovechar arcilla y caolín de la región para sustituir importaciones de loza y vajillas.",
              "Resiliencia: Superó la geografía montañosa y la Guerra de los Mil Días, reorganizándose como Locería Colombiana.",
            ],
          },
          {
            icon: "🏭",
            title: "2. Consolidación y portafolio (1935–1979)",
            items: [
              "1935: Gabriel Echavarría Misas asume el control e introduce modernización tecnológica industrial.",
              "1947: Creación de Ceramita S.A. para revestimientos cerámicos.",
              "1954: Fundación de Mancesa en Madrid (Cundinamarca), iniciando porcelana sanitaria (sanitarios y lavamanos).",
              "1960–1970: Incorporación de griferías Grival y materiales refractarios. En 1966 se adopta la marca sombrilla Corona.",
            ],
          },
          {
            icon: "🤝",
            title: "3. Apertura económica y retail (1980–2010)",
            items: [
              "Frente a la apertura económica colombiana de los 90, decide dominar la distribución moderna y el comercio minorista.",
              "1993: Alianza histórica con Sodimac para crear Sodimac Colombia S.A. (Homecenter y Constructor), reteniendo el 51 %.",
              "Años 2000: Expansión temporal de la alianza hacia tiendas por departamento Falabella y Banco Falabella.",
            ],
          },
          {
            icon: "🌐",
            title: "4. Internacionalización y reenfoque (2011–Actualidad)",
            items: [
              "Expansión manufacturera en el exterior: Mansfield Plumbing (EE.UU.), Lamosa (México), plantas en Centroamérica y alianzas en Brasil.",
              "2015: Joint Venture (50%-50%) con la multinacional española Cementos Molins para fundar Cementos Alión en Sonsón (Antioquia).",
              "2025–2026: Reenfoque en el negocio medular: venta de participación en banca y moda para concentrar recursos en Corona Industrial, Sodimac Colombia (51 %) y Cementos Alión.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "s2",
    title: "Una alianza que cruzó fronteras",
    subtitle: "Modelo de expansión internacional y modalidades de exportación",
    kind: "globe",
    x: 3,
    y: 4,
    blocks: [
      { type: "heading", text: "La modalidad de Joint Venture en el comercio internacional" },
      {
        type: "text",
        text: "En el contexto de exportación e internacionalización, el Joint Venture (Empresa Conjunta / Alianza Estratégica Internacional) consiste en la asociación de dos o más empresas para constituir una nueva entidad o sociedad comercial compartida.\n\nA través de esta figura, Organización Corona comparte riesgos, capital, tecnología y redes de distribución para penetrar mercados globales, escalar operaciones de producción y comercializar productos tanto dentro como fuera de Colombia sin asumir individualmente la totalidad de la inversión o el riesgo financiero.",
      },
      { type: "route" },
      { type: "heading", text: "Razones estratégicas de la alianza Corona × Falabella" },
      {
        type: "cards",
        cols: 2,
        cards: [
          {
            icon: "🇨🇴",
            tone: "co",
            title: "Aportes clave de Organización Corona (51 %)",
            items: [
              "Conocimiento profundo del mercado colombiano y hábitos de consumo local.",
              "Capacidad logística e infraestructura industrial manufacturera nacional.",
              "Acceso y consolidada red de proveedores locales de materiales de construcción y acabados.",
              "Respaldo financiero, comercial e institucional de más de un siglo en Colombia.",
            ],
          },
          {
            icon: "🇨🇱",
            tone: "cl",
            title: "Aportes clave de Falabella / Sodimac (49 %)",
            items: [
              "Modelo de negocio de grandes superficies de mejoramiento del hogar en formato DIY.",
              "Sistemas tecnológicos de gestión de inventarios y logística omnicanal de vanguardia.",
              "Experiencia comprobada en retail especializado y servicio de atención en tienda.",
              "Capacidades de negociación internacional y abastecimiento comercial.",
            ],
          },
        ],
      },
      { type: "heading", text: "¿Por qué eligieron el modelo Societario sobre el Contractual?" },
      {
        type: "text",
        text: "Debido a que el desarrollo de Homecenter y Constructor requería inversiones intensivas en bienes raíces, infraestructura comercial de gran escala, contratación masiva de personal y endeudamiento a largo plazo, la figura de un joint venture meramente contractual (sin personería jurídica) resultaba insuficiente.\n\nConstituir una sociedad independiente (Sodimac Colombia S.A.) permitió aislar el riesgo patrimonial de las casas matrices, dotar al negocio de un gobierno corporativo propio y garantizar estabilidad operativa por más de tres décadas.",
      },
      { type: "heading", text: "Otros Joint Ventures internacionales de Organización Corona" },
      {
        type: "cards",
        cols: 2,
        cards: [
          {
            icon: "🇪🇸",
            title: "Cementos Alión (2015 · Sonsón, Antioquia)",
            text: "Joint Venture (50 % - 50 %) con la multinacional española Cementos Molins. Permitió ingresar al negocio del cemento estructural y obra gris, completando la oferta integral desde la cimentación hasta los acabados finales.",
          },
          {
            icon: "🇧🇷",
            title: "Eternit / Incepa (Brasil)",
            text: "Alianza estratégica internacional para la producción y comercialización de loza sanitaria y materiales en el mercado brasileño.",
          },
          {
            icon: "🎨",
            title: "Lanco (Colombia - EE.UU. / Caribe)",
            text: "Joint venture que dio lugar a una nueva planta de producción de pinturas, adhesivos y recubrimientos especializados de alta calidad en Colombia.",
          },
          {
            icon: "🍷",
            title: "Vicrila (España)",
            text: "Alianza estratégica con el fabricante español Vicrila para fortalecer la distribución y el negocio de cristalería y mesa servida.",
          },
        ],
      },
    ],
  },
  {
    id: "s3",
    title: "Las bases que explican el Joint Venture",
    subtitle: "Fundamentación teórica y marco legal en Colombia",
    kind: "books",
    x: 10,
    y: 2,
    blocks: [
      { type: "heading", text: "1. Concepto y Marco Legal Colombiano" },
      {
        type: "text",
        text: "El joint venture (empresa conjunta) es la alianza en la que dos o más empresas aportan recursos para desarrollar un proyecto o negocio común, compartiendo su control, sus resultados y sus riesgos.\n\nEn Colombia NO cuenta con una regulación propia en el Código de Comercio (es una figura de colaboración empresarial atípica en el derecho mercantil general), pero el ARTÍCULO 18 DEL ESTATUTO TRIBUTARIO lo menciona expresamente entre los contratos de colaboración empresarial.",
      },
      { type: "heading", text: "El Artículo 18 del Estatuto Tributario (E.T.)" },
      {
        type: "cards",
        cols: 2,
        cards: [
          {
            icon: "📜",
            title: "Régimen Fiscal de los Contratos de Colaboración",
            items: [
              "Los contratos como consorcios, uniones temporales, joint ventures y cuentas en participación NO son contribuyentes del impuesto sobre la renta.",
              "Las partes declaran de manera independiente los activos, pasivos, ingresos, costos y deducciones que les correspondan según su porcentaje de participación.",
              "Las partes deben llevar un registro sobre las actividades desarrolladas para verificar ingresos, costos y gastos ante requerimientos de la DIAN.",
            ],
          },
          {
            icon: "⚖️",
            title: "Certificación del Gestor y NIIF (Parágrafos 1 y 2)",
            items: [
              "Par. 1: El gestor o administrador del contrato tiene la obligación legal de certificar y proporcionar la información financiera y fiscal a los partícipes, firmada por representante legal y contador o revisor fiscal.",
              "Par. 2: Las partes pueden establecer que el contrato llevará contabilidad conforme a los marcos técnicos normativos de información financiera (NIIF).",
            ],
          },
        ],
      },
      { type: "heading", text: "2. Formas del Joint Venture en Colombia: Contractual vs Societario" },
      {
        type: "table",
        rows: [
          ["Aspecto", "Joint Venture Contractual", "Joint Venture Societario"],
          ["Persona jurídica", "No se crea persona jurídica nueva", "Se crea una sociedad independiente (ej. S.A.S. Ley 1258 de 2008 o S.A.)"],
          ["Formalidades", "Contrato escrito entre las partes, sin registro", "Constitución por documento o escritura pública e inscripción en el registro mercantil"],
          ["Responsabilidad", "La que pacten las partes y la figura usada (atípico, consorcio o cuentas en participación)", "Limitada al monto de los aportes, según el tipo societario adoptado"],
          ["Impuesto de renta", "Cada parte declara su participación directa (Art. 18 E.T.)", "La sociedad es contribuyente directa; los socios tributan sobre dividendos"],
          ["Uso típico", "Proyectos puntuales, consorcios o contratos de corta duración", "Negocios a gran escala y largo plazo (caso Sodimac Colombia S.A.)"],
        ],
      },
      { type: "heading", text: "3. Las partes en el Joint Venture" },
      {
        type: "cards",
        cols: 2,
        cards: [
          {
            icon: "👥",
            title: "Partícipes, asociados o venturers",
            text: "Personas naturales o jurídicas que suscriben el acuerdo de colaboración. Aportan capital, tecnología, know-how, infraestructura o redes de distribución, asumiendo conjuntamente riesgos y utilidades.",
          },
          {
            icon: "📋",
            title: "Gestor o administrador (modelo contractual)",
            text: "Parte designada para ejecutar el objeto del contrato, representarlo ante terceros y emitir la certificación financiera y fiscal exigida por el Parágrafo 1 del artículo 18 del Estatuto Tributario.",
          },
          {
            icon: "🕶️",
            title: "Partícipe oculto (cuentas en participación)",
            text: "Bajo el artículo 507 del Código de Comercio, es el socio que aporta recursos pero permanece inactivo frente a terceros, limitando su responsabilidad al valor de su aporte.",
          },
          {
            icon: "🏛️",
            title: "Accionistas y Sociedad Vehículo / SPV",
            text: "En el modelo societario (ej. Sodimac Colombia S.A.), las matrices son accionistas vinculados por estatutos y acuerdos de accionistas (Art. 24 Ley 1258 de 2008), con patrimonio independiente.",
          },
        ],
      },
      { type: "heading", text: "4. Importancia en el Comercio Internacional" },
      {
        type: "list",
        items: [
          "Facilidad de acceso a nuevos mercados y redes de distribución aprovechando la posición de un socio local ya establecido.",
          "Mitigación y compartición de riesgos financieros, operacionales y ante volatilidades de tipo de cambio.",
          "Superación de barreras legales, arancelarias y regulatorias en sectores que exigen presencia o capital nacional.",
          "Transferencia bidireccional de tecnología, know-how, patentes y entendimiento del comportamiento del consumidor local.",
          "Optimización de costos y economías de escala al unificar cadenas logísticas y capacidades de compra masiva.",
        ],
      },
      { type: "heading", text: "5. Ventajas y Desventajas del Joint Venture" },
      {
        type: "cards",
        cols: 2,
        cards: [
          {
            icon: "✅",
            tone: "good",
            title: "Ventajas",
            items: [
              "Sinergia de recursos: combinación de fortalezas complementarias sin desarrollarlas desde cero.",
              "Distribución de riesgos y costos: las inversiones intensivas se reparten proporcionalmente.",
              "Acceso rápido a nuevos mercados: entrada ágil con marca y logística probadas.",
              "Flexibilidad jurídica y fiscal: elección entre transparencia fiscal directa o sociedad S.A.S. con blindaje patrimonial.",
            ],
          },
          {
            icon: "⚠️",
            tone: "bad",
            title: "Desventajas",
            items: [
              "Conflictos de gobierno y control: diferencias de cultura o visión que pueden paralizar proyectos si falta desempate.",
              "Riesgo de filtración de know-how: exposición de procesos internos o secretos si la alianza termina.",
              "Complejidad contable y tributaria: estricto rigor en certificaciones DIAN bajo el Art. 18 del Estatuto Tributario.",
              "Asimetría en el compromiso: riesgo de que un socio aporte más esfuerzo operativo o financiero a lo largo del tiempo.",
            ],
          },
        ],
      },
      { type: "heading", text: "6. Referencias Doctrinales y Jurídicas" },
      {
        type: "list",
        items: [
          "Arrubla Paucar, J. A. (2015). Contratos mercantiles: Contratos atípicos (8.ª ed.). Legis Editores. (Doctrina colombiana sobre colaboración empresarial).",
          "Martorell, E. E. (2018). Tratado de los contratos de empresa: Joint ventures y agrupaciones de colaboración. AbeledoPerrot.",
          "Narváez García, J. I. (2010). Teoría general de las sociedades (10.ª ed.). Legis Editores.",
          "Reyes Villamizar, F. (2020). SAS: La Sociedad por Acciones Simplificada y la oponibilidad de los acuerdos de accionistas. Legis Editores.",
          "Leal Pérez, H. (2019). Contratos bancarios, mercantiles y de colaboración empresarial. Editorial Leyer.",
        ],
      },
    ],
  },
  {
    id: "s4",
    title: "El desafío de trabajar en equipo",
    subtitle: "Problemática, balance de la alianza y propuesta de solución",
    kind: "tools",
    x: 10,
    y: 6,
    blocks: [
      { type: "heading", text: "Balance real de la alianza Corona × Falabella" },
      {
        type: "cards",
        cols: 2,
        cards: [
          {
            icon: "🏆",
            tone: "good",
            title: "Aspectos Positivos (Aciertos del modelo)",
            items: [
              "Liderazgo indiscutible de mercado: Sodimac Colombia (Homecenter/Constructor) lidera el retail de construcción, superando a multinacionales que intentaron entrar solas (como Easy de Cencosud).",
              "Aprendizaje y transferencia tecnológica: Corona incorporó las mejores prácticas internacionales de retail omnicanal sin alterar la operación fabril.",
              "Mitigación del riesgo de entrada: Compartir la inversión en grandes superficies evitó sobreendeudamiento a las casas matrices.",
            ],
          },
          {
            icon: "⚠️",
            tone: "bad",
            title: "Aspectos Negativos (Riesgos y fricciones)",
            items: [
              "Fricciones por competencia potencial: Corona es el mayor proveedor de acabados y a la vez dueño del 51 % del canal; se requirieron estrictas reglas de independencia frente a distribuidores tradicionales y otros proveedores.",
              "Desgaste fuera del core business: La incursión en moda (tiendas Falabella) y banca demostró que sin sinergia industrial el rol de socio minoritario pierde atractivo.",
              "Complejidad en la desinversión: Deshacer participaciones cruzadas en sociedades cerradas demanda valoraciones complejas y largas negociaciones.",
            ],
          },
        ],
      },
      { type: "heading", text: "Planteamiento de la Problemática" },
      {
        type: "cards",
        cols: 1,
        cards: [
          {
            icon: "🧩",
            tone: "bad",
            title: "Desafío de visión estratégica compartida",
            text: "La alianza estratégica entre Organización Corona y Grupo Falabella para Sodimac Colombia enfrenta el desafío de mantener una visión empresarial compartida ante las distintas prioridades estratégicas de sus accionistas.\n\nEsta situación plantea retos en la coordinación de inversiones, la toma de decisiones ágil y la definición de estrategias comerciales para competir ante la transformación digital y el comercio electrónico.",
          },
        ],
      },
      { type: "heading", text: "Propuesta de Solución Institucional (5 ejes)" },
      {
        type: "cards",
        cols: 2,
        cards: [
          {
            icon: "1️⃣",
            tone: "good",
            title: "1. Comité de Dirección Estratégica",
            text: "Crear un comité paritario con representantes de ambas organizaciones encargado de coordinar y consensuar las directrices de crecimiento de Sodimac Colombia S.A.",
          },
          {
            icon: "2️⃣",
            tone: "good",
            title: "2. Plan de Negocios Anual Compartido",
            text: "Establecer anualmente un plan estratégico con metas unificadas en crecimiento, innovación tecnológica, comercio electrónico y posicionamiento.",
          },
          {
            icon: "3️⃣",
            tone: "good",
            title: "3. Protocolo de Aprobación de Inversiones",
            text: "Definir reglas claras para evaluar inversiones extraordinarias bajo análisis de rentabilidad mutua, impidiendo compromisos financieros unilaterales.",
          },
          {
            icon: "4️⃣",
            tone: "good",
            title: "4. Resolución Escalonada y Peritaje",
            text: "Implementar un proceso por fases (negociación directa → comité → mediación → arbitraje) y la intervención de un perito independiente para prevenir bloqueos decisionales (deadlocks).",
          },
          {
            icon: "5️⃣",
            tone: "good",
            title: "5. Evaluaciones Periódicas de Metas",
            text: "Realizar evaluaciones trimestrales sobre ejecución presupuestal y desempeño estratégico para aplicar correcciones conjuntas oportunamente.",
          },
        ],
      },
      {
        type: "quote",
        text: "La finalidad es que ninguna de las partes tome decisiones estratégicas importantes de manera unilateral y que ambas trabajen en función del crecimiento conjunto de Sodimac Colombia S.A.",
      },
    ],
  },
  {
    id: "s5",
    title: "El acuerdo que une a dos empresas",
    subtitle: "Contrato de Joint Venture (Texto Oficial)",
    kind: "book",
    x: 3,
    y: 7,
    blocks: [],
    pages: [
      {
        title: "CONTRATO DE JOINT VENTURE",
        clause: "Alianza Estratégica Internacional",
        body: [
          "Alianza estratégica entre Organización Corona S.A. e Inversiones Falabella de Colombia S.A. para el desarrollo de Sodimac Colombia S.A.",
          "Entre los suscritos, por una parte, ORGANIZACIÓN CORONA S.A., sociedad comercial constituida conforme a las leyes de la República de Colombia, quien en adelante se denominará CORONA; y por otra parte, INVERSIONES FALABELLA DE COLOMBIA S.A., sociedad vinculada al Grupo Falabella de Chile, quien en adelante se denominará FALABELLA; conjuntamente denominadas LAS PARTES, acuerdan celebrar el presente contrato de Joint Venture, sujeto a las siguientes cláusulas:",
        ],
      },
      {
        title: "Objeto y Participación",
        clause: "Cláusulas primera y segunda",
        body: [
          "CLÁUSULA PRIMERA. OBJETO DEL CONTRATO: El presente contrato tiene como objeto establecer las condiciones de cooperación empresarial entre CORONA y FALABELLA para fortalecer el desarrollo, crecimiento y competitividad de Sodimac Colombia S.A., mediante la integración de sus capacidades comerciales, industriales, administrativas y tecnológicas, estableciendo mecanismos de coordinación estratégica que permitan alinear los intereses de ambas organizaciones.",
          "CLÁUSULA SEGUNDA. PARTICIPACIÓN DE LAS PARTES: Las partes mantendrán su participación accionaria conforme a la estructura societaria vigente de Sodimac Colombia S.A. (51 % Organización Corona S.A. y 49 % Inversiones Falabella de Colombia S.A.) y respetarán los derechos y obligaciones correspondientes a su condición de accionistas.",
        ],
      },
      {
        title: "Aportes y Responsabilidades",
        clause: "Cláusula tercera",
        body: [
          "Para el cumplimiento del objeto contractual, las partes contribuirán de acuerdo con sus capacidades y experiencia empresarial:",
          "A. Organización Corona:\n• Aportar su experiencia en el sector industrial y de materiales para la construcción.\n• Facilitar conocimientos sobre producción, proveedores y mercado colombiano.\n• Contribuir al desarrollo de productos y soluciones para el mejoramiento del hogar.",
          "B. Inversiones Falabella de Colombia:\n• Aportar su experiencia en comercio minorista y grandes superficies.\n• Contribuir al desarrollo de estrategias comerciales y de mercadeo.\n• Facilitar conocimientos en transformación digital, comercio electrónico y experiencia del consumidor.",
        ],
      },
      {
        title: "Comité de Dirección y Metas",
        clause: "Cláusulas cuarta y quinta",
        body: [
          "CLÁUSULA CUARTA. COMITÉ DE DIRECCIÓN ESTRATÉGICA: Las partes acuerdan establecer un Comité de Dirección Estratégica, integrado por representantes designados por ambas organizaciones, encargado de coordinar y evaluar las decisiones relacionadas con el crecimiento de Sodimac Colombia S.A.\n\nFunciones:\n1. Evaluar las estrategias comerciales y de expansión.\n2. Revisar las propuestas de inversión.\n3. Establecer objetivos empresariales comunes.\n4. Identificar posibles diferencias entre los intereses de las partes.\n5. Proponer soluciones que favorezcan el desarrollo de la compañía.",
          "CLÁUSULA QUINTA. PLANIFICACIÓN Y OBJETIVOS COMUNES: Las partes deberán establecer anualmente un plan estratégico con objetivos compartidos en crecimiento, competitividad, innovación, transformación digital y posicionamiento en el mercado colombiano, aprobado según el gobierno corporativo.",
        ],
      },
      {
        title: "Inversiones y Desacuerdos",
        clause: "Cláusulas sexta y séptima",
        body: [
          "CLÁUSULA SEXTA. APROBACIÓN DE INVERSIONES Y ASIGNACIÓN DE RECURSOS: Las decisiones sobre inversiones extraordinarias, expansión comercial y compromisos económicos significativos deberán someterse a evaluación conjunta de las partes, considerando viabilidad financiera y beneficios para Sodimac Colombia S.A. Ninguna parte podrá comprometer unilateralmente recursos sin autorización.",
          "CLÁUSULA SÉPTIMA. CLÁUSULA ESPECIAL DE RESOLUCIÓN DE DESACUERDOS ESTRATÉGICOS: En caso de diferencias sobre decisiones o crecimiento, las partes seguirán este procedimiento:\n1. Negociación directa entre representantes de ambas organizaciones.\n2. Intervención del Comité de Dirección Estratégica.\n3. Mediación o conciliación ante un tercero neutral.\n4. Arbitraje: como último recurso, acudir a un tribunal de arbitramento en Colombia conforme a la ley.",
        ],
      },
      {
        title: "Prevención de Bloqueos y Control",
        clause: "Cláusulas octava y novena",
        body: [
          "CLÁUSULA OCTAVA. CLÁUSULA ESPECIAL DE PREVENCIÓN DE BLOQUEOS (DEADLOCK): Cuando las partes no logren llegar a un acuerdo sobre una decisión estratégica que pueda afectar el desarrollo de Sodimac Colombia S.A., solicitarán la evaluación de un experto independiente (financiero y técnico).\n\nLas partes analizarán dicho concepto y procurarán alcanzar una decisión conjunta dentro de los quince (15) días hábiles siguientes a su presentación, evitando que diferencias entre accionistas paralicen proyectos.",
          "CLÁUSULA NOVENA. SEGUIMIENTO Y EVALUACIÓN: Evaluaciones trimestrales sobre el cumplimiento de objetivos, ejecución de inversiones y resultados de estrategias implementadas, presentadas a directivos para mejoras y ajustes.",
        ],
      },
      {
        title: "Confidencialidad y Vigencia",
        clause: "Cláusulas décima a décima segunda",
        body: [
          "CLÁUSULA DÉCIMA. CONFIDENCIALIDAD: Las partes se comprometen a mantener la confidencialidad de la información financiera, comercial, estratégica y administrativa conocida en la alianza, evitando su uso para fines distintos a los previstos.",
          "CLÁUSULA DÉCIMA PRIMERA. MODIFICACIONES DEL CONTRATO: Cualquier modificación o ajuste deberá constar por escrito con aprobación de ambas partes, conforme a las disposiciones legales y societarias.",
          "CLÁUSULA DÉCIMA SEGUNDA. VIGENCIA Y TERMINACIÓN: El contrato tendrá una vigencia inicial de cinco (5) años contados a partir de su firma, prorrogable por acuerdo escrito. Podrá terminarse por mutuo acuerdo, incumplimiento o causales de ley.",
        ],
      },
      {
        title: "Legislación y Suscripción",
        clause: "Cláusulas décima tercera y décima cuarta",
        body: [
          "CLÁUSULA DÉCIMA TERCERA. LEGISLACIÓN APLICABLE: El presente contrato se regirá íntegramente por las leyes comerciales y societarias de la República de Colombia.",
          "CLÁUSULA DÉCIMA CUARTA. PERFECCIONAMIENTO: Se entenderá perfeccionado con la firma de los representantes legales de ambas organizaciones en la ciudad de Bogotá D.C., a los 30 días del mes de Noviembre del año 2026.\n\nSuscrito por:\n• Por ORGANIZACIÓN CORONA S.A.: Representante Legal.\n• Por INVERSIONES FALABELLA DE COLOMBIA S.A.: Representante Legal.",
        ],
      },
    ],
  },
];

const KEY = "corona-falabella-stations-v2";

export function loadStations(): Station[] {
  if (typeof window === "undefined") return DEFAULT_STATIONS;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Station[]) : DEFAULT_STATIONS;
  } catch {
    return DEFAULT_STATIONS;
  }
}

export function saveStations(s: Station[]) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function resetStations() {
  localStorage.removeItem("corona-falabella-stations-v1");
  localStorage.removeItem("corona-falabella-stations-v2");
}

export function toEmbed(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

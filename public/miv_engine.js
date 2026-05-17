// ============================================================
// ZIMIL — Motor de Inferencia MIV v2
// Reemplaza la función buildMIV() hardcodeada en waitlist.html
//
// USO:
//   const miv = await buildMIV({ ageRange, categories, apps,
//                                 sensibilidadPrecioResp, lealtadMarcaResp,
//                                 orientacion, adopcionTechResp, city });
//
// Requiere: /api/groq.js ya existente en el proyecto (proxy de Groq)
// ============================================================

// ─── Prompt del sistema ─────────────────────────────────────
// Este prompt va en el campo system de la llamada a Groq/LLM.
// Está diseñado para Colombia/Latam y devuelve JSON puro.

const MIV_SYSTEM_PROMPT = `Eres el motor de inferencia de ZIMIL. Tu tarea es construir un Mimetic Identity Vector (MIV) a partir de las respuestas de un usuario en un onboarding de 7 pasos.

REGLAS ABSOLUTAS:
- Responde ÚNICAMENTE con un objeto JSON válido. Sin texto antes, sin texto después, sin markdown, sin backticks.
- Todos los valores numéricos son decimales entre 0.00 y 1.00 con exactamente 2 decimales.
- Razona de forma holística: cruza TODAS las señales para calcular cada dimensión. No mapees respuestas a valores de forma aislada.

DIMENSIONES A CALCULAR:

1. sensibilidad_precio (0.0 = compra sin importar precio, 1.0 = muy sensible al precio)
   - Señales: precio_respuesta (peso 50%) + categorías de gasto (30%) + apps de pago (20%)
   - Si usa efectivo principalmente → +0.15 al valor
   - Si gasta en Tech/Viajes → -0.10 (disposición a pagar más)
   - Si gasta en Ropa/Entretenimiento → neutro

2. lealtad_marca (0.0 = siempre cambia, 1.0 = muy leal)
   - Señales: lealtad_respuesta (peso 60%) + categorías (20%) + adopción tech (20%)
   - Alta adopción tech → tiende a lealtad tech pero no a otras categorías
   - Viajes/Experiencias → baja lealtad general

3. adopcion_tecnologica (0.0 = evita tech nueva, 1.0 = early adopter extremo)
   - Señales: tech_respuesta (peso 50%) + apps digitales usadas (30%) + edad (20%)
   - Nequi+Rappi+MercadoPago = señal fuerte de adopción
   - Solo efectivo = señal fuerte de no adopción
   - Edad 18-24 → +0.05 bonus, 40+ → -0.05

4. orientacion_temporal (0.0 = solo presente/hedonista, 1.0 = planificador de largo plazo)
   - Señales: orientacion_respuesta (peso 70%) + sensibilidad_precio calculada (30%)
   - Presente → ~0.15-0.30, Mixta → ~0.40-0.60, Futuro → ~0.70-0.90
   - Alta sensibilidad precio + presente → puede indicar restricción, no hedonismo → ajusta hacia 0.35

5. digitalidad (0.0 = economía informal/efectivo, 1.0 = 100% digital)
   - Señales: apps de pago (única fuente)
   - Efectivo principalmente → 0.10-0.20
   - 1 app digital → 0.35-0.50
   - 2 apps digitales → 0.55-0.70
   - 3+ apps digitales → 0.75-0.95
   - Bancolombia/Daviplata = apps más "formales" → +0.05 vs Nequi/Rappi

6. impulsividad (0.0 = comprador muy planificado, 1.0 = muy impulsivo)
   - Señales: cruce de orientacion_temporal + sensibilidad_precio + categorías
   - Presente + baja sensibilidad precio = muy impulsivo (0.70-0.90)
   - Presente + alta sensibilidad precio = impulsivo pero contenido (0.45-0.60)
   - Futuro + alta sensibilidad precio = planificado (0.10-0.25)
   - Futuro + baja sensibilidad precio = planificado con capacidad (0.20-0.35)
   - Entretenimiento/Ropa en categorías → +0.10
   - Tech/Salud en categorías → -0.10

7. segmento (string — exactamente uno de los 8 arquetipos)
   - Analiza el vector completo y asigna el arquetipo más coherente:
   - "Digital Native": adopcion>0.80, edad 18-24, impulsividad>0.55, digitalidad>0.70
   - "Tech Early Adopter": adopcion>0.75, lealtad_marca>0.60 (a marcas tech), categorias incluye Tech
   - "Practical Millennial": edad 25-32, sensibilidad>0.55, digitalidad>0.60, orientacion>0.45
   - "Digital Nomad": categorias incluye Viajes, adopcion>0.65, lealtad<0.45
   - "Established Professional": edad 33-40 o 40+, orientacion>0.65, lealtad>0.55
   - "Value Hunter": sensibilidad>0.70, impulsividad<0.40, orientacion_mixta o presente
   - "Traditional Consumer": digitalidad<0.35, adopcion<0.40, lealtad>0.60
   - "Aspiring Explorer": edad 18-24 o 25-32, categorias incluye Viajes o Ropa, impulsividad>0.45
   - Si hay empate entre dos arquetipos, elige el que tenga más dimensiones alineadas.

8. confianza_miv (0.0 = señales contradictorias, 1.0 = señales muy coherentes)
   - Evalúa qué tan consistentes son las respuestas entre sí.
   - Señales coherentes: edad + apps + tech_respuesta apuntan en la misma dirección.
   - Señales contradictorias: dice "primero en probar tech" pero usa solo efectivo.
   - Rango típico con solo onboarding: 0.55-0.85. Nunca pongas 1.0 con solo 7 preguntas.

FORMATO DE RESPUESTA (JSON exacto, sin nada más):
{
  "sensibilidad_precio": 0.63,
  "lealtad_marca": 0.47,
  "adopcion_tecnologica": 0.88,
  "orientacion_temporal": 0.71,
  "digitalidad": 0.82,
  "impulsividad": 0.38,
  "segmento": "Tech Early Adopter",
  "confianza_miv": 0.79,
  "razonamiento": "Breve explicación de 1-2 oraciones de por qué este segmento y los valores más relevantes."
}

El campo "razonamiento" es para auditoría interna — máximo 2 oraciones, en español.`;


// ─── Función principal ───────────────────────────────────────

/**
 * Construye el MIV completo usando IA.
 * Llama al proxy /api/groq.js que ya existe en el proyecto.
 *
 * @param {Object} respuestas - Todas las respuestas del onboarding
 * @returns {Object} - MIV completo listo para guardar en Supabase
 */
async function buildMIV(respuestas) {
  const {
    ageRange,
    categories,
    apps,
    sensibilidadPrecioResp,  // el texto de la opción seleccionada
    lealtadMarcaResp,         // el texto de la opción seleccionada
    orientacion,              // "Presente" | "Mixta" | "Futuro"
    adopcionTechResp,         // el texto de la opción seleccionada
    city
  } = respuestas;

  // Construir el mensaje de usuario con las respuestas en lenguaje natural
  const userMessage = `Calcula el MIV para este usuario:

- Edad: ${ageRange}
- Categorías de gasto principales: ${categories.join(', ')}
- Apps de pago que usa: ${apps.join(', ')}
- Ante precio más alto de lo esperado: "${sensibilidadPrecioResp}"
- Con marcas que usa seguido: "${lealtadMarcaResp}"
- Orientación al gastar: "${orientacion}"
- Con apps y tecnología nueva: "${adopcionTechResp}"
- Ciudad: ${city}`;

  try {
    // Llamar al proxy de Groq existente en el proyecto
    const response = await fetch('/api/groq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 400,
        system: MIV_SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: userMessage }
        ]
      })
    });

    if (!response.ok) throw new Error('Groq API error: ' + response.status);

    const data = await response.json();

    // Extraer el texto de la respuesta
    const raw = data.choices?.[0]?.message?.content || '';

    // Limpiar por si acaso viene con backticks
    const clean = raw.replace(/```json|```/g, '').trim();

    const inferido = JSON.parse(clean);

    // Construir el MIV final con metadatos
    return {
      // Dimensiones calculadas por IA
      sensibilidad_precio:    inferido.sensibilidad_precio,
      lealtad_marca:          inferido.lealtad_marca,
      adopcion_tecnologica:   inferido.adopcion_tecnologica,
      orientacion_temporal:   inferido.orientacion_temporal,
      digitalidad:            inferido.digitalidad,
      impulsividad:           inferido.impulsividad,
      segmento:               inferido.segmento,
      confianza_miv:          inferido.confianza_miv,

      // Campos de sistema
      completitud: 0.18,
      fuentes_activas: ['onboarding'],
      version: 2,

      // Metadatos no-PII para consultas de marcas
      meta: {
        age_range:      ageRange,
        payment_apps:   apps,
        top_categories: categories,
        city:           city,
        orientacion:    orientacion  // texto original para display
      },

      // Solo para auditoría interna — nunca se muestra al usuario
      _razonamiento: inferido.razonamiento || ''
    };

  } catch (err) {
    console.error('[ZIMIL MIV] Error en inferencia IA:', err);

    // Fallback: MIV básico con reglas simples si la IA falla
    return buildMIVFallback(respuestas);
  }
}


// ─── Fallback (reglas simples si la IA falla) ────────────────
// Mantiene compatibilidad con el comportamiento anterior.

function buildMIVFallback(respuestas) {
  const { ageRange, categories, apps, orientacion, city } = respuestas;

  // digitalidad simple basada en apps
  const appsDigitales = apps.filter(a => a !== 'Efectivo principalmente').length;
  const digitalidad = apps.includes('Efectivo principalmente')
    ? Math.min(0.25 + appsDigitales * 0.12, 0.50)
    : Math.min(0.40 + appsDigitales * 0.15, 0.92);

  // segmento simple por edad + tech
  let segmento = 'Practical Millennial';
  if (ageRange === '18-24') segmento = 'Digital Native';
  else if (ageRange === '33-40') segmento = 'Established Professional';
  else if (ageRange === 'Mas de 40') segmento = 'Traditional Consumer';
  else if (categories.includes('Viajes y experiencias')) segmento = 'Digital Nomad';

  return {
    sensibilidad_precio:  0.50,
    lealtad_marca:        0.50,
    adopcion_tecnologica: 0.50,
    orientacion_temporal: orientacion === 'Futuro' ? 0.75 : orientacion === 'Presente' ? 0.25 : 0.50,
    digitalidad,
    impulsividad:         0.50,
    segmento,
    confianza_miv:        0.40,
    completitud:          0.18,
    fuentes_activas:      ['onboarding'],
    version:              2,
    meta: {
      age_range:      ageRange,
      payment_apps:   apps,
      top_categories: categories,
      city:           city,
      orientacion:    orientacion
    },
    _razonamiento: 'Fallback — inferencia IA no disponible'
  };
}


// ─── Textos de respuesta → labels legibles ───────────────────
// El onboarding guarda el texto de la pill. Esta función
// lo convierte a label legible para mostrar en el dashboard.

const ORIENTACION_LABEL = {
  'Presente': 'Presente',
  'Mixta':    'Equilibrado',
  'Futuro':   'Planificador'
};

const SEGMENTO_DESCRIPCION = {
  'Digital Native':        'Nativo digital, impulsivo y conectado',
  'Tech Early Adopter':    'Adopta tech primero, leal a sus marcas favoritas',
  'Practical Millennial':  'Digital y pragmático, busca valor',
  'Digital Nomad':         'Viajero, flexible, siempre explorando',
  'Established Professional': 'Estable, planificador, marca-leal',
  'Value Hunter':          'Busca la mejor relación precio-valor',
  'Traditional Consumer':  'Prefiere lo conocido, paga en efectivo',
  'Aspiring Explorer':     'Joven, aspira a vivir experiencias nuevas'
};

// Exportar para uso en otros módulos si se migra a ES modules
if (typeof module !== 'undefined') {
  module.exports = { buildMIV, buildMIVFallback, MIV_SYSTEM_PROMPT, SEGMENTO_DESCRIPCION };
}

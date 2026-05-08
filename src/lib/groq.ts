const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY as string;
const GROQ_MODEL = "llama-3.3-70b-versatile";

export interface MIV {
  perfil: string;
  sensibilidad_precio: number;
  lealtad_marca: number;
  adopcion_tecnologica: number;
  orientacion: string;
  categoria_top: string[];
  segmento: string;
  completitud: number;
  meta: { age_range: string; payment_apps: string[]; city: string };
}

export interface Twin {
  name: string;
  age_range: string;
  city: string;
  miv: MIV;
}

export interface BrandContext {
  nombre: string;
  categoria: string;
  tamano: string;
  ciudad: string;
  objetivo: string;
  rangoPrecio: string;
}

export interface InsightResult {
  insight: string;
  porcentaje: number;
  confianza: "Alta" | "Media" | "Baja";
  segmentos: { nombre: string; pct: number; descripcion: string }[];
  recomendacion: string;
  follow_ups: string[];
  pool_size: number;
  costo_consulta: string;
}

export async function consultarPool(
  pregunta: string,
  twins: Twin[],
  brand?: BrandContext
): Promise<InsightResult> {
  const poolResumen = twins.map((t, i) =>
    `Gemelo ${i + 1}: ${t.miv.segmento}, ${t.age_range} años, ${t.city}. ` +
    `Precio: ${t.miv.sensibilidad_precio}, Lealtad: ${t.miv.lealtad_marca}, ` +
    `Tech: ${t.miv.adopcion_tecnologica}, Orientación: ${t.miv.orientacion}. ` +
    `Categorías: ${t.miv.categoria_top.join(", ")}.`
  ).join("\n");

  const brandContext = brand
    ? `\nCONTEXTO DE LA MARCA:
- Empresa: ${brand.nombre}
- Categoría: ${brand.categoria}
- Tamaño: ${brand.tamano}
- Ciudad principal: ${brand.ciudad}
- Objetivo: ${brand.objetivo}
- Rango de precio de su producto: ${brand.rangoPrecio}

Personaliza el insight y la recomendación específicamente para esta marca. 
Prioriza gemelos de ${brand.ciudad} y con categorías afines a ${brand.categoria}.`
    : "";

  const systemPrompt = `Eres el motor de simulación de ZIMIL. Tienes acceso a un pool de ${twins.length} gemelos digitales anonimizados de consumidores colombianos.${brandContext}

POOL DE GEMELOS:
${poolResumen}

Responde SOLO con JSON válido, sin texto adicional ni markdown:
{
  "insight": "hallazgo principal en 1-2 oraciones directas y específicas para la marca",
  "porcentaje": número entre 0 y 100,
  "confianza": "Alta" | "Media" | "Baja",
  "segmentos": [
    { "nombre": "segmento", "pct": número, "descripcion": "descripción breve de por qué este segmento responde así" }
  ],
  "recomendacion": "acción concreta y específica para ${brand?.nombre || "la marca"} en 1-2 oraciones",
  "follow_ups": [
    "pregunta de seguimiento relevante 1",
    "pregunta de seguimiento relevante 2",
    "pregunta de seguimiento relevante 3"
  ],
  "pool_size": ${twins.length},
  "costo_consulta": "$${(twins.length * 0.05).toFixed(2)} USD"
}

- El porcentaje debe reflejar el análisis real de los perfiles
- Los follow_ups deben ser preguntas naturales que la marca querría hacer después de ver este resultado
- La recomendación debe ser específica para la categoría y tamaño de la marca`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      max_tokens: 1000,
      temperature: 0.3,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: pregunta }
      ]
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq error: ${response.status} — ${err}`);
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content ?? "{}";

  try {
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean) as InsightResult;
  } catch {
    throw new Error("No se pudo parsear la respuesta de Groq");
  }
}

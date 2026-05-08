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

export interface InsightResult {
  insight: string;
  porcentaje: number;
  confianza: "Alta" | "Media" | "Baja";
  segmentos: { nombre: string; pct: number; descripcion: string }[];
  recomendacion: string;
  pool_size: number;
  costo_consulta: string;
}

export async function consultarPool(pregunta: string, twins: Twin[]): Promise<InsightResult> {
  const poolResumen = twins.map((t, i) =>
    `Gemelo ${i + 1}: ${t.miv.segmento}, ${t.age_range} años, ${t.city}. ` +
    `Sensibilidad precio: ${t.miv.sensibilidad_precio}, Lealtad: ${t.miv.lealtad_marca}, ` +
    `Tech: ${t.miv.adopcion_tecnologica}, Orientación: ${t.miv.orientacion}. ` +
    `Categorías: ${t.miv.categoria_top.join(", ")}.`
  ).join("\n");

  const systemPrompt = `Eres el motor de simulación de ZIMIL. Tienes acceso a un pool de ${twins.length} gemelos digitales anonimizados de consumidores colombianos. Cada gemelo representa la lógica de decisión real de una persona.

Tu trabajo: cuando una marca hace una pregunta de investigación de mercado, analizas el pool y devuelves un insight accionable.

POOL DE GEMELOS:
${poolResumen}

INSTRUCCIONES DE RESPUESTA:
- Responde SOLO con JSON válido, sin texto adicional ni markdown
- El JSON debe seguir exactamente esta estructura:
{
  "insight": "frase principal del hallazgo (1-2 oraciones directas)",
  "porcentaje": número entre 0 y 100,
  "confianza": "Alta" | "Media" | "Baja",
  "segmentos": [
    { "nombre": "nombre del segmento", "pct": número, "descripcion": "descripción breve" }
  ],
  "recomendacion": "acción concreta que la marca debería tomar (1-2 oraciones)",
  "pool_size": ${twins.length},
  "costo_consulta": "$${(twins.length * 0.05).toFixed(2)} USD"
}

- Basa el porcentaje en el análisis real de los perfiles del pool
- Incluye 2-3 segmentos con su distribución
- Sé directo y accionable, como un consultor de mercado senior`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      max_tokens: 800,
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

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Waitlist count for type='user'.
 * Uses admin client so the public table policies stay insert-only.
 */
export const getWaitlistUserCount = createServerFn({ method: "GET" }).handler(
  async () => {
    const { count, error } = await supabaseAdmin
      .from("waitlist")
      .select("*", { count: "exact", head: true })
      .eq("type", "user");

    if (error) {
      console.error("getWaitlistUserCount error:", error);
      return { count: 0 };
    }
    return { count: count ?? 0 };
  },
);

const JoinSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().toLowerCase().email().max(254),
  city: z.string().trim().min(1).max(80),
});

export type JoinResult =
  | { ok: true; alreadyIn: boolean }
  | { ok: false; code: "invalid_email" | "error"; message: string };

export const joinWaitlist = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const parsed = JoinSchema.safeParse(input);
    if (!parsed.success) {
      throw new Error("invalid_input");
    }
    return parsed.data;
  })
  .handler(async ({ data }): Promise<JoinResult> => {
    try {
      const { error } = await supabaseAdmin.from("waitlist").insert({
        name: data.name,
        email: data.email,
        city: data.city,
        type: "user",
      });

      if (error) {
        // 23505 = unique_violation on lower(email) index
        if (error.code === "23505") {
          return { ok: true, alreadyIn: true };
        }
        console.error("joinWaitlist insert error:", error);
        return { ok: false, code: "error", message: "Algo falló. Intenta de nuevo." };
      }

      return { ok: true, alreadyIn: false };
    } catch (err) {
      console.error("joinWaitlist exception:", err);
      return { ok: false, code: "error", message: "Algo falló. Intenta de nuevo." };
    }
  });

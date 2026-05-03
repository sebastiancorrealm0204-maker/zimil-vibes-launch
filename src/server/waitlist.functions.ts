import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { insertWaitlistUser } from "./waitlist.server";

const JoinSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().toLowerCase().email().max(254),
  phone: z.string().trim().regex(/^\d{10}$/),
  age_range: z.string().trim().min(1).max(40),
  top_categories: z.string().trim().max(300),
  payment_apps: z.string().trim().max(300),
  city: z.string().trim().min(1).max(80),
});

export type JoinResult =
  | { ok: true; alreadyIn: boolean }
  | { ok: false; code: "invalid_email" | "invalid_phone" | "error"; message: string };

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
      const { error } = await insertWaitlistUser(data);

      if (error) {
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

import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

/**
 * Returns the count of waitlist entries with type='user'.
 * Runs on the server with the service role key so the public
 * waitlist policies stay insert-only (emails remain private).
 */
export const getWaitlistUserCount = createServerFn({ method: "GET" }).handler(
  async () => {
    const url = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
      return { count: 0 };
    }

    const admin = createClient(url, serviceKey, {
      auth: { persistSession: false },
    });

    const { count, error } = await admin
      .from("waitlist")
      .select("*", { count: "exact", head: true })
      .eq("type", "user");

    if (error) {
      return { count: 0 };
    }

    return { count: count ?? 0 };
  },
);

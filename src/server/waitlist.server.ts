import { supabaseAdmin } from "@/integrations/supabase/client.server";

type JoinWaitlistData = {
  name: string;
  email: string;
  phone: string;
  age_range: string;
  top_categories: string;
  payment_apps: string;
  city: string;
};

export async function insertWaitlistUser(data: JoinWaitlistData) {
  return supabaseAdmin.from("waitlist").insert({
    name: data.name,
    email: data.email,
    phone: data.phone,
    age_range: data.age_range,
    top_categories: data.top_categories,
    payment_apps: data.payment_apps,
    city: data.city,
    type: "user",
  });
}
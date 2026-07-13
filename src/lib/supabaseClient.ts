import { createClient } from "@supabase/supabase-js";

const getSupabaseUrlAndKey = (): [string, string] => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl) {
    throw new Error(
      "SUPABASE_URL is not defined in the environment variables.",
    );
  }
  if (!supabaseKey) {
    throw new Error(
      "SUPABASE_ANON_KEY is not defined in the environment variables.",
    );
  }
  return [supabaseUrl, supabaseKey];
};

const [supabaseUrl, supabaseKey] = getSupabaseUrlAndKey();

export const supabase = createClient(supabaseUrl!, supabaseKey!);

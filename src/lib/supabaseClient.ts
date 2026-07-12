import { createClient } from "@supabase/supabase-js";

const getSupabaseUrlAndKey = (): [string, string] => {
  const supabaseUrl: string | undefined = process.env.SUPABASE_URL;
  const supabaseKey: string | undefined = process.env.SUPABASE_ANON_KEY;
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

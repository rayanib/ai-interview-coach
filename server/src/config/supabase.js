import { createClient } from "@supabase/supabase-js";

// Read Supabase settings from the environment so secret values never enter source control.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase settings. Copy server/.env.example to server/.env and add your values.",
  );
}

// This client lets the backend read and write interview data in Supabase.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

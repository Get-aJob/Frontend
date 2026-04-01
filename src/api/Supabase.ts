import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anon_key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(url, anon_key);

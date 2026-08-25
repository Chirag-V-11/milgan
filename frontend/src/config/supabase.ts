import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bxqtwqjulzpoohvwwhfs.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_akmmX8OvsuDe5YDTDGEz4g_Dtny30we';

export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

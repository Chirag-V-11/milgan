import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bxqtwqjulzpoohvwwhfs.supabase.co';
const supabaseKey = 'sb_publishable_akmmX8OvsuDe5YDTDGEz4g_Dtny30we';

export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

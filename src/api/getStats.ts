import { supabase } from '@api/supabase';

export const getStats = async () => {
  const { data, error } = await supabase
    .from('lists')
    .select('data')
    .eq('name', 'stats')
    .single();

  return data || error;
}

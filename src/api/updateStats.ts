import { supabase } from '@api/supabase';

export const updateStats = async (stats) => {
  const { data, error } = await supabase
    .from('lists')
    .update({ data: JSON.stringify(stats) })
    .eq('name', 'stats');
}

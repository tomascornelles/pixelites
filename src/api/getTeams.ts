import { supabase } from '@api/supabase';

export const getTeams = async () => {
  const { data, error } = await supabase
    .from('lists')
    .select('data')
    .eq('name', 'teams')
    .single();

  return data || error;
}

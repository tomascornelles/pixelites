import { supabase } from '@api/supabase';

export const getCompetitions = async () => {
  const { data, error } = await supabase
    .from('lists')
    .select('data')
    .eq('name', 'competitions')
    .single();

  return data || error;
}


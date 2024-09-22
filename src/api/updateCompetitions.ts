import { supabase } from '@api/supabase';

export const updateCompetitions = async (list) => {
  const { data, error } = await supabase
  .from('lists')
  .update({
    data: JSON.stringify(list),
  })
  .eq('name', 'competitions');
}


import { supabase } from '@api/supabase';

export const updateTeams = async (list) => {
  const { data, error } = await supabase
  .from('lists')
  .update({
    data: JSON.stringify(list),
  })
  .eq('name', 'teams');
}

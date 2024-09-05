import { supabase } from '@api/supabase';

const loadData = async (table: string, columns: string = '') => {
  const { data, error } = await supabase .from(table) .select(columns)

  return data || '';
}

const getTeams = async () => {
  const { data, error } = await supabase
  .from('kits')
  .select('team!inner(id, name, slug)');

  return reduceData(data, 'team') || error;
}

const getLeagues = async () => {
  const { data, error } = await supabase
  .from('kits')
  .select('competition!inner(id, name, slug, country))')

  let competitions = {};
  const result = [];

  data.forEach(kit => {
    if (!competitions[kit['competition'].id]) {
      competitions[kit['competition'].id] = kit['competition'];
    }
  })

  for (let competition in competitions) {
    result.push(competitions[competition])
  }

  return result || error;
}

const getKits = async (teamId) => {
  const { data, error } = await supabase
  .from('kits')
  .select('*, team!inner(id, name, slug), competition!inner(id, name, slug, country)')
  .eq('team.slug', teamId)
  .order('year', { ascending: false });

  return data || error;
}

const getLeagueKits = async (leagueId) => {
  const { data, error } = await supabase
  .from('kits')
  .select('*, team!inner(id, name, slug), competition!inner(id, name, slug, country)')
  .eq('competition.slug', leagueId)
  .order('year', { ascending: false });

  return data || error;
}

const getAllTeams = async () => {
  const { data, error } = await supabase
  .from('teams')
  .select('*');

  return data || error;
}

const getAllCompetitions = async () => {
  const { data, error } = await supabase
  .from('leagues')
  .select('*');

  return data || error;
}

const getLatestKits = async () => {
  const { data, error } = await supabase
  .from('kits')
  .select('*, team!inner(id, name, slug)')
  .order('created_at', { ascending: false })
  .limit(24);

  return data || error;
}

const getTemplates = async () => {
  const { data, error } = await supabase
  .from('templates')
  .select('*');

  return data || error;
}

const getKit = async (id) => {
  const { data, error } = await supabase
  .from('kits')
  .select('*')
  .eq('id', id);

  return data || error;
}

const saveKit = async (kit) => {
  const { data, error } = await supabase
  .from('kits')
  .insert(kit)
  .select();

  return data || error;
}

const updateKit = async (kit) => {
  const { data, error } = await supabase
  .from('kits')
  .update(kit)
  .eq('id', kit.id);
}

const deleteKit = async (id) => {
  const { data, error } = await supabase
  .from('kits')
  .delete()
  .eq('id', id);
}

const countKits = async (key = '', value = '') => {
  const { count, error } = await supabase
  .from('kits')
  .select('*', { count: 'exact'})
  // .eq(key, value);

  return count || error;
}

const countTeams = async (key = '', value = '') => {
  const teams = [];
  const { data, count,  error } = await supabase
  .from('kits')
  .select('team')

  for (let team in data) {
    if (!teams.includes(data[team]['team'])) {
      teams.push(data[team]['team'])
    }
  }

  return teams.length || error;
}

const reduceData = async (data, key: string) => {
  const filteredData = {};
  const reducedData = [];

  if (Array.isArray(data)) {
    for (let item of data) {
      filteredData[item[key].id] = item[key];
    }
  } else {
    for (let item in data) {
      console.log('item', item)
      filteredData[item['id']] = item;
    }
  }

  for (let item in filteredData) {
    reducedData.push(filteredData[item])
  }

  return reducedData;
}

const login = async (email, password) => {
  const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('email', email)
  .eq('password', password);

  return data || error;
}

export {
  loadData,
  getTeams,
  getLeagues,
  getKits,
  getLeagueKits,
  getLatestKits,
  getTemplates,
  getAllTeams,
  getAllCompetitions,
  getKit,
  saveKit,
  updateKit,
  deleteKit,
  countKits,
  countTeams,
  login,
};

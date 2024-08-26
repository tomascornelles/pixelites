import { supabase } from '@api/supabase';
import {reduce} from 'rxjs';

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
  .select('team!inner(id, name, slug, league!inner(id, name, slug, country))');
  // .from('teams')
  // .select('league!inner(id, name, slug, country)')
  let leagues;
  await reduceData(data, 'team').then((teams) => {
    leagues = reduceData(teams, 'league');
  });

  return leagues || error;
}

const getKits = async (teamId) => {
  const { data, error } = await supabase
  .from('kits')
  .select('*, team!inner(id, name, slug)')
  .eq('team.slug', teamId)
  .order('year', { ascending: false });

  return data || error;
}

const getLeagueKits = async (leagueId) => {
  const { data, error } = await supabase
  .from('kits')
  .select('*, team!inner(id, name, slug, league!inner(id, name, slug, country))')
  .eq('team.league.slug', leagueId)
  .order('year', { ascending: false });

  return data || error;
}

const getLatestKits = async () => {
  const { data, error } = await supabase
  .from('kits')
  .select('*, team!inner(id, name, slug)')
  .order('created_at', { ascending: false })
  .limit(8);

  return data || error;
}

const getTemplates = async () => {
  const { data, error } = await supabase
  .from('templates')
  .select('*');

  return data || error;
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

export {
  loadData,
  getTeams,
  getLeagues,
  getKits,
  getLeagueKits,
  getLatestKits,
  getTemplates,
};

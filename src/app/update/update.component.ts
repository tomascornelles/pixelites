import { Component } from '@angular/core';
import { supabase } from '@api/supabase';
import { updateTeams } from '@api/updateTeams';
import { updateCompetitions } from '@api/updateCompetitions';
import {updateStats} from '@api/updateStats';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [],
  template: `
    @if (complete) {
    <p>update works!</p>
    }
    @else {
    <p>Updating ... {{ percentage }}%</p>
    <progress max="100" value="{{ percentage }}"></progress>
    <p>{{ current }} / {{ total }}</p>
    }
  `,
  styleUrl: './update.component.scss'
})
export class UpdateComponent {
  allKits: any;
  complete: boolean = false;
  total: number = 0;
  current: number = 0;
  percentage: number = 0;
  $teamList = {};
  $competitionList = {};
  $statsList = {};

  ngOnInit() {
    this.getKits().then((data) => {
      this.allKits = data;
      this.total = Object.keys(this.allKits).length;

      for (let kit in this.allKits) {
        this.current += 1;
        this.percentage = Math.round(this.current / this.total * 100);
        this.allKits[kit]['competitionSlug'] = this.textToSlug(this.allKits[kit]['competition']);
        // this.updateKit(this.allKits[kit]);

        if (!this.$teamList[this.allKits[kit]['teamSlug']]) {
          this.$teamList[this.allKits[kit]['teamSlug']] = {name: this.allKits[kit]['team'], count: 1};
        } else {
          this.$teamList[this.allKits[kit]['teamSlug']]['count'] = this.$teamList[this.allKits[kit]['teamSlug']]['count'] + 1
        }

        if (!this.$competitionList[this.allKits[kit]['competitionSlug']]) {
          this.$competitionList[this.allKits[kit]['competitionSlug']] = {name: this.allKits[kit]['competition'], count: 1};
        } else {
          this.$competitionList[this.allKits[kit]['competitionSlug']]['count'] = this.$competitionList[this.allKits[kit]['competitionSlug']]['count'] + 1
        }
      }

      this.$statsList = {
        teams: Object.keys(this.$teamList).length,
        competitions: Object.keys(this.$competitionList).length,
        kits: this.total
      }

      updateTeams(this.$teamList);
      updateCompetitions(this.$competitionList);
      updateStats(this.$statsList);

      this.complete = true;
    });
  }

  private getKits = async () => {
    const { data, error } = await supabase
    .from('kits')
    .select('*')
    // .gte('id', 1)
    // .lt('id', 10)
    // .eq('id', 50)

    return data || error;
  }

  private updateKit = async (kit) => {
    const { data, error } = await supabase
    .from('kits')
    .update(kit)
    .eq('id', kit.id);
  }

  private checkTeam = async (team, name) => {
    if (!this.$teamList[team]) {
      this.$teamList[team] = name;
    } else {
      this.$teamList[team]['count'] = this.$teamList[team]['count'] + 1
    }
  }

  private getTeams = async () => {
    const { data, error } = await supabase
    .from('lists')
    .select('*')
    .eq('name', 'teams');

    return data || error;
  }

  private createTeam = async (team, name) => {
    console.log('> create team', team, name);
    const { data, error } = await supabase
    .from('teams')
    .insert({
      id: team,
      name: name,
      count: 1,
    });
  }

  private textToSlug(text) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
  }
}

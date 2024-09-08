import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { KitComponent } from '@components/kit/kit.component';
import { Error404Component } from '@views/error404/error404.component';
import { getLeagueKits, getTemplates } from '@api/loadData';

@Component({
  selector: 'app-league',
  standalone: true,
  imports: [KitComponent, Error404Component, RouterModule],
  template: `
    @if (loading) {
      <article aria-busy="true">Loading</article>
    }
    @else if (kits.length === 0) {
      <app-error404></app-error404>
    }
    @else {
    <h2>{{ leagueId.toUpperCase() }}</h2>
    <div class="years">
      @for (year of years; track year) {
        <article>
          <header>
            <h3>{{year}}</h3>
          </header>

          <div class="kits">
            @for (kit of kits; track kit) {
              @if (kit['year'] === year) {
                <a [routerLink]="['/team', kit['teamSlug']]">
                  <app-kit
                    [layers]="kit"
                    [templates]="templates"
                    [label]="kit['team']"
                  ></app-kit>
                </a>
              }
            }
          </div>
        </article>
      }
    </div>
    }
  `,
  styles: `
    app-kit {
      display: inline-block;
    }
    h2 {
      margin-block-end: 1em;
    }
    h3 {
      margin-block-end: 0;
    }
    .kits {
      display: flex;
      flex-wrap: wrap;
      gap: 1em;
      justify-content: space-between;
    }
  `,
})

export class LeagueComponent {
  leagueId = '';
  kits = [];
  templates = [];
  years = [];
  loading = true;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loading = true;
      this.leagueId = params['id'];
      this.kits = [];
      this.years = [];
      getLeagueKits(this.leagueId).then((kits) => {

        for (let kit in kits) {
          this.leagueId = kits[kit]['competition'];
          if (kits[kit]['name'] === 'Home') {
            this.kits.push(kits[kit]);
          }
          if (!this.years.includes(kits[kit]['year'])) {
            this.years.push(kits[kit]['year'])
          }
        }

        this.kits = this.sortByTeamName(this.kits);
        this.loading = false
      })
    });

    getTemplates().then((templates) => {
      for (let template in templates) {
        this.templates.push(templates[template])
      }
    })
  }

  private sortByTeamName(kits) {
    return kits.sort((a, b) => {
      if (a['team'] < b['team']) {
        return -1
      }
      if (a['team'] > b['team']) {
        return 1
      }
      return 0
    })
  }
}

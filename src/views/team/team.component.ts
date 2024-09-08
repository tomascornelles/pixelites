import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { KitComponent } from '@components/kit/kit.component';
import { getKits, getTemplates } from '@api/loadData';
import { isLogged } from '@services/login';
import sortByName from '@services/sortByName';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [KitComponent, RouterModule],
  template: `
    @if (loading) {
      <article aria-busy="true">Loading</article>
    }
    @else {
    <h2>
      {{ teamName.toUpperCase() }}
    </h2>
    <p class="competitions">
      @for (competition of competitions; track competition) {
        <a [routerLink]="['/competition', competition['slug']]">
          {{ competition['name'] }}
        </a>
      }
    </p>
    <div class="years">
      @for (year of years; track year) {
          <article>
            <header>
              <h2> {{year}} </h2>
            </header>

        @for (competition of competitions; track competition) {
          @if (competitions.length > 1 && yearsAndCompetitions[year][competition['slug']]) {
          <h3>
            {{competition['name']}}
          </h3>
          }

            <div class="kits">
              @for (kit of kits; track kit) {
                @if (kit['year'] === year && kit['competitionSlug'] === competition['slug']) {
                  @if ($isLoggedIn) {
                    <a [routerLink]="['/kit/update', kit['id']]">
                      <app-kit
                        [layers]="kit"
                        [templates]="templates"
                        [label]="kit['name']"
                      ></app-kit>
                    </a>
                  }
                  @if (!$isLoggedIn) {
                    <app-kit
                      [layers]="kit"
                      [templates]="templates"
                      [label]="kit['name']"
                      [canDownload]="true"
                    ></app-kit>
                  }
                }
              }
            </div>
        }
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
      margin-block-end: 0;
    }
    h2 a {
      text-decoration: none;
      margin-inline-end: 0.5em;
    }
    h3 {
      font-size: 1.2rem;
      margin-block-start: 1em;
    }
    .kits {
      display:flex;
      flex-wrap: wrap;
      gap: 1em;
      justify-content: start;
    }
    .competitions {
      display: flex;
      gap: 2em;
      margin-block-end: 1em;
    }
  `,
})

export class TeamComponent {
  teamId = '';
  teamName = '';
  kits = [];
  templates = [];
  years = [];
  competitions = [];
  yearsAndCompetitions = {};
  loading = true;
  $isLoggedIn = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loading = true;
      this.teamId = params['id'];
      this.kits = [];
      this.years = [];
      this.competitions = [];
      const allCompetitions = {};

      if (isLogged()) {
        this.$isLoggedIn = true;
      }

      getKits(this.teamId).then((kits) => {
        for (let kit in kits) {
          this.kits.push(kits[kit]);
          if (!this.yearsAndCompetitions[kits[kit]['year']]) {
            this.yearsAndCompetitions[kits[kit]['year']] = {};
          }

          if (!this.yearsAndCompetitions[kits[kit]['year']][kits[kit]['competitionSlug']]) {
            this.yearsAndCompetitions[kits[kit]['year']][kits[kit]['competitionSlug']] = kits[kit];
          }

          if (!this.years.includes(kits[kit]['year'])) {
            this.years.push(kits[kit]['year'])
          }

          if (!allCompetitions[kits[kit]['competitionSlug']]) {
            allCompetitions[kits[kit]['competitionSlug']] = kits[kit]['competitionSlug'];
            this.competitions.push({name: kits[kit]['competition'], slug: kits[kit]['competitionSlug']});
          }
        }

        this.loading = false
        this.kits = sortByName(this.kits);
      })
    });

    getTemplates().then((templates) => {
      for (let template in templates) {
        this.templates.push(templates[template])
      }
    })
  }
}

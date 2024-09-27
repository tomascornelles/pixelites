import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { KitComponent } from '@components/kit/kit.component';
import { Error404Component } from '@views/error404/error404.component';
import { getKits, getTemplates } from '@api/loadData';
import { isLogged } from '@services/login';
import sortByName from '@services/sortByName';

@Component({
  selector: 'app-team',
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
    <h2>
      {{ teamName.toUpperCase() }}
      <span (click)="print()" class="print">
        <img src="print.svg" alt="Print">
      </span>
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
              <h3> {{year}} </h3>
            </header>

        @for (competition of competitions; track competition) {
          @if (competitions.length > 1 && yearsAndCompetitions[year][competition['slug']]) {
          <h4>
            <a [routerLink]="['/competition', competition['slug']]">{{competition['name']}}</a>
          </h4>
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
      display: flex;
      justify-content: space-between;
    }
    h2 a {
      text-decoration: none;
      margin-inline-end: 0.5em;
    }
    h3 {
      margin-block: 0;
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
    .print {
      cursor: pointer;
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
          this.teamName = kits[kit]['team'];
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

  public print() {
    setTimeout(() => {
      window.print();
    }, 500);
  }
}

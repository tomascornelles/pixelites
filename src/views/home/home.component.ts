import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { KitComponent } from '@components/kit/kit.component';
import { getLatestKits, getTemplates, countKits, countTeams } from '@api/loadData';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [KitComponent, RouterModule],
  template: `
    <blockquote>
      Remember those kits that made you vibrate on the pitch? In Pixelites, we revive the magic of football through 8x6 pixel designs. Each kit is a journey through time, a time capsule capturing the essence of an era and a team. Explore our extensive collection, organized by year and competition, and discover hidden treasures from the past. Pixelites is more than just a collection, it's a celebration of football history!
    </blockquote>

    @if (loading) {
      <article aria-busy="true">Loading</article>
    }
    @else {
        @if ($countKits > 0 || $countTeams > 0) {
        <article>
          <header>
            <h2>Overview</h2>
          </header>
          <p>
            There are <strong>{{$countKits}}</strong> kits and <strong>{{$countTeams }}</strong> teams
          </p>
          <p>
            Last updated: {{ $lastUppdated }}
          </p>
        </article>
      }

      <article>
        <header>
          <h2>Latest kits</h2>
        </header>
        <div class="kits">
          @for (kit of kits; track kit) {
            <a [routerLink]="['/team', kit['teamSlug']]">
              <app-kit
                [layers]="kit"
                [templates]="templates"
                [label]="kit['team'] + '|' + kit['year']"
              ></app-kit>
            </a>
          }
        </div>
      </article>
    }
  `,
  styles: `
    app-kit {
      display: inline-block;
    }
    h2 {
      margin-block-end: 0;
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

export class HomeComponent {
  leagueId = '';
  kits = [];
  templates = [];
  $countKits = 0;
  $countTeams = 0;
  $lastUppdated = '';
  loading = true;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loading = true;
      this.leagueId = params['id'];
      this.kits = [];
      getLatestKits().then((kits) => {
        for (let kit in kits) {
          this.kits.push(kits[kit]);
        }
        this.loading = false
        this.$lastUppdated = new Date(this.kits[0]['created_at']).toLocaleDateString();
      })
    });

    getTemplates().then((templates) => {
      for (let template in templates) {
        this.templates.push(templates[template])
      }
    })

    countKits().then((count) => {
      this.$countKits = +count
    })

    countTeams().then((count) => {
      this.$countTeams = +count
    })

  }
}

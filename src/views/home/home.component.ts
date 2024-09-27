import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { KitComponent } from '@components/kit/kit.component';
import { getLatestKits, getTemplates, countKits, countTeams } from '@api/loadData';
import { getStats } from '@api/getStats';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [KitComponent, RouterModule],
  template: `
    <article class='hero'>
      <div>
        <h2>Welcome</h2>
        <p>
          Do you remember those games of yesteryear where in a few pixels we saw all the soccer teams in the world?
        </p>
        <p>
          With Pixelites we try to achieve that minimalist experience with just 6x8 pixels to differentiate the colors of each team, and even the evolution of their kits.
          </p>
          <p>
            Enjoy browsing with the search engine <img src="search.svg" alt="search icon" width="16">, jumping between competitions and take the opportunity to print <img src="print.svg" alt="print icon" width="16"> beautiful posters of your favorite league or team or click in a kit to download as an avatar for your social media.
        </p>
      </div>
      <div class="poster">
        <img src="poster.png" alt="pixelites poster">
      </div>
    </article>

    @if (loading) {
      <article aria-busy="true">Loading</article>
    }
    @else {
        @if ($stats.kits > 0 || $stats.teams > 0 || $stats.competitions > 0) {
        <article class="overview">
          <p>
            There are <strong>{{$stats.kits}}</strong> kits from <strong>{{$stats.teams }}</strong> teams in <strong>{{$stats.competitions}}</strong> competitions
          </p>
          <p>
            Last updated: {{ $lastUppdated }}
          </p>
        </article>
      }

      <article class="kits">
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
    .hero {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1em;
    }
    @media (max-width: 1024px) {
      .hero > div {
        width: 60vw
      }
      .hero .poster {
        overflow: hidden;
        width: 33vw;
      }
      .poster img {
        width: 50vw;
        max-width: 400px;
      }
    }
    @media (max-width: 500px) {
      .hero {
        flex-direction: column;
      }
      .hero > div {
        width: 100%;
      }
      .hero .poster {
        overflow: hidden;
        width: 100%;
        height: 40vw;
      }
      .poster img {
        max-height: auto;
        width: 100%;
      }
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
  $stats = {
    kits: 0,
    teams: 0,
    competitions: 0,
  }

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

    getStats().then((stats) => {
      this.$stats = JSON.parse(stats['data']);
    })

    getTemplates().then((templates) => {
      for (let template in templates) {
        this.templates.push(templates[template])
      }
    })
   }
}

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KitComponent } from '@components/kit/kit.component';
import { getLatestKits, getTemplates } from '@api/loadData';
import sortByYear from '@services/sortByYear';
import sortByName from '@services/sortByName';
import { getLayers } from '@services/getLayers';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [KitComponent],
  template: `
    @if (loading) {
      <article aria-busy="true">Loading</article>
    }
    @else {
    <div class="years">
      <article>
        <header>
          <h3>Latest kits</h3>
        </header>
        <div class="kits">
          @for (kit of kits; track kit) {
            <a href="/team/{{kit['team']['slug']}}">
              <app-kit
                [layers]="kit"
                [templates]="templates"
                [label]="kit['team']['name'] + '|' + kit['year'] + '|' + kit['name']"
              ></app-kit>
            </a>
          }
        </div>
      </article>
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

export class HomeComponent {
  leagueId = '';
  kits = [];
  templates = [];
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
      })
    });

    getTemplates().then((templates) => {
      for (let template in templates) {
        this.templates.push(templates[template])
      }
    })
  }
}

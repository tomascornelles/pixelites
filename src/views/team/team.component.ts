import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KitComponent } from '@components/kit/kit.component';
import { getKits, getTemplates } from '@api/loadData';
import sortByName from '@services/sortByName';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [KitComponent],
  template: `
    @if (loading) {
      <article aria-busy="true">Loading</article>
    }
    @else {
    <h2>Team: {{ teamId.toUpperCase() }}</h2>
    <div class="years">
      @for (year of years; track year) {
        <article>
          <header>
            <h3>{{year}}</h3>
          </header>

          @for (kit of kits; track kit) {
            @if (kit['year'] === year) {
              <app-kit
                [layers]="kit"
                [templates]="templates"
                [label]="kit['name']"
              ></app-kit>
            }
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
      margin-block-end: 1em;
    }
    h3 {
      margin-block-end: 0;
    }
    @media only screen and (min-width: 768px) {
      .years {
        display: flex;
        flex-wrap: wrap;
        gap: 2em;
        justify-content: space-between;
      }
    }
  `,
})

export class TeamComponent {
  teamId = '';
  kits = [];
  templates = [];
  years = [];
  loading = true;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loading = true;
      this.teamId = params['id'];
      this.kits = [];
      this.years = [];
      getKits(this.teamId).then((kits) => {
        for (let kit in kits) {
          this.kits.push(kits[kit])
          if (!this.years.includes(kits[kit]['year'])) {
            this.years.push(kits[kit]['year'])
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

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { loadData, getTeams, getLeagues } from '@api/loadData';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav>
      <a [routerLink]="['/']">
        <h1 class="title">
          Pixelites
        </h1>
      </a>

      <ul>
        <li>
          <span
            class="menu-toggle"
            aria-label="Open"
            rel="next"
            (click)="toogleMenu()"
          >
            ☰
          </span>
        </li>
      </ul>
    </nav>

    <dialog
      [open]="isOpen"
      (keydown.esc)="toogleMenu()"
    >
      <article>
        <h3>
          Leagues
        </h3>
        @for ($league of $leagues; track $league.id) {
          <button
            [routerLink]="['/league', $league.slug]"
            (click)="toogleMenu()"
          >
            {{ $league.name }}
          </button>
        }

        <h3>
          Teams
        </h3>
        @for ($team of $teams; track $team.id) {
          <button
            [routerLink]="['/team', $team.slug]"
            (click)="toogleMenu()"
          >
            {{ $team.name }}
          </button>
        }

        <footer>
          <button (click)="toogleMenu()">
            Close
          </button>
        </footer>
      </article>
    </dialog>
  `,
  styles: `
  nav {
    margin-block-end: 3rem;
  }
  .title {
    font-size: 1.5rem;
    margin-block-start: 1rem;
  }
  .menu-toggle {
    font-size: 2.4rem;
    line-height: 1rem;
    cursor: pointer;
  }
  `,
})

export class NavigationComponent {
  $leagues;
  $teams;
  isOpen = false;

  ngOnInit() {
    getLeagues().then((leagues) => {
      this.$leagues = leagues;
    })
    getTeams().then((teams) => {
      this.$teams = teams;
    })
  }

  toogleMenu() {
    this.isOpen = !this.isOpen;
  }
}

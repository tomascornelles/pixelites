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
          (click)="toggleMenu()"
        >
          ☰
        </span>
      </li>
    </ul>
  </nav>

  <dialog
    [open]="isOpen"
    (keydown.esc)="toggleMenu()"
  >
    <article>
      <header>
        <a (click)="toggleMenu()" aria-label="Close" rel="prev"></a>
      </header>
      <h3>
        Leagues
      </h3>
        @for ($league of $leagues; track $league.id) {
          <button
            class="outline"
            [routerLink]="['/league', $league.slug]"
            (click)="toggleMenu()"
          >
            {{ $league.name }}
          </button>
        }

      <h3>
        Teams
      </h3>
      @for ($team of $teams; track $team.id) {
        <button
          class="outline"
          [routerLink]="['/team', $team.slug]"
          (click)="toggleMenu()"
        >
          {{ $team.name }}
        </button>
      }
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
  nav a {
    text-decoration: none;
  }
  nav h1 {
    font-size: 2rem;
  }
  header {
    height: 2.3rem;
  }
  article button {
    display: block;
    width: 100%;
    margin-block-end: .5rem;
    margin-inline-end: 0;
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

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }
}

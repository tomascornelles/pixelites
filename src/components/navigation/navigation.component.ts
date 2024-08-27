import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { getTeams, getLeagues } from '@api/loadData';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterModule, FormsModule],
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
          🔍
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
        <input
          placeholder="Search"
          [(ngModel)]="$search"
          name="search"
          autocomplete="off"
          (ngModelChange)="search($event)"
        >
      </header>

      <div class="list">
        @if ($filteredLeagues.length > 0) {
          <h3>
            Leagues
          </h3>
        }
        @for ($league of $filteredLeagues; track $league.id) {
          <button
            class="outline"
            [routerLink]="['/league', $league.slug]"
            (click)="toggleMenu()"
          >
            {{ $league.name }} ({{ $league.country }})
          </button>
        }

        @if ($filteredTeams.length > 0) {
          <h3>
            Teams
          </h3>
        }
        @for ($team of $filteredTeams; track $team.id) {
          <button
            class="outline"
            [routerLink]="['/team', $team.slug]"
            (click)="toggleMenu()"
          >
            {{ $team.name }}
          </button>
        }
      </div>
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
      min-height: 2.3rem;
      padding: 2rem 2rem 0;
    }
    header input {
      margin-block-start: 1rem;
    }
    dialog {
      align-items: flex-start;
    }
    dialog h3 {
      margin-block: 0;
    }
    article button {
      display: block;
      width: 100%;
      margin-block-end: .5rem;
      margin-inline-end: 0;
    }
    article {
      padding: 0;
      overflow-x: hidden;
    }
    .list {
      max-height: 70vh;
      overflow-y: auto;
      padding: 1rem;
    }
  `,
})

export class NavigationComponent {
  $leagues;
  $filteredLeagues = [];
  $teams;
  $filteredTeams = [];
  $search = '';
  isOpen = false;

  ngOnInit() {
    getLeagues().then((leagues) => {
      this.$leagues = leagues;
      this.$filteredLeagues = this.$leagues
    })
    getTeams().then((teams) => {
      this.$teams = teams;
      this.$filteredTeams = this.$teams
    })
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
    this.resetSearch();
    if (this.isOpen) {
      const input: HTMLInputElement = document.querySelector('input[name="search"]');
      if (input) {
        console.log('focus', input)
        setTimeout(() => input.focus(), 100);
      }
    }
  }

  resetSearch() {
    this.$search = '';
    this.$filteredLeagues = this.$leagues
    this.$filteredTeams = this.$teams
  }

  search($event) {
    if ($event === '') {
      this.$filteredLeagues = this.$leagues
      this.$filteredTeams = this.$teams
    } else {
      this.$filteredLeagues = this.$leagues.filter((league) => (league.name.toLowerCase().includes($event.toLowerCase()) || league.country.toLowerCase().includes($event.toLowerCase())))
      this.$filteredTeams = this.$teams.filter((team) => team.name.toLowerCase().includes($event.toLowerCase()))
    }
  }
}

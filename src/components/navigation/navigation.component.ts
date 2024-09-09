import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { getTeams, getLeagues, countKits, countTeams } from '@api/loadData';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterModule, FormsModule],
  template: `
  <nav
    (keydown.f)="toggleMenu()"
  >
    <a [routerLink]="['/']">
      <h1 class="title">
        Pixelites
      </h1>
    </a>

    <ul>
      <li>
        <span
          class="menu-toggle"
          rel="next"
          (click)="toggleMenu()"
        >
          <img src="search.svg" width="32" alt="Search" />
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
        <span class="close" (click)="toggleMenu()" aria-label="Close" rel="prev"></span>
        <input
          placeholder="Search"
          [(ngModel)]="$search"
          name="search"
          autocomplete="off"
          (ngModelChange)="search($event)"
          (keydown.enter)="selectFirstResult()"
        >
      </header>

      <div class="list">
        @if ($filteredLeagues.length > 0) {
          <h3>
            Leagues
          </h3>
        }
        @for ($league of $filteredLeagues; track $league.slug) {
          <button
            class="outline"
            [routerLink]="['/competition', $league.slug]"
            (click)="toggleMenu()"
          >
            {{ $league.name }}
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
      margin-block-start: 1rem;
      font-size: 2rem;
      background: linear-gradient(to bottom right, var(--pico-primary-hover-background) 0%, var(--pico-primary-hover) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .title small {
      display: block;
      font-size: .5em;
      font-weight: 400;
      color: #999;
    }
    .menu-toggle {
      font-size: 2.4rem;
      line-height: 1rem;
      cursor: pointer;
    }
    .close {
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
    article button:first-of-type {
      border: 5px solid currentColor;
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
  $countKits = 0;
  $countTeams = 0;

  ngOnInit() {
    getLeagues().then((leagues) => {
      this.$leagues = leagues;
      this.$filteredLeagues = this.$leagues
    })

    getTeams().then((teams) => {
      this.$teams = teams;
      this.$filteredTeams = this.$teams
    })

    countKits().then((count) => {
      this.$countKits = +count
    })

    countTeams().then((count) => {
      this.$countTeams = +count
    })
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
    this.resetSearch();
    if (this.isOpen) {
      const input: HTMLInputElement = document.querySelector('input[name="search"]');
      if (input) {
        setTimeout(() => input.focus(), 100);
      }
    }
  }

  resetSearch() {
    this.$search = '';
    this.$filteredLeagues = this.$leagues
    this.$filteredTeams = []
  }

  search($event) {
    if ($event === '') {
      this.$filteredLeagues = this.$leagues;;
      this.$filteredTeams = [];

    } else {
      this.$filteredLeagues = this.$leagues.filter((league) => (league.name.toLowerCase().includes($event.toLowerCase())))
      this.$filteredTeams = this.$teams.filter((team) => team.name.toLowerCase().includes($event.toLowerCase()))
    }
  }

  selectFirstResult() {
    const button: HTMLButtonElement = document.querySelector('button:first-of-type');
    button.click();
  }
}

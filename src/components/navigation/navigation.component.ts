import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { getAllKits } from '@api/loadData';
import { isLogged } from '@services/login';
import { getTeams } from '@api/getTeams';
import { getCompetitions } from '@api/getCompetitions';

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

    @if ($isLogged) {
      <button class="new-kit" [routerLink]="['/kit/new']"> + </button>
    }

    <dialog
    [open]="isOpen"
      (keydown.esc)="toggleMenu()"
      (keydown.arrowdown)="selectNextResult()"
      (keydown.arrowup)="selectPreviousResult()"
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
            (keydown.enter)="selectResult()"
          >
        </header>

        <div class="list">
          @if ($filteredLeagues.length > 0) {
            <h3>
              Leagues
            </h3>
          }
          @for ($league of $filteredLeagues; track $league) {
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
          @for ($team of $filteredTeams; track $team) {
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
      margin-block: 0 1em;
    }
    article button {
      display: block;
      width: 100%;
      margin-block-end: .5rem;
      margin-inline-end: 0;
      transition: all .3s;
    }
    article {
      padding: 0;
      overflow-x: hidden;
    }
    article button.selected {
      box-shadow: 5px 5px 0 0 var(--pico-primary);
      translate: -5px -5px;
    }
    article button:hover {
      background-color: var(--pico-primary-focus);
    }
    .list {
      max-height: 70vh;
      overflow-y: auto;
      padding: 1rem;
    }
    .new-kit {
      font-size: 3rem;
      line-height: 1;
      position: fixed;
      right: 0;
      bottom: 0;
      margin: 1rem;
      padding: .2em .4em;
      box-shadow: 5px 5px 0 0 var(--pico-primary);
    }
  `,
})

export class NavigationComponent {
  $leagues = [];
  $filteredLeagues = [];
  $teams = [];
  $filteredTeams = [];
  $search = '';
  isOpen = false;
  $countKits = 0;
  $countTeams = 0;
  $countLeagues = 0;
  $isLogged = isLogged();
  $selectedIndex = 0;

  ngOnInit() {
    getTeams().then((data) => {
      const dataParsed = this.parseData(JSON.parse(JSON.parse(JSON.stringify(data)).data));
      this.$teams = dataParsed;
      this.$filteredTeams = dataParsed;
      this.selectCurrentResult();
    })
    getCompetitions().then((data) => {
      const dataParsed = this.parseData(JSON.parse(JSON.parse(JSON.stringify(data)).data));
      this.$leagues = dataParsed;
      this.$filteredLeagues = dataParsed;
    })
  }

  parseData(data) {
    let parsedData = [];
    const local = [];
    const international = [];

    for (let league in data) {
      parsedData.push({
        name: data[league]['name'],
        slug: league,
        count: data[league]['count']
      })
    }

    parsedData = parsedData.sort((a, b) => {
      if (a['name'] < b['name']) {
        return -1
      }
      if (a['name'] > b['name']) {
        return 1
      }
      return 0
    });

    parsedData.forEach((league) => {
      if (!league['name'].includes('(')) {
        league['name'] = '🌐 ' + league['name'];
        international.push(league);
      } else {
        local.push(league);
      }
    })

    return [...international, ...local];
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
    this.$filteredTeams = [];
    this.$selectedIndex = 0;
    this.selectCurrentResult();
  }

  search($event) {
    if ($event === '') {
      this.$filteredLeagues = this.$leagues;;
      this.$filteredTeams = [];

    } else {
      this.$filteredLeagues = this.$leagues.filter((league) => (league.name.toLowerCase().includes($event.toLowerCase())))
      this.$filteredTeams = this.$teams.filter((team) => team.name.toLowerCase().includes($event.toLowerCase()))
    }

    this.$selectedIndex = 0;
    this.selectCurrentResult();
  }

  selectCurrentResult() {
    const buttons = document.querySelectorAll('dialog button');
    buttons.forEach((button) => {
      button.classList.remove('selected');
    })
    buttons[this.$selectedIndex].classList.add('selected');
  }

  selectResult() {
    const button: HTMLButtonElement = document.querySelector(`dialog button:nth-of-type(${this.$selectedIndex + 1})`);
    button.click();
  }

  selectNextResult() {
    const elements = document.querySelectorAll('dialog button');
    if (this.$selectedIndex < elements.length) {
      this.$selectedIndex++;
    }
    this.selectCurrentResult();
  }

  selectPreviousResult() {
    if (this.$selectedIndex > 0) {
      this.$selectedIndex--;
    }
    this.selectCurrentResult();
  }
}

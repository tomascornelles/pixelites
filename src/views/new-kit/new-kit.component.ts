import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { KitComponent } from '@components/kit/kit.component';
import { LoginComponent } from '@views/login/login.component';
import { isLogged } from '@services/login';
import { getTemplates, saveKit, getKit, updateKit, deleteKit } from '@api/loadData';
import { getCompetitions } from '@api/getCompetitions';
import { getTeams } from '@api/getTeams';
import { getStats } from '@api/getStats';
import { updateTeams } from '@api/updateTeams';
import { updateCompetitions } from '@api/updateCompetitions';
import { updateStats } from '@api/updateStats';
import { FormsModule } from '@angular/forms';

type Kit = {
  name: string
  teamSlug?: string
  team?: string
  competitionSlug?: string
  competition?: string
  year: number
  jersey: string
  pants: string
  socks: string
  layer1: string
  layer2: string
  layer3: string
  layer1Color: string
  layer2Color: string
  layer3Color: string
}

@Component({
  selector: 'app-new-kit',
  standalone: true,
  imports: [KitComponent, FormsModule, RouterModule, LoginComponent],
  template: `
    @if (!$isLoggedIn) {
      <app-login (loggedIn)="init()"></app-login>
    }
    @else if (loading) {
      <article aria-busy="true"></article>
    }
    @else {
      <article>
        <div class="kit-form">
          <canvas [attr.id]="canvasId" height="132"></canvas>
        </div>

        <div class="form">
          <div role="group">
            <label for="jersey">Jersey</label>
            <label for="pants">Pants</label>
            <label for="socks">Socks</label>
          </div>

          <div role="group">
            <input type="color" id="jersey" name="jersey" [(ngModel)]="kit['jersey']" (input)="setLayers()" list="colors">
            <input type="color" id="pants" name="Pants" [(ngModel)]="kit['pants']" (input)="setLayers()" list="colors">
            <input type="color" id="socks" name="Socks" [(ngModel)]="kit['socks']" (input)="setLayers()" list="colors">
            <datalist id="colors">
              @for (color of config.colors; track color) {
                <option>{{ color }}</option>
              }
            </datalist>
          </div>

         <div role="group">
            <label for="layer1">Layer 1</label>
            <label for="layer2">Layer 2</label>
            <label for="layer3">Layer 3</label>
          </div>

          <div role="group">
            <select name="layer1" id="layer1" [(ngModel)]="kit['layer1']" (change)="setLayers()">
              <option value=""></option>
              @for (template of config.templates; track template) {
                @if (template['type'] === 'layer') {
                  <option value="{{ template['id'] }}">{{ template['id'] }}</option>
                }
              }
            </select>
            <select name="layer2" id="layer2" [(ngModel)]="kit['layer2']" (change)="setLayers()">
              <option value=""></option>
              @for (template of config.templates; track template) {
                @if (template['type'] === 'layer') {
                  <option value="{{ template['id'] }}">{{ template['id'] }}</option>
                }
              }
            </select>
            <select name="layer3" id="layer3" [(ngModel)]="kit['layer3']" (change)="setLayers()">
              <option value=""></option>
              @for (template of config.templates; track template) {
                @if (template['type'] === 'layer') {
                  <option value="{{ template['id'] }}">{{ template['id'] }}</option>
                }
              }
            </select>
          </div>

          <div role="group">
            <input type="color" id="layer1Color" name="layer1Color" [(ngModel)]="kit['layer1Color']" (input)="setLayers()" list="colors">
            <input type="color" id="layer2Color" name="layer2Color" [(ngModel)]="kit['layer2Color']" (input)="setLayers()" list="colors">
            <input type="color" id="layer3Color" name="layer3Color" [(ngModel)]="kit['layer3Color']" (input)="setLayers()" list="colors">
          </div>

          <div role="group">
            <input type="text" id="team" name="team" [(ngModel)]="kit['team']" list="teams" placeholder="Team" autocomplete="off">
            <datalist id="teams">
              @for (team of $teams; track team) {
                <option value="{{ team.name }}"></option>
              }
            </datalist>

            <input type="text" id="competition" name="competition" [(ngModel)]="kit['competition']" list="competitions" placeholder="Competition" autocomplete="off">
            <datalist id="competitions">
              @for (competition of $competitions; track competition) {
                <option value="{{ competition.name }}"></option>
              }
            </datalist>
          </div>
        </div>

        <div role="group">
          <select id="name" name="name" [(ngModel)]="kit['name']">
            <option value="Home">Home</option>
            <option value="Home alt">Home alt</option>
            <option value="Away">Away</option>
            <option value="Third">Third</option>
            <option value="Fourth">Fourth</option>
            <option value="Special">Special</option>
          </select>
          <input type="number" id="year" name="year" [(ngModel)]="kit['year']">
        </div>

        <footer>
          <button type="button" (click)="save()">save</button>
          <div role="group">
            @if (this.$id) {
              <a [routerLink]="['/kit/new']" role="button" class="outline">
                new
              </a>
              <button type="button" (click)="duplicate()" class="outline">copy</button>
              <button type="button" (click)="wantDelete = !wantDelete" class="outline">delete</button>
            }

          </div>
            @if ($id) {
              <a [routerLink]="['/team', kit['teamSlug']]" role="button" class="outline">
                go to team
              </a>
            }
        </footer>
        </article>
    }

    <dialog
    [open]="wantDelete"
    >
      <article>
        <header>
          <h1>Want to delete?</h1>
        </header>
        <div>
          <p>Are you sure you want to delete this kit?</p>
        </div>
        <footer>
          <div role="group">
            <button type="button" (click)="wantDelete = !wantDelete">Cancel</button>
            <button type="button" (click)="delete()" class="secondary">Delete</button>
          </div>
        </footer>
      </article>
    </dialog>
  `,
  styles: `
    .kit-form {
      display: flex;
      justify-content: center;
    }

    button {
      display: block;
      width: 100%;
      flex-grow: 1;
    }

    footer button,
    footer [role="button"] {
      width: 100%;
      padding-inline: 0;
    }
  `,
})

export class NewKitComponent {
  kitInit: Kit = {
    'name': 'Home',
    'year': new Date().getFullYear(),
    'jersey': '#FFFFFF',
    'pants': '#FFFFFF',
    'socks': '#FFFFFF',
    'layer1': '',
    'layer2': '',
    'layer3': '',
    'layer1Color': '#FFFFFF',
    'layer2Color': '#FFFFFF',
    'layer3Color': '#FFFFFF',
  };
  kit = {...this.kitInit};
  templates = [];
  canvasId = Math.random().toString(36).substring(2, 15);
  config = {
    size: 16,
    baseColors: [
      '',
      ['navajoWhite', 'navajoWhite', 'navajoWhite', 'peru', 'peru', 'saddleBrown'],
      ['goldenRod', 'sienna', '#333', '#333', 'saddleBrown', '#333']
    ],
    colors: [
      '#FFFFFF', '#000000', '#FF0000', '#0000FF', '#008000',
      '#FA8072', '#DC143C', '#B22222', '#FFC0CB', '#800000',
      '#FFFF00', '#FFD700', '#FFA500', '#FF8C00', '#FF6347',
      '#90EE90', '#ADFF2F', '#9ACD32', '#2E8B57', '#006400',
      '#ADD8E6', '#87CEFA', '#4169E1', '#0000CD', '#000080',
      '#BA55D3', '#663399', '#4B0082', '#333366', '#696969',
    ],
    templates: [],
  };
  templateColor = Math.floor(Math.random() * 6);
  templateBase = Math.ceil(Math.random() * 4);
  $teams = [];
  $initTeams = {};
  $initTeam = null;
  $competitions = [];
  $initCompetition = null;
  $initCompetitions = {};
  $stats = {};
  $id = null;
  loading = true;
  wantDelete = false;
  $isLoggedIn = false;

  constructor(private route: ActivatedRoute, public router: Router) { }

  ngOnInit() {
    this.init();
  }

  public init() {
    if (isLogged()) {
      this.$isLoggedIn = true;

      getTeams().then((teams) => {
        this.$initTeams = JSON.parse(teams['data']);
        for (let team in JSON.parse(teams['data'])) {
          this.$teams.push(JSON.parse(teams['data'])[team]);
        }
      });

      getCompetitions().then((competitions) => {
        this.$initCompetitions = JSON.parse(competitions['data']);
        for (let competition in JSON.parse(competitions['data'])) {
          this.$competitions.push(JSON.parse(competitions['data'])[competition]);
        }
      });

      getStats().then((stats) => {
        this.$stats = JSON.parse(stats['data']);
      })

      getTemplates().then((templates) => {
        for (let template in templates) {
          this.config.templates.push(templates[template]);
        }

        this.route.params.subscribe((params) => {
          this.$id = params['id'];
          if (this.$id) {
            getKit(this.$id).then((kit) => {
              this.kit = kit;
              this.$initTeam = this.kit['teamSlug'];
              this.$initCompetition = this.kit['competitionSlug'];
              this.loading = false;
              this.setLayers();
            })
          } else {
            this.initKit();
            this.loading = false;
            this.setLayers();
          }
        });
      });
    }
  }

  private initKit() {
    for (let key in this.kitInit) {
      this.kit[key] = this.kitInit[key];
    }
  }

  public setLayers() {
    setTimeout(() => {
      this.print(this.kit);
    }, 100);
  }

  private print(kit) {
    const {
      size,
    } = this.config;
    const canvas = document.getElementById(this.canvasId);

    canvas['width']= 8 * size;
    canvas['height'] = 8 * size + 4;
    const ctx = canvas["getContext"]("2d");
    setTimeout(() => {
      this.draw(ctx, kit.baseColors)
      this.checkDraw(size, kit);
    }, 200)
  }

  private draw(ctx, colors) {
    this.drawBorder(ctx, `base${this.templateBase}`);
    this.drawPixels(ctx, `base${this.templateBase}`, colors);
    this.drawPixels(ctx, 'jersey', this.kit['jersey']);
    this.drawPixels(ctx, 'pants', this.kit['pants']);
    this.drawPixels(ctx, 'socks', this.kit['socks']);

    if (this.kit['layer1']) {
      this.drawPixels(ctx, this.kit['layer1'], this.kit['layer1Color']);
    }
    if (this.kit['layer2']) {
      this.drawPixels(ctx, this.kit['layer2'], this.kit['layer2Color']);
    }
    if (this.kit['layer3']) {
      this.drawPixels(ctx, this.kit['layer3'], this.kit['layer3Color']);
    }
  }

  private drawBorder(ctx,template) {
    const {
      templates,
      size,
    } = this.config;
    let currentTemplate = [];

    for (let index in templates) {
      if (templates[index].id === template) {
        const initialTemplate = templates[index].template;
        currentTemplate = this.parseArray(initialTemplate);
      }
    }

    for (let y = 0; y < currentTemplate.length; y++) {
      for (let x = 0; x < currentTemplate[y].length; x++) {
        const color = currentTemplate[y][x] === '0'
          ? ''
          : 'whitesmoke';

          if (color) {
            ctx.fillStyle = color;
            ctx.fillRect(size * x, size * y, size +4, size +4);
          }
      }
    }

    for (let y = 0; y < currentTemplate.length; y++) {
      for (let x = 0; x < currentTemplate[y].length; x++) {
        const color = currentTemplate[y][x] === '0'
          ? ''
          : 'black';

          if (color) {
            ctx.fillStyle = color;
            ctx.fillRect(size * x +1, size * y +1, size +2, size +2);
          }
      }
    }
  }

  private drawPixels(ctx, template, customColors) {
    const {
      templates,
      baseColors,
      size,
    } = this.config;
    let currentTemplate = [];

    for (let index in templates) {
      if (templates[index].id === template) {
        const initialTemplate = templates[index].template;
        currentTemplate = this.parseArray(initialTemplate);
      }
    }

    for (let y = 0; y < currentTemplate.length; y++) {
      for (let x = 0; x < currentTemplate[y].length; x++) {
        const color = template.indexOf('base') === 0
          ? baseColors[currentTemplate[y][x]][this.templateColor]
          : currentTemplate[y][x] === '0'
            ? ''
            : currentTemplate[y][x] === '0.5'
              ? customColors + '99'
              : customColors;

        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(size * x +2, size * y +2, size, size);

          if (template === 'pants') {
            ctx.fillStyle = '#00000011';
            ctx.fillRect(size * x +2, size * y +2, size, size);
          }
        }
      }
    }
  }

  private parseArray(array) {
    const rows = array.split('\n');
    const columns = rows.map(row => row.split(','));

    return columns;
  }

  private checkDraw(size, kit) {
    const canvas = document.getElementById(this.canvasId);
    const ctx = canvas["getContext"]("2d");
    const colors = ctx.getImageData(size * 4, size * 4, 1, 1).data;

    if (colors[3] === 0) {
      this.print(kit);
    }
  }

  private checkNewCompetition(competition) {
    const filtered = this.$competitions.filter((item) => item.slug === competition);
    return filtered.length === 0;
  }

  private checkTeamsList() {
    if (this.kit['teamSlug']) {
      if (!this.$initTeams[this.kit['teamSlug']]) {
        console.log('new team')
        this.$initTeams[this.kit['teamSlug']] = {
          name: this.kit['team'],
          count: 1,
        };
      } else {
        console.log('increase team count')
        this.$initTeams[this.kit['teamSlug']]['count'] = this.$initTeams[this.kit['teamSlug']]['count'] + 1;
      }
    }

    if (this.$initTeams[this.$initTeam] && this.kit['teamSlug'] !== this.$initTeam) {
      if (this.$initTeams[this.$initTeam]['count'] > 1) {
        console.log('decrease team count')
        this.$initTeams[this.$initTeam]['count'] = this.$initTeams[this.$initTeam]['count'] - 1;
      } else {
        console.log('delete team')
        delete this.$initTeams[this.$initTeam];
      }
    }

    updateTeams(this.$initTeams);
    this.$initTeam = this.kit['teamSlug'];
  }

  private checkCompetitionsList() {
    if (this.kit['competitionSlug']) {
      if (!this.$initCompetitions[this.kit['competitionSlug']]) {
        this.$initCompetitions[this.kit['competitionSlug']] = {
          name: this.kit['competition'],
          count: 1,
        };
      } else {
        this.$initCompetitions[this.kit['competitionSlug']]['count'] = this.$initCompetitions[this.kit['competitionSlug']]['count'] + 1;
      }
    }

    if (this.$initCompetitions[this.$initCompetition] && this.kit['competitionSlug'] !== this.$initCompetitions) {
      if (this.$initCompetitions[this.$initCompetition]['count'] > 1) {
        this.$initCompetitions[this.$initCompetition]['count'] = this.$initCompetitions[this.$initCompetition]['count'] - 1;
      } else {
        delete this.$initCompetitions[this.$initCompetition];
      }
    }

    updateCompetitions(this.$initCompetitions);
    this.$initCompetition = this.kit['competitionSlug'];

  }

  private checkStatsList(action = 'none') {
    const kits = this.$id ? this.$stats['kits'] : this.$stats['kits'] + 1;
    updateStats({
      teams: Object.keys(this.$initTeams).length,
      competitions: Object.keys(this.$initCompetitions).length,
      kits: action === 'delete' ? kits - 1 : action === 'add' ? kits + 1 : kits,
    })

  }

  public save() {
    this.loading = true;
    this.setTeam(this.kit['team'].trim());
    this.setCompetition(this.kit['competition'].trim());

    this.checkTeamsList();
    this.checkCompetitionsList();
    this.checkStatsList();

    if (this.$id) {
      updateKit(this.kit).then(() => {
        this.loading = false;
        this.setLayers();
      });
    } else {
      saveKit(this.kit).then((data) => {
        this.loading = false;
        this.initKit();
        this.setLayers();
        this.router.navigate(['/kit/update', data[0].id]);
      });
    }
  }

  private setTeam(team) {
    this.kit.teamSlug = this.textToSlug(team);
    this.kit.team = team;
  }

  private setCompetition(competition) {
    this.kit.competitionSlug = this.textToSlug(competition);
    this.kit.competition = competition;
  }

  private textToSlug(text) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
  }

  public delete() {
    this.loading = true;
    this.kit['teamSlug'] = null;
    this.checkTeamsList();

    this.kit['competitionSlug'] = null;
    this.checkCompetitionsList();

    this.checkStatsList('delete');

    deleteKit(this.$id).then(() => {
      this.loading = false;
      this.router.navigate(['/kit/new']);
    });
  }

  public duplicate() {
    this.setTeam(this.kit['team']);
    this.setCompetition(this.kit['competition']);
    const kit = {
      teamSlug: this.kit.teamSlug,
      team: this.kit.team,
      competitionSlug: this.kit.competitionSlug,
      competition: this.kit.competition,
      name: this.kit.name,
      year: this.kit.year,
      jersey: this.kit.jersey,
      pants: this.kit.pants,
      socks: this.kit.socks,
      layer1: this.kit.layer1,
      layer2: this.kit.layer2,
      layer3: this.kit.layer3,
      layer1Color: this.kit.layer1Color,
      layer2Color: this.kit.layer2Color,
      layer3Color: this.kit.layer3Color
    };
    this.loading = true;
    this.kit = kit;
    this.$initTeam = this.kit['teamSlug'];

    this.checkTeamsList();
    this.checkCompetitionsList();
    this.checkStatsList('add');

    saveKit(kit).then((data) => {
      this.loading = false;
      this.initKit();
      this.setLayers();
      this.router.navigate(['/kit/update', data[0].id]);
    });
  }
}

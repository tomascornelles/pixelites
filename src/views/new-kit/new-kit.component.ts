import { Component } from '@angular/core';
import { KitComponent } from '@components/kit/kit.component';
import { getKits, getTemplates } from '@api/loadData';
import { FormsModule } from '@angular/forms';

type Kit = {
  name: string
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
  imports: [KitComponent, FormsModule],
  template: `
    <div class="kit-form">
      <canvas [attr.id]="canvasId" height="260"></canvas>
    </div>

    <div class="form">
      <div role="group">
        <label for="jersey">Jersey</label>
        <label for="pants">Pants</label>
        <label for="socks">Socks</label>
      </div>

      <div role="group">
        <input type="color" id="jersey" name="jersey" [(ngModel)]="kit['jersey']" (input)="setLayers()">
        <input type="color" id="pants" name="Pants" [(ngModel)]="kit['pants']" (input)="setLayers()">
        <input type="color" id="socks" name="Socks" [(ngModel)]="kit['socks']" (input)="setLayers()">
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
        <input type="color" id="layer1Color" name="layer1Color" [(ngModel)]="kit['layer1Color']" (input)="setLayers()">
        <input type="color" id="layer2Color" name="layer2Color" [(ngModel)]="kit['layer2Color']" (input)="setLayers()">
        <input type="color" id="layer3Color" name="layer3Color" [(ngModel)]="kit['layer3Color']" (input)="setLayers()">
      </div>
    </div>
  `,
  styles: `
    .kit-form {
      display: flex;
      justify-content: center;
    }
  `,
})
export class NewKitComponent {
  kit: Kit = {
    'name': '',
    'year': null,
    'jersey': '',
    'pants': '',
    'socks': '',
    'layer1': '',
    'layer2': '',
    'layer3': '',
    'layer1Color': '',
    'layer2Color': '',
    'layer3Color': '',
  };
  templates = [];
  canvasId = Math.random().toString(36).substring(2, 15);
  config = {
    size: 32,
    colors: [
      '',
      ['navajoWhite', 'navajoWhite', 'navajoWhite', 'peru', 'peru', 'saddleBrown'],
      ['goldenRod', 'sienna', '#333', '#333', 'saddleBrown', '#333']
    ],
    templates: [],
  };
  templateColor = Math.floor(Math.random() * 6);
  templateBase = Math.ceil(Math.random() * 4);

  ngOnInit() {
    getTemplates().then((templates) => {
      for (let template in templates) {
        this.config.templates.push(templates[template]);
      }
      this.setLayers();
    });
  }

  public setLayers() {
    this.kit['name'] = 'Test';
    this.kit['year'] = 2024;
    this.print(this.kit)
  }

  private print(kit) {
    const {
      size,
    } = this.config;
    const canvas = document.getElementById(this.canvasId);

    canvas['width']= 8 * size;
    canvas['height'] = 8 * size + 4;
    const ctx = canvas["getContext"]("2d");
    this.draw(ctx, kit.colors)
    setTimeout(() => this.checkDraw(size, kit),500);
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
      colors,
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
          ? colors[currentTemplate[y][x]][this.templateColor]
          : currentTemplate[y][x] === '0'
            ? ''
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
}

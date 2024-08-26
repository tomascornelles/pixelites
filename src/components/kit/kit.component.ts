import {ThisReceiver} from '@angular/compiler';
import { Component, Input } from '@angular/core';

type Kit = {
  name: string
  year: number
  jersey: string
  pants: string
  socks: string
  layer1: [string, string]
  layer2: [string, string]
  layer3: [string, string]
}

@Component({
  selector: 'app-kit',
  standalone: true,
  imports: [],
  template: `
  <div>
    <canvas [attr.id]="canvasId"></canvas>
    <p class="label" [innerHTML]="label"></p>
  </div>
  `,
  styles: `
    div {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 7rem;
    }
    .label {
      text-align: center;
    }
    p {
      line-height: 1rem;
    }
  `,
})

export class KitComponent {
  @Input() layers: Kit;
  @Input() templates: Kit[];
  @Input() label: String;
  canvasId = Math.random().toString(36).substring(2, 15);
  config = {
    size: 8,
    colors: [
      '',
      ['navajoWhite', 'navajoWhite', 'navajoWhite', 'peru', 'peru', 'saddleBrown'],
      ['goldenRod', 'sienna', 'black', 'black', 'saddleBrown', '#333']
    ],
    templates: null,
  };
  templateColor = Math.floor(Math.random() * 6);
  templateBase = Math.ceil(Math.random() * 4)

  ngOnInit() {
    this.config.templates = this.templates;
    this.label = this.label.split('|').join('<br>');
  }

  ngAfterViewInit() {
    this.print(this.config.templates);
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
  }

  private draw(ctx, colors) {
    this.drawBorder(ctx, `base${this.templateBase}`);
    this.drawPixels(ctx, `base${this.templateBase}`, colors);
    this.drawPixels(ctx, 'jersey', this.layers['jersey']);
    this.drawPixels(ctx, 'pants', this.layers['pants']);
    this.drawPixels(ctx, 'socks', this.layers['socks']);

    if (this.layers['layer1']) {
      this.drawPixels(ctx, this.layers['layer1'], this.layers['layer1Color']);
    }

    // if (colors['layers']) {
    //   for (let i = 0; i < colors['layers'].length; i++) {
    //     this.drawPixels(ctx, colors['layers'][i][0], colors['layers'][i][1]);
    //   }
    // }
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
    console.log('template, customColors', template, customColors)

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
}

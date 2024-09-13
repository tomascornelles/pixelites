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
  teamSlug: string
  competitionSlug: string
}

@Component({
  selector: 'app-kit',
  standalone: true,
  imports: [],
  template: `
  <div (click)="wantDownload = !wantDownload" title="Download kit image" class="kit">
    <canvas [attr.id]="canvasId" name="canvasPepe"></canvas>
    <p class="label" [innerHTML]="label"></p>
  </div>

  <dialog
  [open]="wantDownload"
  >
    <article>
      <header>
        <h1>Download</h1>
      </header>
      <div>
        <p>Do you want to download this kit?</p>
      </div>
      <footer>
        <div role="group">
          <button type="button" (click)="wantDownload = !wantDownload">Cancel</button>
          <button type="button" (click)="download()" class="secondary">Download</button>
        </div>
      </footer>
    </article>
  </dialog>
  `,
  styles: `
    .kit {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 6rem;
      cursor: pointer;
      width: 100px;
    }
    .kit canvas {
      width: 100%;
    }
    .label {
      text-align: center;
    }
    p {
      line-height: 1rem;
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

export class KitComponent {
  @Input() layers: Kit;
  @Input() templates: Kit[];
  @Input() label: String;
  @Input() canDownload: boolean = false;
  canvasId = Math.random().toString(36).substring(2, 15);
  config = {
    size: 16,
    colors: [
      '',
      ['navajoWhite', 'navajoWhite', 'navajoWhite', 'peru', 'peru', 'saddleBrown'],
      ['goldenRod', 'sienna', '#333', '#333', 'saddleBrown', '#333']
    ],
    templates: null,
  };
  templateColor = Math.floor(Math.random() * 6);
  templateBase = Math.ceil(Math.random() * 4);
  count = 0;
  wantDownload = false;

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

    canvas['width']= 12 * size;
    canvas['height'] = 12 * size + 4;
    const ctx = canvas["getContext"]("2d");
    this.draw(ctx, kit.colors)
    setTimeout(() => this.checkDraw(size, kit),500);
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
    if (this.layers['layer2']) {
      this.drawPixels(ctx, this.layers['layer2'], this.layers['layer2Color']);
    }
    if (this.layers['layer3']) {
      this.drawPixels(ctx, this.layers['layer3'], this.layers['layer3Color']);
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
            ctx.fillRect(size * (x+2), size * (y+2), size +8, size +8);
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
            ctx.fillRect(size * (x+2) +2, size * (y+2) +2, size +4, size +4);
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
            : currentTemplate[y][x] === '0.5'
              ? customColors + '99'
              : customColors;

        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(size * (x+2) +4, size * (y+2) +4, size, size);

          if (template === 'pants') {
            ctx.fillStyle = '#00000011';
            ctx.fillRect(size * (x+2) +4, size * (y+2) +4, size, size);
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

  public download() {
    if (this.canDownload) {
      const link = document.createElement('a');
      const canvas = document.getElementById(this.canvasId) as HTMLCanvasElement;
      link.download = `${this.layers.year}_${this.layers.teamSlug}_${this.layers.competitionSlug}_${this.layers.name.toLowerCase()}.png`;
      link.href = canvas.toDataURL();
      link.click();
      this.wantDownload = false;
    }
  }
}

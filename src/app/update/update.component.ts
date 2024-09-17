import { Component } from '@angular/core';
import { supabase } from '@api/supabase';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [],
  template: `
    @if (complete) {
    <p>update works!</p>
    }
    @else {
    <p>Updating ... {{ percentage }}%</p>
    <progress max="100" value="{{ percentage }}"></progress>
    <p>{{ current }} / {{ total }}</p>
    }
  `,
  styleUrl: './update.component.scss'
})
export class UpdateComponent {
  allKits: any;
  complete: boolean = false;
  total: number = 0;
  current: number = 0;
  percentage: number = 0;

  ngOnInit() {
    this.getKits().then((data) => {
      this.allKits = data;
      this.total = Object.keys(this.allKits).length;

      for (let kit in this.allKits) {
        this.current += 1;
        this.percentage = Math.round(this.current / this.total * 100);
        this.allKits[kit]['competitionSlug'] = this.textToSlug(this.allKits[kit]['competition']);
        this.updateKit(this.allKits[kit]);
      }

      this.complete = true;
    });
  }

  private getKits = async () => {
    const { data, error } = await supabase
    .from('kits')
    .select('*')
    // .gte('id', 300)
    // .lt('id', 400)

    return data || error;
  }

  private updateKit = async (kit) => {
    const { data, error } = await supabase
    .from('kits')
    .update(kit)
    .eq('id', kit.id);
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
}

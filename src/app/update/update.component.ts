import { Component } from '@angular/core';
import { supabase } from '@api/supabase';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [],
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss'
})
export class UpdateComponent {
  allKits: any;

  ngOnInit() {
    this.getKits().then((data) => {
      this.allKits = data;

      for (let kit in this.allKits) {
        this.allKits[kit]['competitionSlug'] = this.textToSlug(this.allKits[kit]['competition']);
        this.updateKit(this.allKits[kit]);
      }
    });
  }

  private getKits = async () => {
    const { data, error } = await supabase
    .from('kits')
    .select('*')
    .gte('id', 300)
    .lt('id', 400)

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

import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { NavigationComponent } from '@components/navigation/navigation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, NavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pixelites';
}

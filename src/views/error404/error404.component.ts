import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-error404',
  standalone: true,
  imports: [RouterModule],
  template: `<article>
    <header>
      <h2>Error 404</h2>
    </header>
    <p class="errorGif"><img src="404.gif" alt="404"></p>
    <p class="errorText">Sorry, we couldn't find what you were looking for.</p>
    <p class="errorText"><a [routerLink]="['/']" role="button">Run to the home page</a></p>
  </article>`,
  styles: `
  h2 {
    margin-block: 0;
  }
  .errorGif, .errorText {
    text-align: center;
  }
  `,
})
export class Error404Component {

}

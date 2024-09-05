import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { login } from '@api/loadData';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <article id="login">
      <header>
        <h1>Login</h1>
      </header>
      <input type="text" [(ngModel)]="$user" placeholder="email">
      <input type="password" [(ngModel)]="$password" placeholder="password">
      <button type="button" (click)="login()">Login</button>
    </article>
    `,
})
export class LoginComponent {
  $user = '';
  $password = '';
  @Output() loggedIn: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router) { }

  public login() {
    login(this.$user, this.$password).then((data) => {
      console.log('data', data[0]);
      if (typeof data[0] === 'undefined' || !data[0]) {
        console.log('no data');
        this.router.navigate(['/']);
      } else {
        window.sessionStorage.setItem('user', JSON.stringify(data[0]));
        this.loggedIn.emit(data[0]);
      }
    });
  }
}

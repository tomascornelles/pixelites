import { Routes } from '@angular/router';
import { HomeComponent } from '@views/home/home.component';
import { LeagueComponent } from '@views/league/league.component';
import { TeamComponent } from '@views/team/team.component';
import { NewKitComponent } from '@views/new-kit/new-kit.component';
import { LoginComponent } from '@views/login/login.component';
import { Error404Component } from '@views/error404/error404.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'competition/:id',
    component: LeagueComponent,
  },
  {
    path: 'team/:id',
    component: TeamComponent,
  },
  {
    path: 'kit/new',
    component: NewKitComponent,
  },
  {
    path: 'kit/update/:id',
    component: NewKitComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '404',
    component: Error404Component,
  },
  {
    path: '**',
    redirectTo: '404',
  },
];

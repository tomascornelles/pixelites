import { Routes } from '@angular/router';
import { HomeComponent } from '@views/home/home.component';
import { LeagueComponent } from '@views/league/league.component';
import { TeamComponent } from '@views/team/team.component';
import { NewKitComponent } from '@views/new-kit/new-kit.component';
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
    path: 'new-kit',
    component: NewKitComponent,
  },
  {
    path: 'update-kit/:id',
    component: NewKitComponent,
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

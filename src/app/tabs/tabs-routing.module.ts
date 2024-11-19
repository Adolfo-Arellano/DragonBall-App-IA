import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'auth',
        loadChildren: () => import('../auth/auth.module').then(m => m.AuthPageModule)
      },
      {
        path: 'characters',
        loadChildren: () => import('../characters/characters.module').then(m => m.CharactersPageModule)
      },
      {
        path: 'planets',
        loadChildren: () => import('../planets/planets.module').then(m => m.PlanetsPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then(m => m.SettingsPageModule)
      },
      {
        path: 'stories',
        loadChildren: () => import('../stories/stories.module').then(m => m.StoriesPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/auth',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/auth',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}

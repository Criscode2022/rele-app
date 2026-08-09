import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { LoginPage } from './pages/login/login.page';
import { ReadingsPage } from './pages/readings/readings.page';
import { ReadingNewPage } from './pages/reading-new/reading-new.page';
import { ReadingDetailPage } from './pages/reading-detail/reading-detail.page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'login', component: LoginPage },
  { path: 'lecturas', component: ReadingsPage },
  { path: 'lecturas/nueva', component: ReadingNewPage },
  { path: 'lecturas/:id', component: ReadingDetailPage },
  { path: '**', redirectTo: '' },
];

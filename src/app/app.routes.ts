import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'analyze', loadComponent: () => import('./pages/analyze/analyze.component').then(m => m.AnalyzeComponent) },
  { path: 'compare', loadComponent: () => import('./pages/compare/compare.component').then(m => m.CompareComponent) },
  { path: 'about', loadComponent: () => import('./pages/about/about-page.component').then(m => m.AboutPageComponent) },
  { path: '**', redirectTo: '' }
];

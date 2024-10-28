import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // Importa AuthGuard

const routes: Routes = [
  // Redirigir a 'login' si el path es vacío
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Ruta para la página de login
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },

  // Ruta para la página de registro
  { path: 'registro', loadChildren: () => import('./registro/registro.module').then(m => m.RegistroPageModule) },
  
  // Ruta protegida para la página de inicio (home), usando AuthGuard
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule), canActivate: [AuthGuard] },

  // Ruta protegida para la página de películas, usando AuthGuard
  { path: 'peliculas', loadChildren: () => import('./peliculas/peliculas.module').then(m => m.PeliculasPageModule), canActivate: [AuthGuard] },

  // Ruta para restablecer contraseña (no protegida)
  { path: 'reset-password', loadChildren: () => import('./reset-password/reset-password.module').then(m => m.ResetPasswordPageModule) },
  
  // Ruta protegida para la página de favoritos, usando AuthGuard
  { path: 'favoritos', loadChildren: () => import('./favoritos/favoritos.module').then(m => m.FavoritosPageModule), canActivate: [AuthGuard] },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilPageModule), canActivate: [AuthGuard] 
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

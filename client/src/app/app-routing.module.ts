import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authenticationGuard } from './guards/authentication.guard';

const routes: Routes = [
  // This route will redirect the user to the authentication page.
  { path: '', component: AuthenticationComponent },
  // This route will load the dashboard module.
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authenticationGuard]
   },
   // This route will redirect all other requests to the authentication page.
   { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

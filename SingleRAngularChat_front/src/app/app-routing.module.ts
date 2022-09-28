import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { 
    path: '', redirectTo: 'auth', pathMatch: 'full' 
  },
  { 
    path: 'auth', component: AuthComponent 
  },
  {
    path: 'register', component: RegisterComponent
  },
  {     
    path: 'home', component: HomeComponent 
  },
  { 
    path: '**', redirectTo: 'auth', pathMatch: 'full'
   }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
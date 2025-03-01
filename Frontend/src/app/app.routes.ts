//app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LoginCompanyComponent } from './components/login-compagny/login-compagny.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { AuthGuard } from './guards/auth.guard';


export const routes: Routes = [

    {
        path:'',
        redirectTo:'login',
        pathMatch:'full'
    },
    {
        path : 'login',
        component : LoginComponent
    },
    { 
        path: 'login-company', 
        component: LoginCompanyComponent 
    },  

    { 
        path: 'dashboard',
        component: DashboardComponent, 
        canActivate: [AuthGuard] 
    }

];

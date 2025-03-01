//app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LoginCompanyComponent } from './components/login-company/login-company.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SuperAdminDashboardComponent } from './components/super-admin-dashboard/super-admin-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { EmployeeDashboardComponent } from './components/employee-dashboard/employee-dashboard.component';
import { InternDashboardComponent } from './components/intern-dashboard/intern-dashboard.component';

import { AuthGuard } from './guards/auth.guards';


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
    },
    { 
        path: 'superadmin-dashboard', 
        component: SuperAdminDashboardComponent
    },
    {
        path: 'admin-dashboard', 
        component: AdminDashboardComponent 
    },
    { 
        path: 'employee-dashboard', 
        component: EmployeeDashboardComponent 
    },
    { 
        path: 'intern-dashboard', 
        component: InternDashboardComponent 
    }

];

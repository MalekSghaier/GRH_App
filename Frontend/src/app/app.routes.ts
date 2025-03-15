//app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LoginCompanyComponent } from './components/login-company/login-company.component';
import { SuperAdminDashboardComponent } from './components/super-admin-dashboard/super-admin-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { EmployeeDashboardComponent } from './components/employee-dashboard/employee-dashboard.component';
import { InternDashboardComponent } from './components/intern-dashboard/intern-dashboard.component';
import { CompagniesComponent } from './compagnies/compagnies.component';
import { ProfilComponent } from './profil/profil.component';
import { AddCompanyComponent } from './add-company/add-company.component';
import { EditCompanyComponent } from './edit-company/edit-company.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AddUserFormComponent } from './add-user-form/add-user-form.component';

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
    },
    { 
        path: 'compagnies', 
        component: CompagniesComponent 
    },
    {
        path: 'profil', 
        component: ProfilComponent 
    },
    {
        path :'add-company',
        component : AddCompanyComponent
    },
    { 
        path: 'edit-company/:id', 
        component: EditCompanyComponent 
    },
    { 
        path: 'edit-profile', 
        component: EditProfileComponent 
    },
    { 
        path: 'change-password', 
        component: ChangePasswordComponent 
    },
    { 
        path: 'add-user', 
        component: AddUserFormComponent 
    },





];

//app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LoginCompanyComponent } from './components/login-company/login-company.component';
import { SuperAdminDashboardComponent } from './components/super-admin-dashboard/super-admin-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { EmployeeDashboardComponent } from './components/employee-dashboard/employee-dashboard.component';
import { InternDashboardComponent } from './components/intern-dashboard/intern-dashboard.component';
import { CompagniesComponent } from './components/compagnies/compagnies.component';
import { ProfilComponent } from './components/profil/profil.component';
import { AddCompanyComponent } from './components/add-company/add-company.component';
import { EditCompanyComponent } from './components/edit-company/edit-company.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { AddUserFormComponent } from './components/add-user-form/add-user-form.component';
import { UsersComponent } from './components/users/users.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';
import { CongesComponent } from './components/conges/conges.component';
import { DocumentRequestsListComponent } from './components/document-requests-list/document-requests-list.component';
import { DocumentRequestDetailComponent } from './components/document-request-detail/document-request-detail.component';
import { ParametersComponent } from './components/parameters/parameters.component';
import { EditCompanyProfileComponent } from './components/edit-company-profile/edit-company-profile.component';
import { ChangePasswordProfileComponent } from './components/change-password-profile/change-password-profile.component';
import { OffresEmploiComponent } from './components/offres-emploi/offres-emploi.component';
import { InternshipOffersComponent } from './components/internship-offers/internship-offers.component';
import { AuthGuard } from './guards/auth.guards';
import { DocumentRequestEmployeComponent } from './components/document-request-employe/document-request-employe.component';
import { CongesEmployeComponent } from './components/conges-employe/conges-employe.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ApplicationFormComponent } from './components/application-form/application-form.component';
import { OfferDetailsComponent } from './components/offer-details/offer-details.component';
import { AllInternshipsComponent } from './all-internships/all-internships.component';



export const routes: Routes = [


    {
        path:'',
        redirectTo:'landing-page',
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
        path: 'users', 
        component: UsersComponent 
    },
    { 
        path: 'users/add-user', 
        component: AddUserFormComponent 
    }, 
    { 
        path: 'users/update/:id', 
        component: UpdateUserComponent 
    },
    { 
        path: 'conges', 
        component: CongesComponent 
    },
    { 
        path: 'document-requests', 
        component: DocumentRequestsListComponent 
    },

    { 
        path: 'document-request-detail/:id', 
        component: DocumentRequestDetailComponent 
    },
    {
        path:'parametre',
        component : ParametersComponent
    },
    { 
        path: 'edit-company-profile', 
        component: EditCompanyProfileComponent 
    },
    {
        path : 'change-password-profile',
        component: ChangePasswordProfileComponent
    },
    { 
        path: 'offres-emploi', 
        component: OffresEmploiComponent 
    },

    { 
        path: 'offres-stage', 
        component: InternshipOffersComponent,
    },
    {
        path: 'DocumentReqEmploy', 
        component : DocumentRequestEmployeComponent
    },
    {
        path:'congesEmploy',
        component:CongesEmployeComponent
    },
    {
        path:'landing-page',
        component:LandingPageComponent
    },
    {
        path: 'apply/:id',
        component: ApplicationFormComponent
    },
    {
        path: 'offers/:id',
        component: OfferDetailsComponent
    },
    {
        path: 'all-internships',
        component: AllInternshipsComponent
    }



];

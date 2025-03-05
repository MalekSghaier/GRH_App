import { Component } from '@angular/core';
import { NavSidebarComponent } from '../sharedSuperAdmin/nav-sidebar/nav-sidebar.component';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [NavSidebarComponent], // Importez le composant standalone
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent {

}

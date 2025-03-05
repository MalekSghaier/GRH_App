import { Component } from '@angular/core';
import { NavSidebarComponent } from '../sharedSuperAdmin/nav-sidebar/nav-sidebar.component';

@Component({
  selector: 'app-compagnies',
  standalone: true,
  imports: [NavSidebarComponent],
  templateUrl: './compagnies.component.html',
  styleUrl: './compagnies.component.css'
})
export class CompagniesComponent {

}

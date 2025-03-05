// admins.component.ts
import { Component } from '@angular/core';
import { NavSidebarComponent } from '../sharedSuperAdmin/nav-sidebar/nav-sidebar.component';

@Component({
  selector: 'app-admins',
  standalone: true,
  imports: [NavSidebarComponent], 
  templateUrl: './admins.component.html', 
  styleUrl: './admins.component.css'
})
export class AdminsComponent {

}

import { Component } from '@angular/core';
import { SharedNavbarComponent } from '../shared-navbar/shared-navbar.component';
import { SharedSidebarComponent } from '../shared-sidebar-Employ/shared-sidebar.component';

@Component({
  selector: 'app-presence-employ',
  imports: [SharedNavbarComponent,SharedSidebarComponent],
  templateUrl: './presence-employ.component.html',
  styleUrl: './presence-employ.component.css'
})
export class PresenceEmployComponent {

}

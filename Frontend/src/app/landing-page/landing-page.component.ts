import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule], // Importez les modules nécessaires
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  // Exemple de propriétés pour dynamiser le template
  heroTitle = 'THE BEST EXPERIENCE';
  heroSubtitle = 'We Are Professionals';
  heroDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...';
  

}
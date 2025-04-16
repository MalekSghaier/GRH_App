import { Component, OnInit ,HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InternshipOffersService } from '../services/internship-offers.service';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationFormComponent } from '../components/application-form/application-form.component';
import { JobOffersService } from '../services/job-offers.service';


@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule,TruncatePipe],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  displayedOffers: any[] = [];
  showAllOffers = false;
  isScrolled = false;
  internshipOffers: any[] = [];
  workOffers: any[] = [];
  displayedworkOffers: any[] = [];

  isLoading = true;
  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
  }
  adjectives = [
    "Moderne et Intelligente",
    "Innovante et performante",
    "Futuriste et efficace",
    "Évoluée et intelligente",
    "Créative et audacieuse",
    "Avancée et sophistiquée",
    "Réfléchie et novatrice",
    "Ambitieuse et technologique"
  ];
  constructor(
    private internshipOfferService: InternshipOffersService,
    private dialog: MatDialog,
    private jobOffersService :JobOffersService

  ) {}

  displayText = this.adjectives[0]; // Initialisé directement avec le premier texte
  currentIndex = 0;
  isTyping = false;
  animationInterval: any;

  ngOnInit() {
    this.loadInternshipOffers();
    this.loadWorkOffers();
    setTimeout(() => {
      this.startAnimation();
    }, 2000);
  }

  loadInternshipOffers() {
    this.internshipOfferService.getAllOffers().subscribe({
      next: (offers) => {
        this.internshipOffers = offers;
        this.displayedOffers = this.showAllOffers ? offers : offers.slice(0, 3);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading offers:', err);
        this.isLoading = false;
      }
    });
  }

  loadWorkOffers() {
    this.jobOffersService.getAllOffers().subscribe({
      next: (offers) => {
        this.workOffers = offers;
        this.displayedworkOffers = this.showAllOffers ? offers : offers.slice(0, 3);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading offers:', err);
        this.isLoading = false;
      }
    });
  }

  toggleShowAllOffers() {
    this.showAllOffers = !this.showAllOffers;
    this.displayedOffers = this.showAllOffers 
      ? this.internshipOffers 
      : this.internshipOffers.slice(0, 3);
  }

  startAnimation() {
    this.animationInterval = setInterval(() => {
      this.animateToNext();
    }, 3500);
  }

  animateToNext() {
    if (this.isTyping) return;

    this.isTyping = true;
    const currentText = this.adjectives[this.currentIndex];
    const nextIndex = (this.currentIndex + 1) % this.adjectives.length;
    const nextText = this.adjectives[nextIndex];

    // Phase de suppression
    let i = currentText.length;
    const deleteInterval = setInterval(() => {
      if (i > 0) {
        this.displayText = currentText.substring(0, i - 1);
        i--;
      } else {
        clearInterval(deleteInterval);
        
        // Mise à jour immédiate de l'index et du texte
        this.currentIndex = nextIndex;
        this.displayText = ''; // Réinitialisation avant écriture
        
        // Phase d'écriture
        let j = 0;
        const typeInterval = setInterval(() => {
          if (j < nextText.length) {
            this.displayText = nextText.substring(0, j + 1);
            j++;
          } else {
            clearInterval(typeInterval);
            this.isTyping = false;
          }
        }, 120);
      }
    }, 120);
  }

  scrollTo(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      // Calcule la position en prenant en compte le header fixe
      const headerHeight = document.querySelector('header')?.clientHeight || 0;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  ngOnDestroy() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }

  openApplicationDialog(offer: any): void {
    const dialogRef = this.dialog.open(ApplicationFormComponent, {
      width: '750px',
      data: { offer: offer },
      disableClose: true
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Optionnel: Rafraîchir les données ou afficher un message
        console.log('Application submitted successfully');
      }
    });
  }
}
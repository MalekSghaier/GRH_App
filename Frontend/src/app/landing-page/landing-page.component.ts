import { Component, OnInit ,HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InternshipOffersService } from '../services/internship-offers.service';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationFormComponent } from '../components/application-form/application-form.component';
import { JobOffersService } from '../services/job-offers.service';
import { ApplicationWorkFormComponent } from '../components/application-work-form/application-work-form.component';
import { CountUpDirective } from '../count-up.directive';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ContactService } from '../services/contact.service';
import { animate, state, style, transition, trigger } from '@angular/animations';





@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule,ReactiveFormsModule,TruncatePipe,CountUpDirective],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  animations: [
    trigger('slideAnimation', [
      state('void', style({
        transform: 'translateX(100%)',
        opacity: 0
      })),
      state('in', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      state('out', style({
        transform: 'translateX(-100%)',
        opacity: 0
      })),
      transition('void => in', [
        animate('500ms ease-out')
      ]),
      transition('in => out', [
        animate('500ms ease-in')
      ]),
      transition('out => void', [
        animate('0ms')
      ])
    ])
  ]

})
export class LandingPageComponent implements OnInit {
  @ViewChild('contactForm') contactForm!: NgForm; // Déclarez la propriété contactForm
  @HostListener('window:scroll')

  displayedOffers: any[] = [];
  showAllOffers = false;
  isScrolled = false;
  internshipOffers: any[] = [];
  workOffers: any[] = [];
  displayedworkOffers: any[] = [];
  currentYear = new Date().getFullYear();

  isLoading = true;

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

  testimonials = [
    {
      text: "Cette application a révolutionné notre gestion RH. Simple, intuitive et puissante.",
      name: "Sophie Garnier",
      position: "DRH, Entreprise Techsolutions",
      image: "https://randomuser.me/api/portraits/women/43.jpg"
    },
    {
      text: "La solution la plus complète que nous ayons utilisée. Gain de temps considérable.",
      name: "Thomas Lefèvre",
      position: "Directeur Général, InnovateX",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      text: "Interface utilisateur exceptionnelle et support client réactif. Très satisfait.",
      name: "Amira Chennoufi",
      position: "Responsable RH, Startup GreenTech",
      image: "https://randomuser.me/api/portraits/women/65.jpg"
    },
    {
      text: "L'automatisation des processus RH a boosté notre productivité de 40%.",
      name: "Karim Bouaziz",
      position: "PDG, Groupe DataSoft",
      image: "https://randomuser.me/api/portraits/men/75.jpg"
    },
    {
      text: "Formation rapide et prise en main immédiate. Solution parfaitement adaptée.",
      name: "Lucas Petit",
      position: "Responsable Formation, MedicaCare",
      image: "https://randomuser.me/api/portraits/women/85.jpg"
    }
  ];
  
  constructor(
    private internshipOfferService: InternshipOffersService,
    private dialog: MatDialog,
    private jobOffersService :JobOffersService,
    private contactService: ContactService


  ) {}

  displayText = this.adjectives[0]; // Initialisé directement avec le premier texte
  currentIndex = 0;
  isTyping = false;
  animationInterval: any;
  currentTestimonialIndex = 0;
  testimonialInterval: any;
  activeSection: string = 'hero'; // Par défaut sur la section hero



  ngOnInit() {
    this.loadInternshipOffers();
    this.loadWorkOffers();
    setTimeout(() => {
      this.startAnimation();
    }, 1500);
    this.startTestimonialCarousel();

  }

  getAnimationState(index: number) {
    if (index === this.currentTestimonialIndex) {
      return 'in';
    }
    // Pour l'élément précédent qui doit sortir
    if (index === (this.currentTestimonialIndex - 1 + this.testimonials.length) % this.testimonials.length) {
      return 'out';
    }
    // Pour tous les autres éléments
    return 'void';
  }
  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
    
    // Détection de la section visible
    const sections = ['hero', 'about', 'features', 'stages', 'emplois', 'contact'];
    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          this.activeSection = section;
          break;
        }
      }
    }
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
  // Ajoutez ces méthodes à votre classe
startTestimonialCarousel() {
  this.testimonialInterval = setInterval(() => {
    this.nextTestimonial();
  }, 3000);
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

// Modifiez nextTestimonial pour forcer le changement après l'animation
nextTestimonial() {
  setTimeout(() => {
    this.currentTestimonialIndex = (this.currentTestimonialIndex + 1) % this.testimonials.length;
  }, 500); // Correspond à la durée de l'animation
}
  
  goToTestimonial(index: number) {
    this.currentTestimonialIndex = index;
    this.resetTestimonialInterval();
  }
  
  resetTestimonialInterval() {
    clearInterval(this.testimonialInterval);
    this.startTestimonialCarousel();
  }
  scrollTo(sectionId: string) {
    this.activeSection = sectionId; // Mettre à jour la section active
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

    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
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

  openApplicationWorkDialog(offer: any): void {
    const dialogRef = this.dialog.open(ApplicationWorkFormComponent, {
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


  // Pour l'animation de la carte
  flipCard() {
    const card = document.querySelector('.contact-card');
    card?.classList.toggle('flipped');
  }
  
  submitContactForm() {
    if (this.contactForm.valid) {
      const formData = {
        name: this.contactForm.value.name,
        email: this.contactForm.value.email,
        message: this.contactForm.value.message
      };
  
      this.contactService.sendContactForm(formData).subscribe({
        next: () => {
          // Message de succès
          alert('Votre message a été envoyé au Super Adminavec succès!');
          this.contactForm.resetForm();
        },
        error: (err) => {
          console.error('Erreur lors de l\'envoi du message:', err);
          alert('Une erreur s\'est produite. Veuillez réessayer plus tard.');
        }
      });
    }
  }
  
  resetForm() {
    this.flipCard();
    this.contactForm.resetForm();
  }

  
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
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
  
  displayText = this.adjectives[0]; // Initialisé directement avec le premier texte
  currentIndex = 0;
  isTyping = false;
  animationInterval: any;

  ngOnInit() {
    setTimeout(() => {
      this.startAnimation();
    }, 2000);
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

  ngOnDestroy() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { InternshipOffersService } from '../../services/internship-offers.service';
import { RouterModule } from '@angular/router';
import { ApplicationFormComponent } from '../application-form/application-form.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-offer-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.css']
})
export class OfferDetailsComponent implements OnInit {
  offer: any;

  constructor(
    private route: ActivatedRoute,
    private offerService: InternshipOffersService,
    private dialog: MatDialog

  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.offerService.getOfferDetails(id).subscribe({
        next: (offer) => this.offer = offer,
        error: (err) => console.error('Error loading offer:', err)
      });
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
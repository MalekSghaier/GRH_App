import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ApplicationFormComponent } from '../application-form/application-form.component';
import { MatDialog } from '@angular/material/dialog';
import { JobOffersService } from '../../services/job-offers.service';

@Component({
  selector: 'app-work-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './work-details.component.html',
  styleUrl: './work-details.component.css'
})
export class WorkDetailsComponent implements OnInit{
  offer: any;

  constructor(
    private route: ActivatedRoute,
    private offerService: JobOffersService,
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { InternshipOffersService } from '../../services/internship-offers.service';
import { RouterModule } from '@angular/router';

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
    private offerService: InternshipOffersService
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
}
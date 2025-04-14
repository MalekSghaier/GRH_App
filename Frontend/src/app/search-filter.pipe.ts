import { Pipe, PipeTransform } from '@angular/core';
import { InternshipOffer } from './services/internship-offers.service';

@Pipe({
  name: 'searchFilter',
  standalone: true
})
export class SearchFilterPipe implements PipeTransform {
  transform(offers: InternshipOffer[], searchText: string): InternshipOffer[] {
    if (!offers) return [];
    if (!searchText) return offers;

    searchText = searchText.toLowerCase();
    return offers.filter(offer => {
      return offer.title.toLowerCase().includes(searchText) ||
        offer.company.toLowerCase().includes(searchText) ||
        offer.description.toLowerCase().includes(searchText) ||
        offer.location.toLowerCase().includes(searchText);
    });
  }
}
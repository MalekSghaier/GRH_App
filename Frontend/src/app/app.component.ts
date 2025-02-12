import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { CommonModule } from '@angular/common'; // Importer CommonModule

@Component({
  selector: 'app-root',
  template: `<h1>Test API Angular + NestJS</h1>
             <pre>{{ data | json }}</pre>`,
  standalone: true,
  imports: [CommonModule] // Ajouter CommonModule ici
})
export class AppComponent implements OnInit {
  data: any;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getData().subscribe(response => {
      this.data = response;
    });
  }
}

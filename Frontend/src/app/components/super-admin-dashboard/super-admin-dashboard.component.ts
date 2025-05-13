import { Component, AfterViewInit ,ViewEncapsulation , OnInit } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';
import { AuthService } from '../../services/auth.service';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { Chart } from 'chart.js';




@Component({
  selector: 'app-super-admin-dashboard',
  imports: [NgChartsModule],
  templateUrl: './super-admin-dashboard.component.html',
  styleUrl:'./super-admin-dashboard.component.css',
  encapsulation: ViewEncapsulation.None 
})
export class SuperAdminDashboardComponent implements AfterViewInit , OnInit {

  totalCompanies: number = 0;
  totalEmployees: number = 0;
  totalInterns: number = 0;
public companiesChartData: ChartConfiguration['data'] = {
  labels: [],
  datasets: []
};

    public companiesChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Évolution mensuelle des compagnies'
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

    public companiesChartType: ChartType = 'line';

  // Graphique d'évolution des employés
public employeesChartData: ChartConfiguration['data'] = {
  labels: [],
  datasets: []
};

    // Graphique d'évolution des stagiaires
public internsChartData: ChartConfiguration['data'] = {
  labels: [],
  datasets: []
};

  constructor(
    private statisticsService: StatisticsService,
    private authService: AuthService
  ) {}


  ngOnInit(): void {
    this.loadStatistics();
    this.loadMonthlyEvolutionData();

  }
  logout(): void {
    this.authService.logout(); // Appelez la méthode logout
  }

  private loadStatistics(): void {
    this.statisticsService.getStatistics().subscribe(
      (data) => {
        this.totalCompanies = data.totalCompanies;
        this.totalEmployees = data.totalEmployees;
        this.totalInterns = data.totalInterns;
      },
      (error) => {
        console.error('Erreur lors du chargement des statistiques', error);
      },
    );
  }

private loadMonthlyEvolutionData(): void {
  this.statisticsService.getMonthlyEvolution().subscribe({
    next: (data) => {
      console.log('Données reçues:', data); // Pour le débogage
      
      // Mise à jour des graphiques
      this.updateChartData(this.companiesChartData, data.months, data.companies, 'Compagnies');
      this.updateChartData(this.employeesChartData, data.months, data.employees, 'Employés');
      this.updateChartData(this.internsChartData, data.months, data.interns, 'Stagiaires');
      
      // Forcer la mise à jour des graphiques
      this.companiesChartData = {...this.companiesChartData};
      this.employeesChartData = {...this.employeesChartData};
      this.internsChartData = {...this.internsChartData};
    },
    error: (error) => {
      console.error('Erreur lors du chargement des données mensuelles', error);
    }
  });
}

private updateChartData(chartData: ChartConfiguration['data'], labels: string[], data: number[], label: string): void {
  console.log(`Mise à jour du graphique ${label}:`, data); // Debug
  
  chartData.labels = [...labels];
  chartData.datasets = [{
    data: [...data],
    label: label,
    backgroundColor: this.getBackgroundColor(label),
    borderColor: this.getBorderColor(label),
    pointBackgroundColor: this.getPointColor(label),
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: this.getBorderColor(label),
    fill: 'origin',
    tension: 0.1
  }];
}

private getBackgroundColor(label: string): string {
  switch(label) {
    case 'Compagnies': return 'rgba(54, 162, 235, 0.2)';
    case 'Employés': return 'rgba(255, 209, 57, 0.2)';
    case 'Stagiaires': return 'rgba(247, 141, 95, 0.2)';
    default: return 'rgba(201, 203, 207, 0.2)';
  }
}

private getBorderColor(label: string): string {
  switch(label) {
    case 'Compagnies': return 'rgba(54, 162, 235, 1)';
    case 'Employés': return 'rgba(255, 206, 38, 1)';
    case 'Stagiaires': return 'rgba(253, 114, 56, 1)';
    default: return 'rgba(201, 203, 207, 1)';
  }
}

private getPointColor(label: string): string {
  switch(label) {
    case 'Compagnies': return 'rgba(54, 162, 235, 1)';
    case 'Employés': return 'rgba(255, 206, 38, 1)';
    case 'Stagiaires': return 'rgba(253, 114, 56, 1)';
    default: return 'rgba(201, 203, 207, 1)';
  }
}



  ngAfterViewInit(): void {
    this.initializeSidebar();
    this.initializeSearch();
    this.initializeDarkMode();
    this.initializeMenus();
  }



  private initializeSidebar(): void {
    const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

    allSideMenu.forEach(item => {
      const li = item.parentElement;

      if (li) {
        item.addEventListener('click', function () {
          allSideMenu.forEach(i => {
            if (i.parentElement) {
              i.parentElement.classList.remove('active');
            }
          });
          li.classList.add('active');
        });
      }
    });

    const menuBar = document.querySelector('#content nav .bx.bx-menu');
    const sidebar = document.getElementById('sidebar');

    if (menuBar && sidebar) {
      menuBar.addEventListener('click', function () {
        sidebar.classList.toggle('hide');
      });
    }

    window.addEventListener('load', this.adjustSidebar);
    window.addEventListener('resize', this.adjustSidebar);
  }

  private adjustSidebar(): void {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      if (window.innerWidth <= 576) {
        sidebar.classList.add('hide');
        sidebar.classList.remove('show');
      } else {
        sidebar.classList.remove('hide');
        sidebar.classList.add('show');
      }
    }
  }

  
  private initializeSearch(): void {
    const searchButton = document.querySelector('#content nav form .form-input button');
    const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
    const searchForm = document.querySelector('#content nav form');

    if (searchButton && searchButtonIcon && searchForm) {
      searchButton.addEventListener('click', function (e) {
        if (window.innerWidth < 768) {
          e.preventDefault();
          searchForm.classList.toggle('show');
          if (searchForm.classList.contains('show')) {
            searchButtonIcon.classList.replace('bx-search', 'bx-x');
          } else {
            searchButtonIcon.classList.replace('bx-x', 'bx-search');
          }
        }
      });
    }
  }

  private initializeDarkMode(): void {
    const switchMode = document.getElementById('switch-mode') as HTMLInputElement | null;

    if (switchMode) {
      switchMode.addEventListener('change', function () {
        if (this.checked) {
          document.body.classList.add('dark');
        } else {
          document.body.classList.remove('dark');
        }
      });
    }
  }

  private initializeMenus(): void {
    const notificationIcon = document.querySelector('.notification');
    const notificationMenu = document.querySelector('.notification-menu');
    const profileIcon = document.querySelector('.profile');
    const profileMenu = document.querySelector('.profile-menu');

    if (notificationIcon && notificationMenu) {
      notificationIcon.addEventListener('click', function () {
        notificationMenu.classList.toggle('show');
        if (profileMenu) {
          profileMenu.classList.remove('show');
        }
      });
    }

    if (profileIcon && profileMenu) {
      profileIcon.addEventListener('click', function () {
        profileMenu.classList.toggle('show');
        if (notificationMenu) {
          notificationMenu.classList.remove('show');
        }
      });
    }

    window.addEventListener('click', function (e) {
      const target = e.target as HTMLElement;
      if (notificationMenu && profileMenu) {
        if (!target.closest('.notification') && !target.closest('.profile')) {
          notificationMenu.classList.remove('show');
          profileMenu.classList.remove('show');
        }
      }
    });
  }

printDashboard(): void {
  // Préparation des données
  document.body.setAttribute('data-print-date', new Date().toLocaleString());
  
  // Créer un conteneur spécial pour l'impression
  const printContainer = document.createElement('div');
  printContainer.className = 'print-container';
  
  // Ajouter le titre principal
  const mainTitle = document.createElement('h1');
  mainTitle.textContent = 'Tableau de Bord SuperAdmin';
  mainTitle.style.textAlign = 'center';
  mainTitle.style.marginBottom = '10px';
  printContainer.appendChild(mainTitle);

  // Première ligne : Compagnies et Employés
  const firstRow = document.createElement('div');
  firstRow.className = 'print-row';
  
  // Section Compagnies
  const companiesSection = this.createStatSection('Compagnies', this.totalCompanies);
  firstRow.appendChild(companiesSection);
  
  // Section Employés
  const employeesSection = this.createStatSection('Employés', this.totalEmployees);
  firstRow.appendChild(employeesSection);
  
  printContainer.appendChild(firstRow);

  // Deuxième ligne : Stagiaires
  const secondRow = document.createElement('div');
  secondRow.className = 'print-row';
  
  // Section Stagiaires
  const internsSection = this.createStatSection('Stagiaires', this.totalInterns);
  secondRow.appendChild(internsSection);
  
  // Ajouter un élément vide pour maintenir l'alignement
  const emptySection = document.createElement('div');
  emptySection.className = 'print-section';
  emptySection.style.visibility = 'hidden';
  secondRow.appendChild(emptySection);
  
  printContainer.appendChild(secondRow);

  // Troisième ligne : Évolution des compagnies et employés
  const thirdRow = document.createElement('div');
  thirdRow.className = 'print-row';
  
  // Graphique Compagnies
  const companiesChartSection = this.createChartSection('Évolution des compagnies', this.companiesChartData);
  thirdRow.appendChild(companiesChartSection);
  
  // Graphique Employés
  const employeesChartSection = this.createChartSection('Évolution des employés', this.employeesChartData);
  thirdRow.appendChild(employeesChartSection);
  
  printContainer.appendChild(thirdRow);

  // Quatrième ligne : Évolution des stagiaires
  const fourthRow = document.createElement('div');
  fourthRow.className = 'print-row';
  
  // Graphique Stagiaires
  const internsChartSection = this.createChartSection('Évolution des stagiaires', this.internsChartData);
  fourthRow.appendChild(internsChartSection);
  
  // Ajouter un élément vide pour maintenir l'alignement
  const emptyChartSection = document.createElement('div');
  emptyChartSection.className = 'print-section';
  emptyChartSection.style.visibility = 'hidden';
  fourthRow.appendChild(emptyChartSection);
  
  printContainer.appendChild(fourthRow);

  // Ajouter le conteneur au body
  document.body.appendChild(printContainer);
  document.body.classList.add('print-mode');

  // Forcer la mise à jour des graphiques
  setTimeout(() => {
    this.companiesChartData = {...this.companiesChartData};
    this.employeesChartData = {...this.employeesChartData};
    this.internsChartData = {...this.internsChartData};
    
    // Imprimer après un court délai
    setTimeout(() => {
      window.print();
      
      // Nettoyage
      printContainer.remove();
      document.body.classList.remove('print-mode');
      document.body.removeAttribute('data-print-date');
    }, 500);
  }, 100);
}

private createStatSection(title: string, value: number): HTMLElement {
  const section = document.createElement('div');
  section.className = 'print-section stat-section';
  
  const valueDiv = document.createElement('div');
  valueDiv.className = 'stat-value';
  valueDiv.textContent = value.toString();
  valueDiv.style.fontSize = '32px';
  valueDiv.style.fontWeight = 'bold';
  valueDiv.style.textAlign = 'center';
  valueDiv.style.margin = '5px 0';
  
  const titleDiv = document.createElement('div');
  titleDiv.className = 'stat-title';
  titleDiv.textContent = title;
  titleDiv.style.textAlign = 'center';
  titleDiv.style.fontSize = '18px';
  
  section.appendChild(valueDiv);
  section.appendChild(titleDiv);
  
  return section;
}

private createChartSection(title: string, chartData: any): HTMLElement {
  const section = document.createElement('div');
  section.className = 'print-section chart-section';
  
  const titleDiv = document.createElement('h2');
  titleDiv.textContent = title;
  titleDiv.style.textAlign = 'center';
  titleDiv.style.marginBottom = '5px';
  
  const canvas = document.createElement('canvas');
  canvas.height = 200;
  canvas.width = 300;
  
  section.appendChild(titleDiv);
  section.appendChild(canvas);
  
  // Copier le graphique original
  setTimeout(() => {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartData.labels,
          datasets: [{
            ...chartData.datasets[0],
            borderWidth: 2,
            pointRadius: 4
          }]
        },
        options: {
          responsive: false,
          plugins: {
            legend: {
              position: 'top'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0
              }
            }
          }
        }
      });
    }
  }, 50);
  
  return section;
}
}
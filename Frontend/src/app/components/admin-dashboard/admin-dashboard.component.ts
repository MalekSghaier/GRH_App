import { Component, AfterViewInit ,ViewEncapsulation,OnInit  } from '@angular/core';
import { SharedNavbarComponent } from '../shared-navbar/shared-navbar.component';
import { SharedSidebarComponent } from '../shared-sidebar/shared-sidebar.component';
import { UserService } from '../../services/user.service';
import { CongesService } from '../../services/conges.service';
import { JobOffersService } from '../../services/job-offers.service';
import { InternshipOffersService } from '../../services/internship-offers.service';
import { Chart, ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import  {DocumentRequestsService} from '../../services/document-requests.service'

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [SharedNavbarComponent,SharedSidebarComponent,NgChartsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
  encapsulation: ViewEncapsulation.None // Désactive l'encapsulation

})
export class AdminDashboardComponent implements AfterViewInit,OnInit {

  private colors = {
    blue: '#3C91E6',
    lightBlue: '#CFE8FF',
    yellow: '#FFCE26',
    lightYellow: '#FFF2C6',
    orange: '#FD7238',
    orangeombre: '#f38e62',
    lightOrange: '#FFE0D3',
    green: '#3BB54A',
    lightGreen: '#D4F4DD',
    red: '#DB504A',
    purple: '#9B59B6',
    lightPurple: '#EAD1F5',
    light: '#F9F9F9'

  };

  employeeCount: number = 0;
  internCount: number = 0;
  pendingCongesCount: number = 0; 
  jobOffersCount: number = 0;
  internshipOffersCount: number = 0; // Ajoutez cette propriété




  constructor(
    private userService: UserService,
    private congesService: CongesService ,
    private jobOffersService: JobOffersService,
    private internshipOffersService: InternshipOffersService ,
    private documentRequestsService :DocumentRequestsService

  ) {}



  ngOnInit(): void {
    this.loadCounts();
    this.loadMonthlyCongesStats();

  }
  ngAfterViewInit(): void {
    this.initializeSidebar();
 
  }


  private loadCounts(): void {
    this.userService.countEmployees().subscribe({
      next: (count) => {
        this.employeeCount = count;
        this.updatePieChart();
      },
      error: (err) => console.error('Erreur lors du chargement des employés', err)
    });

    this.userService.countInterns().subscribe({
      next: (count) => {
        this.internCount = count;
        this.updatePieChart();
      },
      error: (err) => console.error('Erreur lors du chargement des stagiaires', err)
    });

    this.congesService.getPendingCongesCountForCompany().subscribe({
      next: (response) => this.pendingCongesCount = response.count,
      error: (err) => console.error('Erreur lors du chargement des congés en attente', err)
    });

    // Chargement du nombre d'offres d'emploi
    this.jobOffersService.countMyJobOffers().subscribe({
      next: (count) => this.jobOffersCount = count,
      error: (err) => console.error('Erreur lors du chargement des offres d\'emploi', err)
    });

    // Chargement du nombre d'offres de stage
    this.internshipOffersService.countMyInternshipOffers().subscribe({
      next: (count) => this.internshipOffersCount = count,
      error: (err) => console.error('Erreur lors du chargement des offres de stage', err)
    });

    this.documentRequestsService.getDocumentStats().subscribe({
      next: (stats) => {
        this.barChartData = {
          ...this.barChartData,
          datasets: [{
            ...this.barChartData.datasets[0],
            data: [stats.pending, stats.approved, stats.rejected]
          }]
        };
      },
      error: (err) => console.error('Erreur lors du chargement des stats documents', err)
    });
  }

  private updatePieChart(): void {
    this.pieChartData = {
      ...this.pieChartData,
      datasets: [{
        ...this.pieChartData.datasets[0],
        data: [this.employeeCount, this.internCount]
      }]
    };
  }
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false, // Important pour le contrôle de la taille
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw as number || 0;
            const total = (context.dataset.data as number[]).reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%' // Contrôle le rayon du trou central (pour un donut chart)
  };
  
  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Employés', 'Stagiaires'],
    datasets: [{
      data: [0, 0],
      backgroundColor: [
        this.colors.blue,
        this.colors.lightBlue,
      ],
      borderColor: [
        this.colors.blue,
        this.colors.lightBlue,
      ],    hoverBackgroundColor: [ 
        this.colors.blue,
        this.colors.lightBlue,
      ],
      hoverBorderColor: [ 
        this.colors.blue,
        this.colors.lightBlue
      ],
      borderWidth: 2
    }]
  };

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['En attente', 'Approuvées', 'Rejetées'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: [
        '#FD7238',
        '#FF7F50',
        '#fc9f65'
      ],
      borderColor: [
        '#FD7238',
        '#FF7F50',
        '#fc9f65'
      ],
      hoverBackgroundColor: [
        '#FD7238',
        '#FF7F50',
        '#fc9f65'
      ],
      hoverBorderColor: [ 
        '#FD7238',
        '#FF7F50',
        '#fc9f65'
      ],
      borderWidth: 1
    }]
  };
  
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.label}: ${context.raw}`;
          }
        }
      }
    }
  };
  
  public barChartType: ChartConfiguration<'bar'>['type'] = 'bar';
  
  public congesChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['En attente', 'Approuvés', 'Rejetés'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: [
        this.colors.orange,
        this.colors.green,
        this.colors.red,
      ],
      borderColor: [
        'var(--light-orange)',
        'var(--light-green)',
        'var(--light)'
      ],
      borderWidth: 2
    }]
  };
  
public lineChartData: ChartConfiguration<'line'>['data'] = {
  labels: [],
  datasets: [
    {
      data: [],
      label: 'Demandes de congés',
      backgroundColor: '#D4F4DD',
      borderColor: '#3BB54A',
      pointBackgroundColor: '#3BB54A',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#D4F4DD',
      fill: 'origin',
      tension: 0.4
    }
  ]
};

public lineChartOptions: ChartConfiguration<'line'>['options'] = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0
      }
    }
  },
  plugins: {
    legend: {
      display: true,
      position: 'top'
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          return `${context.dataset.label}: ${context.raw}`;
        }
      }
    }
  }
};

public lineChartLegend = true;

// Dans la méthode ngOnInit ou loadCounts, ajoutez :
private loadMonthlyCongesStats(): void {
  this.congesService.getMonthlyCongesStats().subscribe({
    next: (stats) => {
      this.lineChartData = {
        ...this.lineChartData,
        labels: stats.map(item => item.month),
        datasets: [{
          ...this.lineChartData.datasets[0],
          data: stats.map(item => item.count)
        }]
      };
    },
    error: (err) => console.error('Erreur lors du chargement des stats mensuelles', err)
  });
}

public pieChartLabels = ['Employés', 'Stagiaires'];
public pieChartLegend = true;
public pieChartPlugins = [];



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



  printDashboard(): void {
    // Ajouter la date d'impression dans l'attribut du body
    document.body.setAttribute('data-print-date', new Date().toLocaleString());
    // Forcer le redraw des graphiques
    this.pieChartData = { ...this.pieChartData };
    this.barChartData = { ...this.barChartData };
    this.lineChartData = { ...this.lineChartData };
  
    // Ajouter la classe print-mode au body
    document.body.classList.add('print-mode');
  
    // Attendre un petit peu pour que les styles soient appliqués
    setTimeout(() => {
      window.print();
  
      // Nettoyer après l'impression
      document.body.classList.remove('print-mode');
      document.body.removeAttribute('data-print-date');
    }, 500);
  }
}

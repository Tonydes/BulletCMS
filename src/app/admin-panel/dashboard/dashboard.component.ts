// src/app/admin-panel/dashboard/dashboard.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Importa DatePipe
import { RouterModule } from '@angular/router'; // Per i routerLink

// Importa i moduli PrimeNG necessari
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { SkeletonModule } from 'primeng/skeleton'; // Per l'effetto loading
import { TagModule } from 'primeng/tag';
import { ListboxModule } from 'primeng/listbox'; // Per gli elenchi

// Importa servizi (opzionale per ora, useremo dati mock)
// import { AuthService } from 'src/app/core/auth/service/auth.service';
// import { ArticleService } from 'src/app/core/services';
// import { PageService } from 'src/app/core/services';

// Interfacce per strutturare i dati mock (opzionale ma utile)
interface DashboardStats {
  publishedArticles: number | null;
  publishedPages: number | null;
  drafts: number | null;
  users: number | null;
}

interface RecentItem {
  id: number | string;
  title: string;
  type: 'Articolo' | 'Pagina';
  status: 'Pubblicato' | 'Bozza';
  date: Date;
  author?: string;
  editUrl: string; // Es: '/bcms-admin/articles/1/edit'
}

@Component({
  selector: 'bcms-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // Necessario per routerLink
    ButtonModule,
    CardModule,
    ToolbarModule,
    SkeletonModule,
    TagModule,
    ListboxModule,
    DatePipe // Aggiungi DatePipe agli imports
  ],
  templateUrl: './dashboard.component.html'
  // styleUrls: ['./dashboard.component.scss'] // Aggiungi se hai stili specifici
})
export class DashboardComponent implements OnInit {
  // Inietta servizi se/quando necessario
  // private authService = inject(AuthService);
  // private articleService = inject(ArticleService);
  // private pageService = inject(PageService);

  // Signal per lo stato di caricamento generale
  isLoading = signal(true);

  // Proprietà per i dati della dashboard
  stats: DashboardStats = {
    publishedArticles: null,
    publishedPages: null,
    drafts: null,
    users: null
  };
  recentActivity: RecentItem[] = [];
  myDrafts: RecentItem[] = [];
  username: string = 'Utente'; // Nome utente di default o da caricare
  currentDate = new Date(); // Data corrente per il saluto

  ngOnInit(): void {
    // Simula il caricamento dei dati dopo un breve ritardo
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading.set(true); // Imposta loading a true all'inizio

    // Simula una chiamata API con setTimeout
    setTimeout(() => {
      // --- Dati Mock ---
      // Carica nome utente (esempio)
      // this.username = this.authService.currentUser()?.firstName || 'Utente';

      // Statistiche mock
      this.stats = {
        publishedArticles: 23,
        publishedPages: 12,
        drafts: 5,
        users: 3
      };

      // Attività recenti mock
      this.recentActivity = [
        {
          id: 10,
          title: 'Nuove Funzionalità del CMS',
          type: 'Articolo',
          status: 'Pubblicato',
          date: new Date(2025, 3, 1, 10, 0),
          author: 'Mario Rossi',
          editUrl: '/bcms-admin/articles/10/edit'
        },
        {
          id: 11,
          title: 'Guida Introduttiva',
          type: 'Pagina',
          status: 'Pubblicato',
          date: new Date(2025, 2, 28, 15, 30),
          author: 'Anna Verdi',
          editUrl: '/bcms-admin/pages/11/edit'
        },
        {
          id: 12,
          title: 'Aggiornamento Performance',
          type: 'Articolo',
          status: 'Bozza',
          date: new Date(2025, 3, 2, 9, 15),
          author: 'Mario Rossi',
          editUrl: '/bcms-admin/articles/12/edit'
        },
        {
          id: 13,
          title: 'Chi Siamo - Update',
          type: 'Pagina',
          status: 'Pubblicato',
          date: new Date(2025, 2, 25, 11, 0),
          author: 'Anna Verdi',
          editUrl: '/bcms-admin/pages/13/edit'
        }
      ];

      // Bozze mock (potrebbero coincidere in parte con l'attività recente)
      this.myDrafts = [
        {
          id: 12,
          title: 'Aggiornamento Performance',
          type: 'Articolo',
          status: 'Bozza',
          date: new Date(2025, 3, 2, 9, 15),
          author: 'Mario Rossi',
          editUrl: '/bcms-admin/articles/12/edit'
        },
        {
          id: 14,
          title: 'Idea per nuovo articolo su SEO',
          type: 'Articolo',
          status: 'Bozza',
          date: new Date(2025, 3, 1, 17, 0),
          author: 'Mario Rossi',
          editUrl: '/bcms-admin/articles/14/edit'
        }
      ];
      // --- Fine Dati Mock ---

      this.isLoading.set(false); // Imposta loading a false dopo aver ricevuto i dati
      console.log('Dati dashboard mock caricati.');
    }, 1200); // Simula 1.2 secondi di caricamento
  }

  // Funzione helper per ottenere la severità del tag in base allo stato
  getStatusSeverity(status: 'Pubblicato' | 'Bozza'): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
    switch (status) {
      case 'Pubblicato':
        return 'success';
      case 'Bozza':
        return 'warn';
      default:
        return undefined;
    }
  }
}

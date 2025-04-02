import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, map } from 'rxjs/operators';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'bcms-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule],
  providers: [MessageService],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'BulletCMS';
  private primengConfig = inject(PrimeNG);
  private updates = inject(SwUpdate, { optional: true });
  private messageService = inject(MessageService);

  constructor() {}

  ngOnInit() {
    this.primengConfig.ripple.set(true);
    this.checkForUpdates();
  }

  checkForUpdates(): void {
    if (!this.updates) {
      return;
    }

    this.updates.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        map((evt) => ({
          type: 'UPDATE_AVAILABLE',
          current: evt.currentVersion,
          available: evt.latestVersion
        }))
      )
      .subscribe((evt) => {
        this.messageService.add({
          severity: 'info',
          summary: 'New update available',
          detail: "Una nuova versione dell'app è pronta. Ricaricare?",
          sticky: true,
          data: {
            action: 'reload'
          }
        });
      });

    this.updates.unrecoverable.subscribe((event) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Errore Aggiornamento',
        detail: `Errore durante l'aggiornamento: ${event.reason}. Potrebbe essere necessario ricaricare manualmente.`,
        sticky: true
      });
    });
  }
  activateUpdate(): void {
    if (this.updates) {
      this.updates.activateUpdate().then(() => document.location.reload());
    }
  }
}

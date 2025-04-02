// src/app/admin-panel/users/users-list.component.ts (Nuovo File)
import { Component, OnInit, effect, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // Aggiunto RouterModule

// Import PrimeNG Modules (basati su pages-list)
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast'; // Opzionale, se vuoi messaggi
import { ToolbarModule } from 'primeng/toolbar';
import { Table, TableModule } from 'primeng/table';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar'; // Per l'avatar
import { TagModule } from 'primeng/tag'; // Per il ruolo
import { SkeletonModule } from 'primeng/skeleton';

// Import servizi e modelli
import { User, UserRole } from 'src/app/core/auth/models/user.model'; // Modello Utente
import { MessageService } from 'primeng/api'; // Opzionale per messaggi
import { HttpResourceRef } from '@angular/common/http'; // Simula tipo
import { UserService } from 'src/app/core/services';

// Simula HttpResourceRef se usi il servizio mock
interface MockHttpResourceRef<T> {
  value: WritableSignal<T | undefined>;
  isLoading: WritableSignal<boolean>;
  error: WritableSignal<any | undefined>;
  hasValue: boolean;
  reload: () => void;
}

// Interfaccia per definizione colonne (puoi ometterla se non serve)
interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'bcms-users-list', // Selettore specifico per la lista utenti
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule, // Necessario per routerLink nei bottoni Edit/Delete
    TableModule,
    ButtonModule,
    RippleModule,
    ToastModule, // Opzionale
    ToolbarModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    AvatarModule, // Aggiunto
    TagModule, // Aggiunto
    SkeletonModule
  ],
  providers: [
    // UserService // Se non è già providedIn: 'root'
    MessageService // Opzionale
  ],
  templateUrl: './users-list.component.html' // Nuovo file HTML
  // styleUrls: ['./users-list.component.scss'] // Opzionale
})
export class UsersListComponent implements OnInit {
  skeletonRowsArray = Array(3);

  // Inietta servizi e router
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService); // Opzionale

  // Definisci le colonne (opzionale, potresti definirle direttamente nel template)
  cols!: Column[]; // Non usata nell'esempio HTML ma mantenuta per coerenza

  // Signal per i dati degli utenti (dal servizio)
  // Assicurati che il tipo corrisponda a quello restituito dal tuo servizio
  users: MockHttpResourceRef<User[]> = this.userService.users;

  // Signal per gestire la risposta dell'eliminazione
  // Assicurati che il tipo corrisponda a quello restituito dal tuo servizio
  deleteUserSignal: WritableSignal<MockHttpResourceRef<any> | null> = signal(null);

  // Array per memorizzare gli utenti selezionati nella tabella
  selectedUsers: User[] | null = null;

  // Campi per il filtro globale della tabella
  globalFilterFields: string[] = ['id', 'username', 'email', 'firstName', 'lastName', 'roleString']; // Aggiunti campi utente

  constructor() {
    // Effect per osservare l'esito dell'eliminazione e ricaricare/notificare
    effect(() => {
      const deleteSignalValue = this.deleteUserSignal(); // Leggi il signal che contiene la risorsa di delete
      if (deleteSignalValue?.hasValue && !deleteSignalValue.isLoading()) {
        if (!deleteSignalValue.error()) {
          console.log('User deleted successfully (according to signal). Reloading list...');
          this.messageService.add({ severity: 'success', summary: 'Successo', detail: 'Utente eliminato', life: 3000 });
          // Ricarica la lista dopo l'eliminazione
          // NOTA: Con il servizio mock, il reload potrebbe rimettere i dati iniziali.
          // In un'implementazione reale, questo dovrebbe richiedere i dati aggiornati.
          this.users.reload();
          this.selectedUsers = null; // Deseleziona dopo eliminazione
        } else {
          console.error('Error deleting user:', deleteSignalValue.error());
          this.messageService.add({ severity: 'error', summary: 'Errore', detail: 'Eliminazione utente fallita', life: 3000 });
        }
        this.deleteUserSignal.set(null); // Resetta il signal di delete dopo averlo processato
      } else if (deleteSignalValue?.error()) {
        // Gestisci errore anche se hasValue è false (es. errore di rete immediato)
        console.error('Error during delete user request:', deleteSignalValue.error());
        this.messageService.add({
          severity: 'error',
          summary: 'Errore Richiesta',
          detail: 'Errore durante eliminazione utente',
          life: 3000
        });
        this.deleteUserSignal.set(null); // Resetta
      }
    });
  }

  // ngOnInit può essere usato per caricamenti iniziali specifici se necessario
  ngOnInit(): void {
    // Esempio: definire le colonne se usate dinamicamente (non usate nell'HTML fornito)
    // this.cols = [
    //   { field: 'id', header: 'ID' },
    //   { field: 'username', header: 'Username' },
    //   { field: 'email', header: 'Email' },
    //   { field: 'role', header: 'Ruolo' }
    // ];

    // Aggiungi 'roleString' ai dati per permettere il filtro sul ruolo testuale
    this.users.value.update((currentUsers) =>
      currentUsers?.map((user) => ({
        ...user,
        roleString: this.mapRoleToString(user.role) // Aggiungi proprietà per filtro
      }))
    );
  }

  // Metodo per eliminare un singolo utente
  deleteUser(userId: number | string) {
    // Qui dovresti aggiungere una conferma prima di eliminare
    // Esempio: if (confirm(`Sei sicuro di voler eliminare l'utente ${userId}?`)) { ... }
    const deleteResource = this.userService.deleteUser(userId);
    this.deleteUserSignal.set(deleteResource);
  }

  // Metodo per eliminare gli utenti selezionati (da implementare la logica effettiva)
  deleteSelectedUsers() {
    // Qui dovresti aggiungere una conferma
    if (this.selectedUsers && this.selectedUsers.length > 0) {
      // Esempio: if (confirm(`Sei sicuro di voler eliminare ${this.selectedUsers.length} utenti selezionati?`)) { ... }
      console.warn('Delete selected users logic not fully implemented.');
      // Dovresti iterare su this.selectedUsers e chiamare deleteUser per ognuno,
      // gestendo magari le chiamate multiple (es. con forkJoin se il backend lo permette)
      // Per ora, mostriamo solo un messaggio.
      const idsToDelete = this.selectedUsers.map((u) => u.id);
      this.messageService.add({
        severity: 'info',
        summary: 'Azione non completa',
        detail: `Implementare eliminazione per ID: ${idsToDelete.join(', ')}`,
        life: 3000
      });
      // this.selectedUsers.forEach(user => {
      //    this.deleteUser(user.id); // Attenzione: questo triggererebbe N effect separati
      // });
    }
  }

  // Metodo per navigare alla pagina di creazione nuovo utente
  openNewUser() {
    // Assicurati che il percorso '/bcms-admin/users/new' esista nelle tue routes
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  // Metodo per navigare alla pagina di modifica utente
  editUser(userId: number | string) {
    // Assicurati che il percorso '/bcms-admin/users/:id/edit' esista
    this.router.navigate([userId, 'edit'], { relativeTo: this.route });
  }

  // Metodo per il filtro globale della tabella (invariato)
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  // Helper per mappare il ruolo a stringa (puoi metterlo nel servizio)
  mapRoleToString(role: UserRole | undefined): string {
    return this.userService.mapRoleToString(role); // Usa helper del servizio
  }

  // Helper per severity del tag Ruolo
  getRoleSeverity(role: UserRole | undefined): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (role) {
      case UserRole.Admin:
        return 'danger';
      case UserRole.Editor:
        return 'info';
      case UserRole.User:
        return 'success';
      default:
        return 'secondary';
    }
  }
}

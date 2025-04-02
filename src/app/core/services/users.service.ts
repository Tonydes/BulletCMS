import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpResourceRef } from '@angular/common/http'; // Simula tipo
import { User, UserRole } from '../auth/models/user.model'; // Importa modello User
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

// Simula la struttura di HttpResourceRef per il signal
interface MockHttpResourceRef<T> {
  value: WritableSignal<T | undefined>;
  isLoading: WritableSignal<boolean>;
  error: WritableSignal<any | undefined>;
  hasValue: boolean; // Semplificato
  reload: () => void;
}

function createMockHttpResource<T>(initialValue: T): MockHttpResourceRef<T> {
  const dataSignal = signal<T | undefined>(undefined);
  const loadingSignal = signal<boolean>(true); // Inizia come loading
  const errorSignal = signal<any | undefined>(undefined);

  // Simula caricamento iniziale
  setTimeout(() => {
    dataSignal.set(initialValue);
    loadingSignal.set(false);
  }, 800); // Ritardo simulato

  return {
    value: dataSignal,
    isLoading: loadingSignal,
    error: errorSignal,
    hasValue: !!dataSignal(),
    reload: () => {
      // Simula ricaricamento
      loadingSignal.set(true);
      errorSignal.set(undefined);
      setTimeout(() => {
        // Qui potresti rimettere i dati iniziali o modificarli leggermente
        dataSignal.set(initialValue);
        loadingSignal.set(false);
      }, 500);
    }
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Dati mock per gli utenti
  private mockUsers: User[] = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      firstName: 'Mario',
      lastName: 'Rossi',
      role: UserRole.Admin,
      avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png'
    },
    {
      id: 2,
      username: 'editor',
      email: 'editor@example.com',
      firstName: 'Anna',
      lastName: 'Verdi',
      role: UserRole.Editor,
      avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/annafali.png'
    },
    {
      id: 3,
      username: 'viewer',
      email: 'viewer@example.com',
      firstName: 'Luca',
      lastName: 'Bianchi',
      role: UserRole.User,
      avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/ionibowcher.png'
    }
  ];

  // Signal che simula httpResource
  users = createMockHttpResource<User[]>(this.mockUsers);

  // Metodo fittizio per eliminare un utente (simula HttpResourceRef)
  deleteUser(id: number | string): MockHttpResourceRef<any> {
    console.log(`[Mock UserService] Deleting user with id: ${id}`);
    const resultSignal = signal<any | undefined>(undefined);
    const loadingSignal = signal<boolean>(true);
    const errorSignal = signal<any | undefined>(undefined);

    // Simula operazione
    setTimeout(() => {
      // Filtra l'utente mock (non aggiornerà il signal 'users' direttamente qui)
      const userExists = this.mockUsers.some((u) => u.id === id);
      if (userExists) {
        this.mockUsers = this.mockUsers.filter((u) => u.id !== id); // Rimuove dal mock array
        resultSignal.set({ success: true });
        loadingSignal.set(false);
        // Potresti voler triggerare un reload del signal 'users' dopo la delete
        // this.users.reload(); // Ma questo rimetterebbe i dati iniziali nel mock
        console.log('[Mock UserService] User deleted locally. Reload list manually for mock effect.');
      } else {
        errorSignal.set({ message: 'User not found' });
        loadingSignal.set(false);
      }
    }, 500);

    return {
      value: resultSignal,
      isLoading: loadingSignal,
      error: errorSignal,
      hasValue: !!resultSignal(),
      reload: () => {} // Non implementato per delete
    };
  }

  // Metodo helper per mappare UserRole a stringa leggibile
  mapRoleToString(role: UserRole | undefined): string {
    if (role === undefined) return 'N/A';
    switch (role) {
      case UserRole.Admin:
        return 'Administrator';
      case UserRole.Editor:
        return 'Editor';
      case UserRole.User:
        return 'User';
      default:
        return 'Unknown';
    }
  }
}

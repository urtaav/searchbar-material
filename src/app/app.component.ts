import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { SearchBarService } from './services/search-bar.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbar, SearchBarComponent,MatProgressSpinnerModule],
  template: `
    <mat-toolbar>
      <app-search-bar />
    </mat-toolbar>
    @if (searchSubmitted()) {
      <div class="spinner-overlay">
        <mat-spinner></mat-spinner>
      </div>
    }
    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {
 
  searchBarService = inject(SearchBarService);
  searchSubmitted = this.searchBarService.searchSubmitted;

  timeout: any;

  constructor() {
    effect(() => {
      // Limpiamos el timeout anterior, si existe
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      // Solo ejecutamos el setTimeout si searchSubmitted es true
      if (this.searchSubmitted()) {
        this.timeout = setTimeout(() => {
           this.searchBarService.searchSubmitted.set(false);
        }, 4000);
      }
    });
  }
}

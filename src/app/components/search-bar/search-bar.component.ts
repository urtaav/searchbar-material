import { Component, computed, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { OverlayModule } from '@angular/cdk/overlay';
import { SearchBarService } from '../../services/search-bar.service';
import { SearchOverlayComponent } from '../search-overlay/search-overlay.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  imports: [
    MatIconButton,
    MatIcon,
    OverlayModule,
    SearchOverlayComponent,
    NgClass,
  ],
  template: `
    <div
      class="search-bar-container"
      cdkOverlayOrigin
      #overlayPosition="cdkOverlayOrigin"
      [ngClass]="{ 'opened mat-elevation-z2': overlayOpen() }"
    >
      <button mat-icon-button>
        <mat-icon>search</mat-icon>
      </button>
      <input
        #searchInput
        placeholder="What do you want to search today?"
        [value]="searchValue()"
        type="text"
        (click)="overlayOpen.set(true)"
        (keydown.ENTER)="search(searchInput.value)"
      />
      @if(searchValue()){
        <button mat-icon-button class="close-button" (click)="clearSearch()">
          <mat-icon>close</mat-icon>
        </button>
      }
    </div>
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="overlayPosition"
      [cdkConnectedOverlayOpen]="showOverlayOpen()"
      (overlayOutsideClick)="overlayOpen.set(false)"
    >
      <app-search-overlay />
    </ng-template>
  `,
  styles: `

    :host{
      display: block;
    }
    .search-bar-container{
      padding: 0px 56px 0px 8px;
      background: #eaf1fb;
      border-radius: 32px;
      display: flex;
      align-items: center;
      position:relative;

      > input{
        font-size: 1.1rem;
        outline: none;
        border: none;
        background: inherit;
        min-width: 352px;
      }
      &.opened{
        background: white;
        border-radius: 32px 32px 0px 0px;
      }
      .close-button{
        position: absolute;
        top:0;
        right: 8px;
      }
    }
  `,
})
export class SearchBarComponent {
  searchBarService = inject(SearchBarService);
  overlayOpen = this.searchBarService.overlayOpen;
  searchValue = this.searchBarService.searchTerm;

  showOverlayOpen = computed(() => {
    return this.overlayOpen() && this.searchBarService.recentSearches().length > 0;
  });
  
  search = (searchTerm: string) => {
    if (!searchTerm) return;

    this.searchBarService.search(searchTerm);
  };

  clearSearch = () => {
    this.searchBarService.clearSearch()
  };
}

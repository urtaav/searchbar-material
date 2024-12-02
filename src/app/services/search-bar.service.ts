import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchBarService {
  overlayOpen = signal(false);
  private readonly KEY_RECENT_SEARCHES = 'recentSearches';
  recentSearches = signal<string[]>(JSON.parse(window.localStorage.getItem(this.KEY_RECENT_SEARCHES) ?? '[]'));

  searchTerm = signal('');
  searchSubmitted = signal(false);
  constructor() {}

  search = (searchTerm: string) => {
    this.searchTerm.set(searchTerm);
    this.overlayOpen.set(false);
    this.addToRecentSearches(searchTerm);
    this.searchSubmitted.set(true);
  };

  clearSearch = () => {
    this.searchTerm.set("");
    this.overlayOpen.set(false);
  }

  addToRecentSearches = (searchTerm: string) => {
    const lowerCaseTerm = searchTerm.toLowerCase();
    this.recentSearches.set([
      lowerCaseTerm,
      ...this.recentSearches().filter((s) => s !== lowerCaseTerm),
    ]);
  };

  deleteRecentSearch = (searchTerm: string) => {
    this.recentSearches.set([
      ...this.recentSearches().filter((s) => s !== searchTerm),
    ]);
  };

  saveLocalStorage = effect(() => {
    window.localStorage.setItem(
      this.KEY_RECENT_SEARCHES,
      JSON.stringify(this.recentSearches())
    );
  });
}

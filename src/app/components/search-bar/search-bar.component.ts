import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapboxService, GeoResult } from '../../services/mapbox.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-wrapper" [class.focused]="isFocused" id="search-bar">
      <div class="search-icon">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="8.5" cy="8.5" r="6" stroke="currentColor" stroke-width="2"/><path d="M13 13L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </div>
      <input type="text" [(ngModel)]="query" (input)="onSearch()" (focus)="isFocused=true" (blur)="onBlur()"
        [placeholder]="placeholder" class="search-input" id="search-input">
      <div class="search-loading" *ngIf="loading">
        <div class="spinner"></div>
      </div>
      <!-- Results dropdown -->
      <div class="search-results" *ngIf="results.length > 0 && isFocused">
        <button class="result-item" *ngFor="let r of results" (mousedown)="selectResult(r)" [id]="'result-'+r.id">
          <span class="result-pin">📍</span>
          <div class="result-text">
            <span class="result-name">{{r.name}}</span>
            <span class="result-full">{{r.fullName}}</span>
          </div>
          <span class="result-type">{{r.type}}</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .search-wrapper { position:relative; width:100%; max-width:600px; }
    .search-icon { position:absolute; left:18px; top:50%; transform:translateY(-50%); color:var(--text-muted); z-index:2; pointer-events:none; }
    .search-input { width:100%; padding:18px 18px 18px 52px; background:var(--bg-card); border:1px solid var(--bg-glass-border); border-radius:var(--radius-lg); color:var(--text-primary); font-size:1rem; font-family:inherit; transition:var(--transition-fast); outline:none; }
    .search-input::placeholder { color:var(--text-muted); }
    .search-wrapper.focused .search-input { border-color:rgba(16,185,129,.4); box-shadow:0 0 0 3px rgba(16,185,129,.1); }
    .search-loading { position:absolute; right:16px; top:50%; transform:translateY(-50%); }
    .spinner { width:20px; height:20px; border:2px solid var(--bg-glass-border); border-top-color:#10b981; border-radius:50%; animation:spin .6s linear infinite; }
    @keyframes spin { to { transform:rotate(360deg); } }
    .search-results { position:absolute; top:calc(100% + 8px); left:0; right:0; background:var(--bg-secondary); border:1px solid var(--bg-glass-border); border-radius:var(--radius-lg); overflow:hidden; z-index:50; box-shadow:0 16px 48px rgba(0,0,0,.5); }
    .result-item { display:flex; align-items:center; gap:12px; width:100%; padding:14px 18px; background:none; color:var(--text-primary); text-align:left; transition:var(--transition-fast); border:none; cursor:pointer; border-bottom:1px solid rgba(255,255,255,.04); }
    .result-item:last-child { border-bottom:none; }
    .result-item:hover { background:rgba(16,185,129,.08); }
    .result-pin { font-size:1.1rem; }
    .result-text { flex:1; display:flex; flex-direction:column; }
    .result-name { font-weight:600; font-size:.92rem; }
    .result-full { font-size:.78rem; color:var(--text-muted); margin-top:2px; }
    .result-type { font-size:.7rem; text-transform:uppercase; letter-spacing:.5px; color:var(--text-muted); background:var(--bg-card); padding:3px 8px; border-radius:99px; font-weight:600; }
  `]
})
export class SearchBarComponent {
  @Output() placeSelected = new EventEmitter<GeoResult>();
  query = '';
  results: GeoResult[] = [];
  loading = false;
  isFocused = false;
  placeholder = 'Search any neighborhood, city, or district...';
  private debounceTimer: any;

  constructor(private mapbox: MapboxService) {}

  onSearch() {
    clearTimeout(this.debounceTimer);
    if (this.query.length < 2) { this.results = []; return; }
    this.loading = true;
    this.debounceTimer = setTimeout(async () => {
      this.results = await this.mapbox.searchPlaces(this.query);
      this.loading = false;
    }, 350);
  }

  selectResult(r: GeoResult) {
    this.query = r.name;
    this.results = [];
    this.isFocused = false;
    this.placeSelected.emit(r);
  }

  onBlur() {
    setTimeout(() => { this.isFocused = false; }, 200);
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar" [class.scrolled]="isScrolled" id="main-navbar">
      <div class="nav-inner container">
        <a routerLink="/" class="logo" id="nav-logo">
          <div class="logo-icon">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <defs><linearGradient id="lg" x1="0" y1="0" x2="30" y2="30" gradientUnits="userSpaceOnUse"><stop stop-color="#10b981"/><stop offset=".5" stop-color="#06b6d4"/><stop offset="1" stop-color="#6366f1"/></linearGradient></defs>
              <rect width="30" height="30" rx="8" fill="url(#lg)"/>
              <path d="M8 20V14a7 7 0 0 1 14 0v6" stroke="white" stroke-width="2.2" stroke-linecap="round"/>
              <circle cx="15" cy="12" r="2.5" fill="white" opacity=".8"/>
              <path d="M10 20h10" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <span class="logo-text">Neighbor<span class="logo-accent">IQ</span></span>
        </a>
        <div class="nav-links" [class.active]="mobileOpen">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" (click)="mobileOpen=false">Home</a>
          <a routerLink="/analyze" routerLinkActive="active" (click)="mobileOpen=false">Analyze</a>
          <a routerLink="/compare" routerLinkActive="active" (click)="mobileOpen=false">Compare</a>
          <a routerLink="/about" routerLinkActive="active" (click)="mobileOpen=false">About</a>
        </div>
        <div class="nav-actions">
          <a routerLink="/analyze" class="btn-primary btn-sm" id="nav-cta">Analyze Area</a>
          <button class="mobile-toggle" (click)="mobileOpen=!mobileOpen" aria-label="Menu">
            <span [class.open]="mobileOpen"></span>
          </button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar { position:fixed; top:0; left:0; right:0; z-index:1000; padding:14px 0; transition:all .3s ease; }
    .navbar.scrolled { background:rgba(6,9,15,.9); backdrop-filter:blur(20px); border-bottom:1px solid rgba(255,255,255,.05); padding:10px 0; }
    .nav-inner { display:flex; align-items:center; justify-content:space-between; }
    .logo { display:flex; align-items:center; gap:10px; }
    .logo-text { font-size:1.3rem; font-weight:800; letter-spacing:-.5px; }
    .logo-accent { background:var(--accent-gradient); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    .nav-links { display:flex; gap:6px; }
    .nav-links a { padding:8px 18px; border-radius:99px; font-size:.88rem; font-weight:500; color:var(--text-secondary); transition:var(--transition-fast); }
    .nav-links a:hover,.nav-links a.active { color:var(--text-primary); background:rgba(255,255,255,.06); }
    .nav-actions { display:flex; align-items:center; gap:12px; }
    .btn-sm { padding:10px 22px !important; font-size:.85rem !important; }
    .mobile-toggle { display:none; width:32px; height:32px; background:none; position:relative; }
    .mobile-toggle span,.mobile-toggle span::before,.mobile-toggle span::after { display:block; width:22px; height:2px; background:var(--text-primary); border-radius:2px; transition:var(--transition-fast); position:absolute; left:5px; }
    .mobile-toggle span { top:15px; }
    .mobile-toggle span::before { content:''; top:-7px; }
    .mobile-toggle span::after { content:''; top:7px; }
    .mobile-toggle span.open { background:transparent; }
    .mobile-toggle span.open::before { transform:rotate(45deg); top:0; }
    .mobile-toggle span.open::after { transform:rotate(-45deg); top:0; }
    @media(max-width:768px) {
      .nav-links { position:fixed; inset:0; background:rgba(6,9,15,.97); backdrop-filter:blur(30px); flex-direction:column; align-items:center; justify-content:center; gap:16px; opacity:0; pointer-events:none; transition:var(--transition-smooth); z-index:999; }
      .nav-links.active { opacity:1; pointer-events:all; }
      .nav-links a { font-size:1.4rem; font-weight:600; }
      .mobile-toggle { display:block; }
      .btn-sm { display:none !important; }
    }
  `]
})
export class NavbarComponent {
  isScrolled = false;
  mobileOpen = false;
  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => this.isScrolled = window.scrollY > 30);
    }
  }
}

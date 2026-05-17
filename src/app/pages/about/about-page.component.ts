import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="about-page" id="about-page">
      <div class="page-bg"><div class="orb orb-a"></div><div class="orb orb-b"></div></div>
      <div class="container page-content">
        <span class="section-tag">About</span>
        <h1 class="page-title">Built to help you find the <span class="gradient-text">perfect place to live</span></h1>
        <p class="page-desc">NeighborIQ is a free, AI-powered neighborhood intelligence platform that helps people make informed decisions about where to live, work, or invest.</p>

        <div class="about-grid">
          <div class="about-card" *ngFor="let item of aboutItems">
            <span class="about-icon">{{item.icon}}</span>
            <h3>{{item.title}}</h3>
            <p>{{item.desc}}</p>
          </div>
        </div>

        <div class="tech-section">
          <h2>Tech Stack</h2>
          <div class="tech-grid">
            <div class="tech-card" *ngFor="let t of techStack">
              <span class="tech-icon">{{t.icon}}</span>
              <h4>{{t.name}}</h4>
              <p>{{t.desc}}</p>
            </div>
          </div>
        </div>

        <div class="arch-section">
          <h2>Architecture Highlights</h2>
          <div class="arch-grid">
            <div class="arch-item" *ngFor="let a of archPoints">
              <span class="arch-bullet"></span>
              <div><strong>{{a.title}}</strong><p>{{a.desc}}</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about-page { min-height:100vh; padding:140px 0 80px; position:relative; overflow:hidden; }
    .page-bg { position:absolute; inset:0; z-index:0; }
    .orb { position:absolute; border-radius:50%; filter:blur(100px); opacity:.25; }
    .orb-a { width:400px; height:400px; background:#6366f1; top:-100px; left:-50px; animation:float 9s ease-in-out infinite; }
    .orb-b { width:350px; height:350px; background:#10b981; bottom:-80px; right:-50px; animation:float 11s ease-in-out infinite reverse; }
    .page-content { position:relative; z-index:1; }
    .section-tag { display:inline-block; padding:6px 16px; background:rgba(99,102,241,.1); border:1px solid rgba(99,102,241,.2); border-radius:99px; font-size:.78rem; font-weight:600; color:#a5b4fc; text-transform:uppercase; letter-spacing:1px; margin-bottom:20px; }
    .page-title { font-size:clamp(2rem,5vw,3.2rem); font-weight:900; line-height:1.15; letter-spacing:-1.5px; margin-bottom:16px; max-width:700px; }
    .page-desc { color:var(--text-secondary); font-size:1.05rem; max-width:600px; line-height:1.7; margin-bottom:56px; }
    .about-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-bottom:64px; }
    .about-card { background:var(--bg-card); border:1px solid var(--bg-glass-border); border-radius:var(--radius-lg); padding:28px; transition:var(--transition-smooth); }
    .about-card:hover { background:var(--bg-card-hover); transform:translateY(-4px); }
    .about-icon { font-size:2rem; display:block; margin-bottom:14px; }
    .about-card h3 { font-size:1rem; font-weight:700; margin-bottom:8px; }
    .about-card p { color:var(--text-secondary); font-size:.85rem; line-height:1.6; }
    .tech-section,.arch-section { margin-bottom:56px; }
    .tech-section h2,.arch-section h2 { font-size:1.8rem; font-weight:800; margin-bottom:28px; }
    .tech-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
    .tech-card { background:var(--bg-card); border:1px solid var(--bg-glass-border); border-radius:var(--radius-lg); padding:24px; text-align:center; transition:var(--transition-smooth); }
    .tech-card:hover { background:var(--bg-card-hover); }
    .tech-icon { font-size:2rem; display:block; margin-bottom:10px; }
    .tech-card h4 { font-size:.95rem; font-weight:700; margin-bottom:6px; }
    .tech-card p { color:var(--text-muted); font-size:.78rem; }
    .arch-grid { display:flex; flex-direction:column; gap:16px; }
    .arch-item { display:flex; gap:16px; align-items:flex-start; padding:20px; background:var(--bg-card); border:1px solid var(--bg-glass-border); border-radius:var(--radius-lg); }
    .arch-bullet { width:10px; height:10px; background:var(--accent-gradient); border-radius:50%; flex-shrink:0; margin-top:6px; }
    .arch-item strong { font-size:.92rem; display:block; margin-bottom:4px; }
    .arch-item p { color:var(--text-secondary); font-size:.84rem; line-height:1.5; margin:0; }
    @media(max-width:768px) { .about-grid { grid-template-columns:1fr; } .tech-grid { grid-template-columns:repeat(2,1fr); } }
  `]
})
export class AboutPageComponent {
  aboutItems = [
    { icon: '🎯', title: 'The Problem', desc: 'Deciding where to live is one of life\'s biggest decisions, yet finding reliable, comprehensive data about neighborhoods is fragmented and time-consuming.' },
    { icon: '💡', title: 'Our Solution', desc: 'NeighborIQ uses AI to instantly analyze any neighborhood worldwide across 8 livability categories, giving you the intelligence you need in seconds.' },
    { icon: '🆓', title: '100% Free', desc: 'No signup, no paywall, no limits. We believe everyone deserves access to neighborhood intelligence regardless of budget.' }
  ];
  techStack = [
    { icon: '🅰️', name: 'Angular 17', desc: 'Standalone components & signals' },
    { icon: '🤖', name: 'Groq AI', desc: 'Llama 3.3 70B model' },
    { icon: '🗺️', name: 'Mapbox GL', desc: 'Interactive 3D maps' },
    { icon: '🎨', name: 'Custom SCSS', desc: 'Glassmorphism design system' }
  ];
  archPoints = [
    { title: 'Lazy-Loaded Routes', desc: 'All pages are lazy-loaded for optimal initial bundle size and faster first paint.' },
    { title: 'Reactive State Management', desc: 'BehaviorSubject-based state shared across components via injectable services.' },
    { title: 'AI-Structured Responses', desc: 'Groq AI returns structured JSON parsed directly into TypeScript interfaces for type-safe rendering.' },
    { title: 'Mapbox Geocoding Integration', desc: 'Real-time autocomplete search using Mapbox Geocoding API with debounced requests.' },
    { title: 'Responsive & Accessible', desc: 'Fully responsive grid system with ARIA labels and semantic HTML throughout.' }
  ];
}

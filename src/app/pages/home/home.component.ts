import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { NeighborhoodService } from '../../services/neighborhood.service';
import { GeoResult } from '../../services/mapbox.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SearchBarComponent],
  template: `
    <section class="hero" id="home-hero">
      <div class="hero-bg">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
        <div class="grid-overlay"></div>
      </div>
      <div class="container hero-content">
        <div class="hero-badge animate-fade-up"><span class="badge-dot"></span>100% Free — No signup required</div>
        <h1 class="hero-title animate-fade-up delay-1">Know Your<br><span class="gradient-text">Neighborhood</span></h1>
        <p class="hero-sub animate-fade-up delay-2">AI-powered livability analysis for any neighborhood on Earth. Safety, walkability, schools, cost of living — all in seconds.</p>
        <div class="search-container animate-fade-up delay-3">
          <app-search-bar (placeSelected)="onPlace($event)"></app-search-bar>
        </div>
        <div class="hero-stats animate-fade-up delay-4">
          <div class="stat" *ngFor="let s of stats"><span class="stat-num">{{s.val}}</span><span class="stat-lbl">{{s.lbl}}</span></div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="how-section" id="how-it-works">
      <div class="container">
        <div class="section-hdr"><span class="section-tag">How It Works</span><h2>Three steps to <span class="gradient-text">smarter decisions</span></h2></div>
        <div class="steps-grid">
          <div class="step-card" *ngFor="let step of steps; let i = index" [id]="'step-'+i">
            <div class="step-num">{{step.num}}</div>
            <div class="step-icon">{{step.icon}}</div>
            <h3>{{step.title}}</h3>
            <p>{{step.desc}}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Cities -->
    <section class="featured-section" id="featured-cities">
      <div class="container">
        <div class="section-hdr"><span class="section-tag">Popular</span><h2>Explore <span class="gradient-text">top cities</span></h2></div>
        <div class="cities-grid">
          <button class="city-card" *ngFor="let city of cities" (click)="goToCity(city)" [id]="'city-'+city.name">
            <div class="city-emoji">{{city.emoji}}</div>
            <h3>{{city.name}}</h3>
            <p>{{city.country}}</p>
          </button>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features-section" id="features">
      <div class="container">
        <div class="section-hdr"><span class="section-tag">Features</span><h2>Powered by <span class="gradient-text">AI intelligence</span></h2></div>
        <div class="feat-grid">
          <div class="feat-card" *ngFor="let f of features" [id]="'feat-'+f.title">
            <span class="feat-icon">{{f.icon}}</span>
            <h3>{{f.title}}</h3>
            <p>{{f.desc}}</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero { position:relative; min-height:100vh; display:flex; align-items:center; overflow:hidden; padding:120px 0 80px; }
    .hero-bg { position:absolute; inset:0; z-index:0; }
    .orb { position:absolute; border-radius:50%; filter:blur(90px); opacity:.35; }
    .orb-1 { width:500px; height:500px; background:#10b981; top:-150px; right:-100px; animation:float 8s ease-in-out infinite; }
    .orb-2 { width:400px; height:400px; background:#06b6d4; bottom:-100px; left:-100px; animation:float 10s ease-in-out infinite reverse; }
    .orb-3 { width:300px; height:300px; background:#6366f1; top:50%; left:50%; transform:translate(-50%,-50%); animation:float 12s ease-in-out infinite; opacity:.15; }
    .grid-overlay { position:absolute; inset:0; background-image:linear-gradient(rgba(255,255,255,.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.015) 1px,transparent 1px); background-size:60px 60px; mask-image:radial-gradient(ellipse at center,black 30%,transparent 70%); }
    .hero-content { position:relative; z-index:1; text-align:center; display:flex; flex-direction:column; align-items:center; }
    .hero-badge { display:inline-flex; align-items:center; gap:8px; padding:6px 16px 6px 10px; background:rgba(16,185,129,.1); border:1px solid rgba(16,185,129,.25); border-radius:99px; font-size:.82rem; font-weight:500; color:#6ee7b7; margin-bottom:32px; }
    .badge-dot { width:8px; height:8px; background:#10b981; border-radius:50%; position:relative; }
    .badge-dot::after { content:''; position:absolute; inset:-3px; border-radius:50%; background:#10b981; animation:pulse-ring 2s ease-out infinite; }
    .hero-title { font-size:clamp(2.8rem,7vw,5.5rem); font-weight:900; line-height:1.05; letter-spacing:-2px; margin-bottom:24px; }
    .hero-sub { font-size:clamp(1rem,2vw,1.15rem); color:var(--text-secondary); max-width:560px; line-height:1.7; margin-bottom:40px; }
    .search-container { width:100%; max-width:600px; margin-bottom:48px; }
    .hero-stats { display:flex; gap:48px; }
    .stat { display:flex; flex-direction:column; align-items:center; gap:4px; }
    .stat-num { font-size:1.6rem; font-weight:800; background:var(--accent-gradient); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    .stat-lbl { font-size:.75rem; color:var(--text-muted); font-weight:500; text-transform:uppercase; letter-spacing:1px; }
    /* How section */
    .how-section,.featured-section,.features-section { padding:100px 0; }
    .section-hdr { text-align:center; margin-bottom:56px; }
    .section-tag { display:inline-block; padding:6px 16px; background:rgba(16,185,129,.1); border:1px solid rgba(16,185,129,.2); border-radius:99px; font-size:.78rem; font-weight:600; color:#6ee7b7; text-transform:uppercase; letter-spacing:1px; margin-bottom:16px; }
    .section-hdr h2 { font-size:clamp(1.8rem,4vw,2.8rem); font-weight:800; letter-spacing:-1px; }
    .steps-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
    .step-card { background:var(--bg-card); border:1px solid var(--bg-glass-border); border-radius:var(--radius-lg); padding:32px; text-align:center; transition:var(--transition-smooth); position:relative; overflow:hidden; }
    .step-card:hover { background:var(--bg-card-hover); transform:translateY(-4px); }
    .step-num { position:absolute; top:12px; right:16px; font-size:3rem; font-weight:900; background:var(--accent-gradient); -webkit-background-clip:text; -webkit-text-fill-color:transparent; opacity:.15; }
    .step-icon { font-size:2.5rem; margin-bottom:16px; }
    .step-card h3 { font-size:1.1rem; font-weight:700; margin-bottom:8px; }
    .step-card p { color:var(--text-secondary); font-size:.88rem; line-height:1.6; }
    /* Cities */
    .cities-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
    .city-card { background:var(--bg-card); border:1px solid var(--bg-glass-border); border-radius:var(--radius-lg); padding:28px; text-align:center; transition:var(--transition-smooth); cursor:pointer; }
    .city-card:hover { background:rgba(16,185,129,.08); border-color:rgba(16,185,129,.2); transform:translateY(-4px); }
    .city-emoji { font-size:2.5rem; margin-bottom:12px; }
    .city-card h3 { font-size:1rem; font-weight:700; margin-bottom:4px; }
    .city-card p { font-size:.8rem; color:var(--text-muted); }
    /* Features */
    .feat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
    .feat-card { background:var(--bg-card); border:1px solid var(--bg-glass-border); border-radius:var(--radius-lg); padding:28px; transition:var(--transition-smooth); }
    .feat-card:hover { background:var(--bg-card-hover); transform:translateY(-4px); }
    .feat-icon { font-size:2rem; display:block; margin-bottom:14px; }
    .feat-card h3 { font-size:1rem; font-weight:700; margin-bottom:8px; }
    .feat-card p { color:var(--text-secondary); font-size:.85rem; line-height:1.6; }
    @media(max-width:768px) { .steps-grid,.feat-grid { grid-template-columns:1fr; } .cities-grid { grid-template-columns:repeat(2,1fr); } .hero-stats { gap:28px; } }
  `]
})
export class HomeComponent {
  stats = [
    { val: '10M+', lbl: 'Areas Covered' },
    { val: '8', lbl: 'Score Categories' },
    { val: '100%', lbl: 'Free Forever' }
  ];
  steps = [
    { num: '01', icon: '🔍', title: 'Search Any Place', desc: 'Type any neighborhood, city, or district — our Mapbox-powered search finds it instantly.' },
    { num: '02', icon: '🤖', title: 'AI Analyzes It', desc: 'Groq AI generates a comprehensive livability report with 8 scored categories in seconds.' },
    { num: '03', icon: '📊', title: 'Get Your Report', desc: 'View interactive scores, explore the map, chat with AI, and compare neighborhoods.' }
  ];
  cities = [
    { name: 'Manhattan', country: 'New York, USA', emoji: '🗽', coords: [-73.9712, 40.7831] as [number, number] },
    { name: 'London', country: 'United Kingdom', emoji: '🇬🇧', coords: [-0.1276, 51.5074] as [number, number] },
    { name: 'Tokyo', country: 'Japan', emoji: '🗼', coords: [139.6917, 35.6895] as [number, number] },
    { name: 'Paris', country: 'France', emoji: '🇫🇷', coords: [2.3522, 48.8566] as [number, number] },
    { name: 'Mumbai', country: 'India', emoji: '🇮🇳', coords: [72.8777, 19.076] as [number, number] },
    { name: 'Sydney', country: 'Australia', emoji: '🇦🇺', coords: [151.2093, -33.8688] as [number, number] },
    { name: 'Dubai', country: 'UAE', emoji: '🇦🇪', coords: [55.2708, 25.2048] as [number, number] },
    { name: 'Singapore', country: 'Singapore', emoji: '🇸🇬', coords: [103.8198, 1.3521] as [number, number] }
  ];
  features = [
    { icon: '🛡️', title: 'Safety Score', desc: 'AI-analyzed crime data and safety insights for informed decisions.' },
    { icon: '🚶', title: 'Walkability Index', desc: 'How walk-friendly is the area? Sidewalks, amenities within reach.' },
    { icon: '🚇', title: 'Transit Rating', desc: 'Public transportation coverage, frequency, and connectivity.' },
    { icon: '🎓', title: 'School Quality', desc: 'Nearby schools, ratings, and education infrastructure analysis.' },
    { icon: '💰', title: 'Cost of Living', desc: 'Rent averages, grocery costs, and overall affordability breakdown.' },
    { icon: '💬', title: 'AI Chat Assistant', desc: 'Ask any question about the area and get instant AI-powered answers.' }
  ];

  constructor(private router: Router, private hood: NeighborhoodService) {}

  onPlace(result: GeoResult) {
    this.hood.setDestination({ name: result.name, fullName: result.fullName, coords: result.coords });
    this.router.navigate(['/analyze']);
  }

  goToCity(city: any) {
    this.hood.setDestination({ name: city.name, fullName: `${city.name}, ${city.country}`, coords: city.coords });
    this.router.navigate(['/analyze']);
  }
}

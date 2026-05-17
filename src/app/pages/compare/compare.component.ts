import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapboxService, GeoResult } from '../../services/mapbox.service';
import { GroqService } from '../../services/groq.service';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="compare-page" id="compare-page">
      <div class="page-bg"><div class="orb orb-a"></div><div class="orb orb-b"></div></div>
      <div class="container page-content">
        <div class="section-hdr"><span class="section-tag">Compare</span><h1>Compare <span class="gradient-text">two neighborhoods</span></h1><p class="sub">See how two areas stack up across 8 livability categories.</p></div>

        <!-- Inputs -->
        <div class="compare-inputs">
          <div class="input-group">
            <label>First Location</label>
            <input type="text" [(ngModel)]="query1" (input)="search(1)" placeholder="e.g. Manhattan" id="compare-input-1">
            <div class="dropdown" *ngIf="results1.length"><button *ngFor="let r of results1" (click)="pick(1,r)">📍 {{r.fullName}}</button></div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="input-group">
            <label>Second Location</label>
            <input type="text" [(ngModel)]="query2" (input)="search(2)" placeholder="e.g. Brooklyn" id="compare-input-2">
            <div class="dropdown" *ngIf="results2.length"><button *ngFor="let r of results2" (click)="pick(2,r)">📍 {{r.fullName}}</button></div>
          </div>
        </div>
        <div class="compare-cta"><button class="btn-primary" (click)="compare()" [disabled]="!place1||!place2||loading" id="compare-btn">{{loading ? 'Analyzing...' : 'Compare Now'}}</button></div>

        <!-- Loading -->
        <div class="loading-wrap" *ngIf="loading"><div class="spinner-lg"></div><p>AI is comparing both neighborhoods...</p></div>

        <!-- Results -->
        <div class="compare-results" *ngIf="result && !loading">
          <!-- Headers -->
          <div class="compare-header">
            <div class="ch-place" [class.winner]="result.place1.overallScore >= result.place2.overallScore">
              <span class="ch-score" [style.background]="getColor(result.place1.overallScore)">{{result.place1.overallScore}}</span>
              <h2>{{result.place1.name}}</h2>
            </div>
            <div class="ch-vs">VS</div>
            <div class="ch-place" [class.winner]="result.place2.overallScore > result.place1.overallScore">
              <span class="ch-score" [style.background]="getColor(result.place2.overallScore)">{{result.place2.overallScore}}</span>
              <h2>{{result.place2.name}}</h2>
            </div>
          </div>

          <!-- Score Bars -->
          <div class="compare-bars">
            <div class="bar-row" *ngFor="let cat of categories">
              <span class="bar-label">{{cat.icon}} {{cat.label}}</span>
              <div class="bar-track">
                <div class="bar-fill left" [style.width.%]="result.place1.scores[cat.key]" [style.background]="getColor(result.place1.scores[cat.key])"></div>
              </div>
              <span class="bar-val">{{result.place1.scores[cat.key]}}</span>
              <span class="bar-val">{{result.place2.scores[cat.key]}}</span>
              <div class="bar-track">
                <div class="bar-fill right" [style.width.%]="result.place2.scores[cat.key]" [style.background]="getColor(result.place2.scores[cat.key])"></div>
              </div>
            </div>
          </div>

          <!-- Strengths -->
          <div class="strengths-row">
            <div class="str-card">
              <h3>{{result.place1.name}} Strengths</h3>
              <div class="str-item" *ngFor="let s of result.place1.strengths">✅ {{s}}</div>
              <div class="rent-badge">{{result.place1.avgRent}}</div>
            </div>
            <div class="str-card">
              <h3>{{result.place2.name}} Strengths</h3>
              <div class="str-item" *ngFor="let s of result.place2.strengths">✅ {{s}}</div>
              <div class="rent-badge">{{result.place2.avgRent}}</div>
            </div>
          </div>

          <!-- Verdict -->
          <div class="verdict-card">
            <h3>🏆 AI Verdict</h3>
            <p>{{result.verdict}}</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .compare-page { min-height:100vh; padding:120px 0 80px; position:relative; overflow:hidden; }
    .page-bg { position:absolute; inset:0; z-index:0; }
    .orb { position:absolute; border-radius:50%; filter:blur(100px); opacity:.25; }
    .orb-a { width:400px; height:400px; background:#06b6d4; top:-100px; left:-50px; animation:float 9s ease-in-out infinite; }
    .orb-b { width:350px; height:350px; background:#10b981; bottom:-80px; right:-50px; animation:float 11s ease-in-out infinite reverse; }
    .page-content { position:relative; z-index:1; }
    .section-hdr { text-align:center; margin-bottom:48px; }
    .section-tag { display:inline-block; padding:6px 16px; background:rgba(6,182,212,.1); border:1px solid rgba(6,182,212,.2); border-radius:99px; font-size:.78rem; font-weight:600; color:#67e8f9; text-transform:uppercase; letter-spacing:1px; margin-bottom:16px; }
    .section-hdr h1 { font-size:clamp(2rem,4vw,3rem); font-weight:900; letter-spacing:-1px; }
    .sub { color:var(--text-secondary); margin-top:10px; font-size:1rem; }
    /* Inputs */
    .compare-inputs { display:flex; align-items:flex-start; gap:20px; justify-content:center; margin-bottom:24px; }
    .input-group { position:relative; flex:1; max-width:320px; }
    .input-group label { display:block; font-size:.82rem; font-weight:600; color:var(--text-secondary); margin-bottom:8px; }
    .input-group input { width:100%; padding:14px 18px; background:var(--bg-card); border:1px solid var(--bg-glass-border); border-radius:var(--radius-md); color:var(--text-primary); font-family:inherit; font-size:.95rem; outline:none; transition:var(--transition-fast); }
    .input-group input:focus { border-color:rgba(16,185,129,.4); }
    .input-group input::placeholder { color:var(--text-muted); }
    .dropdown { position:absolute; top:100%; left:0; right:0; background:var(--bg-secondary); border:1px solid var(--bg-glass-border); border-radius:var(--radius-md); z-index:20; margin-top:4px; overflow:hidden; box-shadow:0 12px 40px rgba(0,0,0,.5); }
    .dropdown button { display:block; width:100%; padding:12px 16px; background:none; border:none; color:var(--text-secondary); font-size:.85rem; text-align:left; cursor:pointer; transition:var(--transition-fast); border-bottom:1px solid rgba(255,255,255,.04); }
    .dropdown button:hover { background:rgba(16,185,129,.08); color:var(--text-primary); }
    .vs-badge { padding:12px 20px; background:var(--bg-card); border:1px solid var(--bg-glass-border); border-radius:var(--radius-md); font-weight:900; color:var(--text-muted); margin-top:26px; }
    .compare-cta { text-align:center; margin-bottom:48px; }
    /* Loading */
    .loading-wrap { text-align:center; padding:60px; }
    .spinner-lg { width:48px; height:48px; border:3px solid var(--bg-glass-border); border-top-color:#10b981; border-radius:50%; animation:spin .8s linear infinite; margin:0 auto 16px; }
    @keyframes spin { to { transform:rotate(360deg); } }
    .loading-wrap p { color:var(--text-secondary); }
    /* Results */
    .compare-header { display:flex; align-items:center; justify-content:center; gap:40px; margin-bottom:40px; }
    .ch-place { text-align:center; }
    .ch-place.winner h2 { background:var(--accent-gradient); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    .ch-score { display:inline-flex; width:56px; height:56px; align-items:center; justify-content:center; border-radius:var(--radius-md); font-size:1.4rem; font-weight:900; color:white; margin-bottom:8px; }
    .ch-place h2 { font-size:1.3rem; font-weight:800; }
    .ch-vs { font-size:1.2rem; font-weight:900; color:var(--text-muted); }
    /* Bars */
    .compare-bars { margin-bottom:36px; }
    .bar-row { display:grid; grid-template-columns:140px 1fr 40px 40px 1fr; gap:12px; align-items:center; padding:10px 0; border-bottom:1px solid rgba(255,255,255,.04); }
    .bar-label { font-size:.82rem; font-weight:600; color:var(--text-secondary); }
    .bar-track { height:10px; background:rgba(255,255,255,.04); border-radius:99px; overflow:hidden; }
    .bar-fill { height:100%; border-radius:99px; transition:width 1s ease-out; }
    .bar-fill.left { margin-left:auto; }
    .bar-val { text-align:center; font-size:.82rem; font-weight:700; }
    /* Strengths */
    .strengths-row { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:24px; }
    .str-card { background:var(--bg-card); border:1px solid var(--bg-glass-border); border-radius:var(--radius-lg); padding:24px; }
    .str-card h3 { font-size:1rem; font-weight:700; margin-bottom:14px; }
    .str-item { padding:6px 0; color:var(--text-secondary); font-size:.88rem; }
    .rent-badge { margin-top:14px; padding:8px 14px; background:rgba(16,185,129,.1); border:1px solid rgba(16,185,129,.2); border-radius:var(--radius-md); display:inline-block; font-weight:700; font-size:.88rem; color:#6ee7b7; }
    .verdict-card { background:linear-gradient(135deg,rgba(16,185,129,.06),rgba(6,182,212,.06)); border:1px solid rgba(16,185,129,.15); border-radius:var(--radius-lg); padding:28px; }
    .verdict-card h3 { font-size:1.1rem; font-weight:700; margin-bottom:12px; }
    .verdict-card p { color:var(--text-secondary); font-size:.95rem; line-height:1.7; }
    @media(max-width:768px) { .compare-inputs { flex-direction:column; align-items:center; } .bar-row { grid-template-columns:100px 1fr 30px 30px 1fr; gap:6px; } .strengths-row { grid-template-columns:1fr; } .compare-header { gap:20px; } }
  `]
})
export class CompareComponent {
  query1 = ''; query2 = '';
  results1: GeoResult[] = []; results2: GeoResult[] = [];
  place1 = ''; place2 = '';
  loading = false;
  result: any = null;
  private debounce1: any; private debounce2: any;
  categories = [
    { key: 'safety', label: 'Safety', icon: '🛡️' },
    { key: 'walkability', label: 'Walkability', icon: '🚶' },
    { key: 'transit', label: 'Transit', icon: '🚇' },
    { key: 'nightlife', label: 'Nightlife', icon: '🌙' },
    { key: 'schools', label: 'Schools', icon: '🎓' },
    { key: 'costOfLiving', label: 'Cost of Living', icon: '💰' },
    { key: 'healthcare', label: 'Healthcare', icon: '🏥' },
    { key: 'greenSpaces', label: 'Green Spaces', icon: '🌳' }
  ];

  constructor(private mapbox: MapboxService, private groq: GroqService) {}

  search(n: number) {
    const q = n === 1 ? this.query1 : this.query2;
    const timer = n === 1 ? 'debounce1' : 'debounce2';
    clearTimeout((this as any)[timer]);
    (this as any)[timer] = setTimeout(async () => {
      const res = await this.mapbox.searchPlaces(q);
      if (n === 1) this.results1 = res; else this.results2 = res;
    }, 350);
  }

  pick(n: number, r: GeoResult) {
    if (n === 1) { this.query1 = r.name; this.place1 = r.fullName; this.results1 = []; }
    else { this.query2 = r.name; this.place2 = r.fullName; this.results2 = []; }
  }

  async compare() {
    if (!this.place1 || !this.place2 || this.loading) return;
    this.loading = true; this.result = null;
    try {
      const raw = await this.groq.generateComparison(this.place1, this.place2);
      const json = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      this.result = JSON.parse(json);
    } catch (e) { console.error('Compare failed:', e); }
    this.loading = false;
  }

  getColor(s: number): string {
    if (s >= 75) return 'linear-gradient(135deg,#10b981,#059669)';
    if (s >= 50) return 'linear-gradient(135deg,#f59e0b,#d97706)';
    return 'linear-gradient(135deg,#ef4444,#dc2626)';
  }
}

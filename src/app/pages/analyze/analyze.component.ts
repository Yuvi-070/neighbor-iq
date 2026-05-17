import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { MapViewComponent } from '../../components/map-view/map-view.component';
import { ScoreCardComponent } from '../../components/score-card/score-card.component';
import { AiChatComponent } from '../../components/ai-chat/ai-chat.component';
import { GroqService } from '../../services/groq.service';
import { NeighborhoodService, LivabilityReport } from '../../services/neighborhood.service';
import { GeoResult } from '../../services/mapbox.service';

@Component({
  selector: 'app-analyze',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, MapViewComponent, ScoreCardComponent, AiChatComponent],
  template: `
    <section class="analyze-page" id="analyze-page">
      <!-- Top bar -->
      <div class="analyze-top container">
        <app-search-bar (placeSelected)="onPlace($event)"></app-search-bar>
      </div>

      <div class="container" *ngIf="!destination">
        <div class="empty-state">
          <span class="empty-icon">📍</span>
          <h2>Search a neighborhood to analyze</h2>
          <p>Type any city, district, or neighborhood above to get started.</p>
        </div>
      </div>

      <div class="analyze-layout container" *ngIf="destination">
        <!-- LEFT: Map + Scores -->
        <div class="analyze-main">
          <!-- Place header -->
          <div class="place-header">
            <div>
              <h1 id="place-name">{{destination.name}}</h1>
              <p class="place-full">{{destination.fullName}}</p>
            </div>
            <div class="overall-badge" *ngIf="report" [style.background]="getOverallColor()">
              <span class="overall-num">{{report.overallScore}}</span>
              <span class="overall-lbl">Overall</span>
            </div>
          </div>

          <!-- Map -->
          <div class="map-wrap">
            <app-map-view [coords]="destination.coords" [zoom]="13" [markers]="mapMarkers"></app-map-view>
          </div>

          <!-- Loading skeleton -->
          <div class="scores-loading" *ngIf="loading">
            <div class="skeleton skel-card" *ngFor="let i of [1,2,3,4,5,6,7,8]"></div>
          </div>

          <!-- Score Cards -->
          <div class="scores-grid" *ngIf="report && !loading">
            <app-score-card *ngFor="let s of scoreCards" [icon]="s.icon" [label]="s.label" [score]="s.score" [summary]="s.summary"></app-score-card>
          </div>

          <!-- Report Details -->
          <div class="report-details" *ngIf="report && !loading">
            <div class="detail-card">
              <h3>📝 Overview</h3>
              <p>{{report.overview}}</p>
            </div>
            <div class="detail-row">
              <div class="detail-card small">
                <h3>💰 Avg Rent</h3><p class="detail-value">{{report.avgRent}}</p>
              </div>
              <div class="detail-card small">
                <h3>👥 Population</h3><p class="detail-value">{{report.population}}</p>
              </div>
              <div class="detail-card small">
                <h3>🌤️ Climate</h3><p class="detail-value">{{report.climate}}</p>
              </div>
            </div>
            <div class="detail-card">
              <h3>✅ Best For</h3>
              <div class="tags-row"><span class="tag green" *ngFor="let b of report.bestFor">{{b}}</span></div>
            </div>
            <div class="detail-card">
              <h3>⚠️ Considerations</h3>
              <div class="tags-row"><span class="tag amber" *ngFor="let c of report.considerations">{{c}}</span></div>
            </div>
            <div class="detail-card">
              <h3>🏛️ Top Attractions</h3>
              <div class="attractions-list">
                <div class="attraction" *ngFor="let a of report.topAttractions; let i = index">
                  <span class="attr-num">{{i+1}}</span>{{a}}
                </div>
              </div>
            </div>
            <!-- Local Insights -->
            <div class="detail-card" *ngIf="insights.length > 0">
              <h3>💡 Local Insider Tips</h3>
              <div class="insights-grid">
                <div class="insight" *ngFor="let tip of insights">
                  <span class="insight-icon">{{tip.icon}}</span>
                  <div><strong>{{tip.title}}</strong><p>{{tip.detail}}</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT: AI Chat -->
        <div class="analyze-sidebar">
          <app-ai-chat></app-ai-chat>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .analyze-page { padding:100px 0 60px; min-height:100vh; }
    .analyze-top { margin-bottom:32px; display:flex; justify-content:center; }
    .empty-state { text-align:center; padding:120px 24px; }
    .empty-icon { font-size:4rem; display:block; margin-bottom:20px; }
    .empty-state h2 { font-size:1.6rem; font-weight:700; margin-bottom:8px; }
    .empty-state p { color:var(--text-secondary); }
    .analyze-layout { display:grid; grid-template-columns:1fr 380px; gap:28px; align-items:start; }
    /* Place header */
    .place-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
    .place-header h1 { font-size:2rem; font-weight:800; letter-spacing:-1px; }
    .place-full { color:var(--text-muted); font-size:.88rem; margin-top:4px; }
    .overall-badge { width:72px; height:72px; border-radius:var(--radius-lg); display:flex; flex-direction:column; align-items:center; justify-content:center; }
    .overall-num { font-size:1.6rem; font-weight:900; color:white; }
    .overall-lbl { font-size:.65rem; text-transform:uppercase; letter-spacing:.5px; color:rgba(255,255,255,.8); font-weight:600; }
    /* Map */
    .map-wrap { height:380px; margin-bottom:28px; border-radius:var(--radius-lg); overflow:hidden; }
    /* Scores */
    .scores-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:28px; }
    .scores-loading { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:28px; }
    .skel-card { height:180px; }
    /* Report details */
    .detail-card { background:var(--bg-card); border:1px solid var(--bg-glass-border); border-radius:var(--radius-lg); padding:24px; margin-bottom:16px; }
    .detail-card h3 { font-size:1rem; font-weight:700; margin-bottom:12px; }
    .detail-card p { color:var(--text-secondary); font-size:.9rem; line-height:1.7; }
    .detail-row { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:16px; }
    .detail-card.small { text-align:center; }
    .detail-value { font-size:1.1rem; font-weight:700; color:var(--text-primary); }
    .tags-row { display:flex; flex-wrap:wrap; gap:8px; }
    .tag { padding:6px 14px; border-radius:99px; font-size:.8rem; font-weight:600; }
    .tag.green { background:rgba(16,185,129,.12); color:#6ee7b7; border:1px solid rgba(16,185,129,.2); }
    .tag.amber { background:rgba(245,158,11,.12); color:#fbbf24; border:1px solid rgba(245,158,11,.2); }
    .attractions-list { display:flex; flex-direction:column; gap:8px; }
    .attraction { display:flex; align-items:center; gap:12px; padding:10px 14px; background:rgba(255,255,255,.02); border-radius:var(--radius-md); font-size:.88rem; color:var(--text-secondary); }
    .attr-num { width:28px; height:28px; background:var(--accent-gradient); border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:.8rem; flex-shrink:0; }
    .insights-grid { display:flex; flex-direction:column; gap:12px; }
    .insight { display:flex; gap:12px; align-items:flex-start; }
    .insight-icon { font-size:1.4rem; flex-shrink:0; margin-top:2px; }
    .insight strong { display:block; font-size:.88rem; margin-bottom:2px; }
    .insight p { color:var(--text-secondary); font-size:.82rem; line-height:1.5; margin:0; }
    /* Sidebar */
    .analyze-sidebar { position:sticky; top:90px; height:calc(100vh - 110px); }
    @media(max-width:1024px) { .analyze-layout { grid-template-columns:1fr; } .analyze-sidebar { position:static; height:500px; } .scores-grid,.scores-loading { grid-template-columns:repeat(2,1fr); } }
    @media(max-width:768px) { .detail-row { grid-template-columns:1fr; } }
  `]
})
export class AnalyzeComponent implements OnInit {
  destination: any = null;
  report: LivabilityReport | null = null;
  loading = false;
  scoreCards: any[] = [];
  mapMarkers: any[] = [];
  insights: any[] = [];
  private scoreIcons: Record<string, string> = {
    safety: '🛡️', walkability: '🚶', transit: '🚇', nightlife: '🌙',
    schools: '🎓', costOfLiving: '💰', healthcare: '🏥', greenSpaces: '🌳'
  };
  private scoreLabels: Record<string, string> = {
    safety: 'Safety', walkability: 'Walkability', transit: 'Transit', nightlife: 'Nightlife',
    schools: 'Schools', costOfLiving: 'Cost of Living', healthcare: 'Healthcare', greenSpaces: 'Green Spaces'
  };

  constructor(private groq: GroqService, private hood: NeighborhoodService, private router: Router) {}

  ngOnInit() {
    this.hood.destination$.subscribe(d => {
      if (d) { this.destination = d; this.analyze(); }
    });
  }

  onPlace(r: GeoResult) {
    this.hood.setDestination({ name: r.name, fullName: r.fullName, coords: r.coords });
  }

  async analyze() {
    this.loading = true;
    this.report = null;
    this.scoreCards = [];
    this.insights = [];
    this.mapMarkers = [];
    try {
      const raw = await this.groq.generateLivabilityReport(this.destination.fullName || this.destination.name);
      const json = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      this.report = JSON.parse(json);
      this.hood.setReport(this.report);
      if (this.report?.scores) {
        this.scoreCards = Object.entries(this.report.scores).map(([key, val]) => ({
          icon: this.scoreIcons[key] || '📊',
          label: this.scoreLabels[key] || key,
          score: val.score,
          summary: val.summary
        }));
      }
      if (this.report?.topAttractions) {
        const offset = 0.008;
        this.mapMarkers = this.report.topAttractions.map((a, i) => ({
          coords: [
            this.destination.coords[0] + (Math.cos(i * 1.25) * offset * (i + 1)),
            this.destination.coords[1] + (Math.sin(i * 1.25) * offset * (i + 1))
          ] as [number, number],
          label: a
        }));
      }
      // Get local insights
      try {
        const insightsRaw = await this.groq.getLocalInsights(this.destination.name);
        const insightsJson = insightsRaw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        this.insights = JSON.parse(insightsJson).tips || [];
      } catch { this.insights = []; }
    } catch (e) {
      console.error('Failed to generate report:', e);
    }
    this.loading = false;
  }

  getOverallColor(): string {
    if (!this.report) return 'var(--bg-card)';
    const s = this.report.overallScore;
    if (s >= 75) return 'linear-gradient(135deg,#10b981,#059669)';
    if (s >= 50) return 'linear-gradient(135deg,#f59e0b,#d97706)';
    return 'linear-gradient(135deg,#ef4444,#dc2626)';
  }
}

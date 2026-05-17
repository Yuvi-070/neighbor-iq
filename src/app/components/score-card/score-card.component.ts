import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-score-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="score-card" [id]="'score-'+label">
      <div class="score-header">
        <span class="score-icon">{{icon}}</span>
        <span class="score-label">{{label}}</span>
      </div>
      <div class="score-ring-wrap">
        <svg class="score-ring" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="6"/>
          <circle cx="40" cy="40" r="34" fill="none" [attr.stroke]="getColor()" stroke-width="6"
            stroke-linecap="round" [attr.stroke-dasharray]="dashArray" [attr.stroke-dashoffset]="dashOffset"
            style="transition:stroke-dashoffset 1.2s ease-out;transform:rotate(-90deg);transform-origin:center;"/>
        </svg>
        <span class="score-value" [style.color]="getColor()">{{score}}</span>
      </div>
      <p class="score-summary">{{summary}}</p>
    </div>
  `,
  styles: [`
    .score-card { background:var(--bg-card); border:1px solid var(--bg-glass-border); border-radius:var(--radius-lg); padding:24px; text-align:center; transition:var(--transition-smooth); }
    .score-card:hover { background:var(--bg-card-hover); transform:translateY(-4px); box-shadow:var(--shadow-glow); }
    .score-header { display:flex; align-items:center; justify-content:center; gap:8px; margin-bottom:16px; }
    .score-icon { font-size:1.2rem; }
    .score-label { font-size:.85rem; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:var(--text-secondary); }
    .score-ring-wrap { position:relative; width:80px; height:80px; margin:0 auto 14px; }
    .score-ring { width:100%; height:100%; }
    .score-value { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:1.4rem; font-weight:800; }
    .score-summary { font-size:.8rem; color:var(--text-muted); line-height:1.5; }
  `]
})
export class ScoreCardComponent {
  @Input() icon = '';
  @Input() label = '';
  @Input() score = 0;
  @Input() summary = '';
  circumference = 2 * Math.PI * 34;
  get dashArray() { return this.circumference.toString(); }
  get dashOffset() { return (this.circumference - (this.score / 100) * this.circumference).toString(); }
  getColor(): string {
    if (this.score >= 75) return '#10b981';
    if (this.score >= 50) return '#f59e0b';
    return '#ef4444';
  }
}

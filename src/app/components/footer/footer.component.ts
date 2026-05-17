import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer" id="app-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="footer-logo"><span class="ft-name">Neighbor</span><span class="ft-accent">IQ</span></div>
            <p>AI-powered neighborhood intelligence. Analyze any area's livability for free.</p>
          </div>
          <div class="footer-col" *ngFor="let c of cols">
            <h4>{{c.title}}</h4>
            <a *ngFor="let l of c.links" href="#">{{l}}</a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 NeighborIQ. Built with Angular + Groq AI + Mapbox.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer { padding:64px 0 28px; border-top:1px solid rgba(255,255,255,.05); background:var(--bg-secondary); }
    .footer-grid { display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:40px; margin-bottom:40px; }
    .footer-logo { font-size:1.2rem; font-weight:800; margin-bottom:12px; }
    .ft-accent { background:var(--accent-gradient); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    .footer-brand p { color:var(--text-muted); font-size:.85rem; max-width:260px; line-height:1.6; }
    .footer-col h4 { font-size:.8rem; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--text-secondary); margin-bottom:14px; }
    .footer-col a { display:block; color:var(--text-muted); font-size:.85rem; padding:5px 0; transition:var(--transition-fast); }
    .footer-col a:hover { color:var(--text-primary); padding-left:4px; }
    .footer-bottom { padding-top:28px; border-top:1px solid rgba(255,255,255,.05); }
    .footer-bottom p { color:var(--text-muted); font-size:.8rem; text-align:center; }
    @media(max-width:768px) { .footer-grid { grid-template-columns:1fr 1fr; gap:28px; } }
  `]
})
export class FooterComponent {
  cols = [
    { title: 'Product', links: ['Analyze', 'Compare', 'AI Chat', 'API'] },
    { title: 'Resources', links: ['Docs', 'Blog', 'Changelog', 'FAQ'] },
    { title: 'Legal', links: ['Privacy', 'Terms', 'License'] }
  ];
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroqService, ChatMessage } from '../../services/groq.service';
import { NeighborhoodService } from '../../services/neighborhood.service';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-panel glass" id="ai-chat">
      <div class="chat-header">
        <div class="chat-avatar">🤖</div>
        <div>
          <h3>NeighborIQ AI</h3>
          <span class="chat-status">Ask anything about this area</span>
        </div>
      </div>
      <div class="chat-messages" id="chat-messages">
        <div class="msg" *ngFor="let m of displayMessages" [class.user]="m.role==='user'" [class.assistant]="m.role==='assistant'">
          <div class="msg-bubble">{{m.content}}</div>
        </div>
        <div class="msg assistant" *ngIf="thinking">
          <div class="msg-bubble typing"><span></span><span></span><span></span></div>
        </div>
      </div>
      <!-- Quick actions -->
      <div class="quick-actions" *ngIf="displayMessages.length === 0 && placeName">
        <button *ngFor="let q of quickQuestions" (click)="askQuick(q)" class="quick-btn">{{q}}</button>
      </div>
      <form class="chat-input-wrap" (ngSubmit)="send()">
        <input [(ngModel)]="input" name="msg" placeholder="Ask about this neighborhood..." class="chat-input" id="chat-input">
        <button type="submit" class="send-btn" [disabled]="!input.trim() || thinking" id="chat-send">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 9L16 2L11 16L9 10L2 9Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
        </button>
      </form>
    </div>
  `,
  styles: [`
    .chat-panel { display:flex; flex-direction:column; height:100%; overflow:hidden; }
    .chat-header { display:flex; align-items:center; gap:12px; padding:18px 20px; border-bottom:1px solid rgba(255,255,255,.06); }
    .chat-avatar { font-size:1.6rem; }
    .chat-header h3 { font-size:.95rem; font-weight:700; }
    .chat-status { font-size:.75rem; color:var(--text-muted); }
    .chat-messages { flex:1; overflow-y:auto; padding:16px 20px; display:flex; flex-direction:column; gap:12px; }
    .msg { display:flex; }
    .msg.user { justify-content:flex-end; }
    .msg-bubble { max-width:85%; padding:12px 16px; border-radius:16px; font-size:.88rem; line-height:1.6; white-space:pre-wrap; }
    .msg.assistant .msg-bubble { background:var(--bg-card); border:1px solid var(--bg-glass-border); border-bottom-left-radius:4px; }
    .msg.user .msg-bubble { background:linear-gradient(135deg,#10b981,#06b6d4); color:white; border-bottom-right-radius:4px; }
    .typing { display:flex; gap:4px; padding:14px 18px; }
    .typing span { width:6px; height:6px; background:var(--text-muted); border-radius:50%; animation:bounce .6s ease-in-out infinite; }
    .typing span:nth-child(2) { animation-delay:.15s; }
    .typing span:nth-child(3) { animation-delay:.3s; }
    @keyframes bounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
    .quick-actions { display:flex; flex-wrap:wrap; gap:8px; padding:0 20px 12px; }
    .quick-btn { padding:8px 14px; background:var(--bg-card); border:1px solid var(--bg-glass-border); border-radius:99px; color:var(--text-secondary); font-size:.78rem; font-weight:500; transition:var(--transition-fast); cursor:pointer; }
    .quick-btn:hover { background:rgba(16,185,129,.1); border-color:rgba(16,185,129,.3); color:var(--text-primary); }
    .chat-input-wrap { display:flex; gap:8px; padding:16px 20px; border-top:1px solid rgba(255,255,255,.06); }
    .chat-input { flex:1; padding:12px 16px; background:var(--bg-card); border:1px solid var(--bg-glass-border); border-radius:var(--radius-md); color:var(--text-primary); font-family:inherit; font-size:.88rem; outline:none; transition:var(--transition-fast); }
    .chat-input:focus { border-color:rgba(16,185,129,.4); }
    .chat-input::placeholder { color:var(--text-muted); }
    .send-btn { width:44px; height:44px; border-radius:var(--radius-md); background:var(--accent-gradient); color:white; display:flex; align-items:center; justify-content:center; transition:var(--transition-fast); }
    .send-btn:disabled { opacity:.4; cursor:not-allowed; }
    .send-btn:not(:disabled):hover { transform:scale(1.05); }
  `]
})
export class AiChatComponent {
  input = '';
  thinking = false;
  messages: ChatMessage[] = [];
  displayMessages: ChatMessage[] = [];
  placeName = '';
  quickQuestions: string[] = [];

  constructor(private groq: GroqService, private hood: NeighborhoodService) {
    this.hood.destination$.subscribe(d => {
      if (d) {
        this.placeName = d.name;
        this.quickQuestions = [
          `Is ${d.name} safe at night?`,
          `Best restaurants in ${d.name}?`,
          `Cost of living breakdown?`,
          `Best schools nearby?`,
          `Public transit options?`,
          `Nightlife & entertainment?`
        ];
      }
    });
  }

  askQuick(q: string) { this.input = q; this.send(); }

  async send() {
    if (!this.input.trim() || this.thinking) return;
    const userMsg: ChatMessage = { role: 'user', content: this.input };
    this.messages.push(userMsg);
    this.displayMessages.push(userMsg);
    this.input = '';
    this.thinking = true;
    try {
      const reply = await this.groq.chat(this.messages);
      const assistantMsg: ChatMessage = { role: 'assistant', content: reply };
      this.messages.push(assistantMsg);
      this.displayMessages.push(assistantMsg);
    } catch {
      this.displayMessages.push({ role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' });
    }
    this.thinking = false;
    setTimeout(() => {
      const el = document.getElementById('chat-messages');
      if (el) el.scrollTop = el.scrollHeight;
    }, 50);
  }
}

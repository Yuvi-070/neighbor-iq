import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Destination {
  name: string;
  fullName: string;
  coords: [number, number];
}

export interface LivabilityReport {
  overview: string;
  scores: Record<string, { score: number; summary: string }>;
  overallScore: number;
  bestFor: string[];
  considerations: string[];
  avgRent: string;
  population: string;
  climate: string;
  topAttractions: string[];
}

@Injectable({ providedIn: 'root' })
export class NeighborhoodService {
  private destinationSub = new BehaviorSubject<Destination | null>(null);
  private reportSub = new BehaviorSubject<LivabilityReport | null>(null);
  private loadingSub = new BehaviorSubject<boolean>(false);

  destination$ = this.destinationSub.asObservable();
  report$ = this.reportSub.asObservable();
  loading$ = this.loadingSub.asObservable();

  private history: Destination[] = [];

  setDestination(dest: Destination) {
    this.destinationSub.next(dest);
    if (!this.history.find(h => h.name === dest.name)) {
      this.history.unshift(dest);
      if (this.history.length > 10) this.history.pop();
    }
  }

  setReport(report: LivabilityReport | null) {
    this.reportSub.next(report);
  }

  setLoading(v: boolean) {
    this.loadingSub.next(v);
  }

  getHistory(): Destination[] {
    return [...this.history];
  }

  getDestination(): Destination | null {
    return this.destinationSub.value;
  }
}

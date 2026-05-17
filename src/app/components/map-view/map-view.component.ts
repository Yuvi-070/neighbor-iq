import { Component, Input, OnChanges, SimpleChanges, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [CommonModule],
  template: `<div #mapEl class="map-container" id="map-view"></div>`,
  styles: [`
    .map-container { width:100%; height:100%; min-height:400px; border-radius:var(--radius-lg); overflow:hidden; border:1px solid var(--bg-glass-border); }
  `]
})
export class MapViewComponent implements AfterViewInit, OnChanges {
  @ViewChild('mapEl') mapEl!: ElementRef;
  @Input() coords: [number, number] = [0, 20];
  @Input() zoom: number = 2;
  @Input() markers: { coords: [number, number]; label: string }[] = [];
  private map!: mapboxgl.Map;
  private currentMarkers: mapboxgl.Marker[] = [];
  private mapReady = false;

  ngAfterViewInit() {
    (mapboxgl as any).accessToken = environment.mapboxToken;
    this.map = new mapboxgl.Map({
      container: this.mapEl.nativeElement,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: this.coords,
      zoom: this.zoom,
      pitch: 45,
      bearing: -10,
      antialias: true
    });
    this.map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'top-right');
    this.map.on('load', () => {
      this.mapReady = true;
      this.addMarkers();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.map) return;
    if (changes['coords'] && this.coords) {
      this.map.flyTo({ center: this.coords, zoom: 13, pitch: 50, bearing: -10, duration: 2500, essential: true });
    }
    if (changes['markers'] && this.mapReady) this.addMarkers();
  }

  private addMarkers() {
    this.currentMarkers.forEach(m => m.remove());
    this.currentMarkers = [];
    this.markers.forEach((m, i) => {
      const el = document.createElement('div');
      el.style.cssText = 'width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#10b981,#06b6d4);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:14px;box-shadow:0 4px 15px rgba(16,185,129,0.4);cursor:pointer;border:2px solid rgba(255,255,255,0.3);';
      el.textContent = (i + 1).toString();
      const marker = new mapboxgl.Marker(el)
        .setLngLat(m.coords)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<strong>${m.label}</strong>`))
        .addTo(this.map);
      this.currentMarkers.push(marker);
    });
  }
}

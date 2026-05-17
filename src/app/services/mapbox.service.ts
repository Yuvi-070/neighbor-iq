import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

export interface GeoResult {
  id: string;
  name: string;
  fullName: string;
  coords: [number, number]; // [lng, lat]
  type: string;
}

@Injectable({ providedIn: 'root' })
export class MapboxService {
  private token = environment.mapboxToken;
  private geocodeUrl = environment.mapboxGeocodingUrl;

  async searchPlaces(query: string): Promise<GeoResult[]> {
    if (!query || query.length < 2) return [];
    const url = `${this.geocodeUrl}/${encodeURIComponent(query)}.json?access_token=${this.token}&types=place,locality,neighborhood,district&limit=6&language=en`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.features || []).map((f: any) => ({
      id: f.id,
      name: f.text,
      fullName: f.place_name,
      coords: f.center as [number, number],
      type: f.place_type?.[0] || 'place'
    }));
  }

  async reverseGeocode(lng: number, lat: number): Promise<string> {
    const url = `${this.geocodeUrl}/${lng},${lat}.json?access_token=${this.token}&types=place,locality&limit=1`;
    const res = await fetch(url);
    if (!res.ok) return 'Unknown location';
    const data = await res.json();
    return data.features?.[0]?.place_name || 'Unknown location';
  }

  getToken(): string {
    return this.token;
  }
}

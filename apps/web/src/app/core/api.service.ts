import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';

const API = 'http://localhost:3009/api';
const KEY = 'rele_token';
const USER = 'rele_user';

export type User = { id: string; email: string; name: string; role: string };
export type Reading = {
  id: string;
  code: string;
  period: string;
  kwh: number;
  costEur?: number | null;
  notes: string;
  advisorNote: string;
  status: string;
  home?: { label: string; address: string; cups: string };
  resident?: { name: string; email: string };
  advisor?: { name: string } | null;
  createdAt: string;
};

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  private headers() {
    const t = localStorage.getItem(KEY);
    return t ? new HttpHeaders({ Authorization: `Bearer ${t}` }) : undefined;
  }

  login(email: string, password: string) {
    return this.http
      .post<{ accessToken: string; user: User }>(`${API}/auth/login`, { email, password })
      .pipe(
        tap((r) => {
          localStorage.setItem(KEY, r.accessToken);
          localStorage.setItem(USER, JSON.stringify(r.user));
        }),
      );
  }

  logout() {
    localStorage.removeItem(KEY);
    localStorage.removeItem(USER);
  }

  user(): User | null {
    const raw = localStorage.getItem(USER);
    return raw ? (JSON.parse(raw) as User) : null;
  }

  token() {
    return localStorage.getItem(KEY);
  }

  list() {
    return this.http.get<Reading[]>(`${API}/readings`, { headers: this.headers() });
  }

  stats() {
    return this.http.get<{
      total: number;
      open: number;
      byStatus: Record<string, number>;
      kwhTotal: number;
    }>(`${API}/readings/stats/summary`, { headers: this.headers() });
  }

  get(id: string) {
    return this.http.get<Reading>(`${API}/readings/${id}`, { headers: this.headers() });
  }

  create(body: { period: string; kwh: number; costEur?: number; notes?: string }) {
    return this.http.post<Reading>(`${API}/readings`, body, { headers: this.headers() });
  }

  patchStatus(id: string, status: string, advisorNote?: string) {
    return this.http.patch<Reading>(
      `${API}/readings/${id}/status`,
      { status, advisorNote },
      { headers: this.headers() },
    );
  }
}

import { DecimalPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService, Reading } from '../../core/api.service';

@Component({
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  template: `
    <header class="border-b border-border bg-surface">
      <div class="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <a routerLink="/lecturas" class="font-display text-xl font-extrabold text-ink">RELE</a>
        <div class="flex items-center gap-4 text-sm">
          <span class="font-semibold text-ink-muted">{{ userName }} · {{ role }}</span>
          @if (role === 'RESIDENT') {
            <a
              routerLink="/lecturas/nueva"
              class="rounded-full bg-sea px-4 py-2 text-xs font-bold text-white"
              >Nueva lectura</a
            >
          }
          <button class="font-bold text-ink" (click)="logout()">Salir</button>
        </div>
      </div>
    </header>
    <main class="mx-auto max-w-5xl px-4 py-8">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="font-display text-3xl font-extrabold text-ink">Lecturas</h1>
          <p class="text-sm text-ink-muted">
            {{ role === 'ADVISOR' ? 'Cola de revisión energética' : 'Tu histórico de contador' }}
          </p>
        </div>
        @if (stats) {
          <div class="flex gap-2">
            <div class="rounded-xl border border-border bg-surface px-4 py-2 text-center">
              <p class="text-[10px] font-bold text-ink-muted">TOTAL</p>
              <p class="text-lg font-extrabold">{{ stats.total }}</p>
            </div>
            <div class="rounded-xl border border-border bg-surface px-4 py-2 text-center">
              <p class="text-[10px] font-bold text-ink-muted">ABIERTAS</p>
              <p class="text-lg font-extrabold text-coral">{{ stats.open }}</p>
            </div>
            <div class="rounded-xl border border-border bg-sea-soft px-4 py-2 text-center">
              <p class="text-[10px] font-bold text-ink-muted">kWh Σ</p>
              <p class="text-lg font-extrabold text-sea">{{ stats.kwhTotal | number: '1.0-0' }}</p>
            </div>
          </div>
        }
      </div>

      @if (error) {
        <div class="mt-6 rounded-2xl border border-coral/40 bg-coral-soft p-6">
          <p class="font-bold text-ink">No se pudieron cargar las lecturas</p>
          <p class="mt-1 text-sm text-ink-muted">{{ error }}</p>
          <button
            class="mt-3 rounded-full bg-ink px-4 py-2 text-sm font-bold text-white"
            (click)="load()"
          >
            Reintentar
          </button>
        </div>
      } @else if (!loading && items.length === 0) {
        <div class="mt-10 rounded-2xl border border-border bg-surface p-12 text-center">
          <h2 class="font-display text-2xl font-bold">Sin lecturas todavía</h2>
          <p class="mt-2 text-ink-muted">Cuando registres un periodo, aparecerá aquí.</p>
          @if (role === 'RESIDENT') {
            <a
              routerLink="/lecturas/nueva"
              class="mt-6 inline-flex rounded-full bg-sea px-5 py-3 text-sm font-bold text-white"
              >Registrar lectura</a
            >
          }
        </div>
      } @else {
        <ul class="mt-6 space-y-3">
          @for (r of items; track r.id) {
            <li>
              <a
                [routerLink]="['/lecturas', r.id]"
                class="flex items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4 hover:border-sea"
              >
                <div>
                  <p class="text-[11px] font-bold tracking-wide text-sea">{{ r.code }}</p>
                  <p class="font-bold text-ink">
                    {{ r.period }} · {{ r.kwh }} kWh
                    @if (r.costEur != null) {
                      <span class="font-normal text-ink-muted"> · {{ r.costEur }} €</span>
                    }
                  </p>
                  <p class="text-sm text-ink-muted">
                    {{ r.home?.label || 'Vivienda' }}
                    @if (role === 'ADVISOR' && r.resident) {
                      · {{ r.resident.name }}
                    }
                  </p>
                </div>
                <span class="rounded-full px-3 py-1 text-xs font-bold" [class]="badge(r.status)">{{
                  r.status
                }}</span>
              </a>
            </li>
          }
        </ul>
      }
    </main>
  `,
})
export class ReadingsPage implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  items: Reading[] = [];
  stats: {
    total: number;
    open: number;
    byStatus: Record<string, number>;
    kwhTotal: number;
  } | null = null;
  loading = true;
  error = '';
  userName = this.api.user()?.name || 'Usuario';
  role = this.api.user()?.role || '';

  ngOnInit() {
    if (!this.api.token()) {
      this.router.navigateByUrl('/login');
      return;
    }
    this.load();
  }

  load() {
    this.loading = true;
    this.error = '';
    this.api.list().subscribe({
      next: (rows) => {
        this.items = rows;
        this.loading = false;
      },
      error: () => {
        this.error = 'Sesión o red. Vuelve a entrar si el token expiró.';
        this.loading = false;
      },
    });
    this.api.stats().subscribe({ next: (s) => (this.stats = s) });
  }

  badge(s: string) {
    if (s === 'SUBMITTED') return 'bg-primary-soft text-ink';
    if (s === 'REVIEWED') return 'bg-sea text-white';
    if (s === 'FLAGGED') return 'bg-coral text-white';
    return 'bg-bg text-ink-muted';
  }

  logout() {
    this.api.logout();
    this.router.navigateByUrl('/login');
  }
}

import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <main class="mx-auto max-w-xl px-4 py-10">
      <a routerLink="/lecturas" class="text-sm font-bold text-sea">← Lecturas</a>
      <h1 class="mt-4 font-display text-3xl font-extrabold text-ink">Nueva lectura</h1>
      <p class="mt-2 text-ink-muted">Solo residentes. Se envía como SUBMITTED al asesor.</p>
      <form class="mt-8 space-y-4" (ngSubmit)="submit()">
        <label class="block">
          <span class="text-xs font-bold text-ink-muted">Periodo (YYYY-MM)</span>
          <input
            class="mt-1 w-full rounded-xl border border-border px-4 py-3"
            [(ngModel)]="period"
            name="period"
            required
            placeholder="2026-08"
          />
        </label>
        <label class="block">
          <span class="text-xs font-bold text-ink-muted">kWh</span>
          <input
            type="number"
            step="0.1"
            class="mt-1 w-full rounded-xl border border-border px-4 py-3"
            [(ngModel)]="kwh"
            name="kwh"
            required
          />
        </label>
        <label class="block">
          <span class="text-xs font-bold text-ink-muted">Coste € (opcional)</span>
          <input
            type="number"
            step="0.01"
            class="mt-1 w-full rounded-xl border border-border px-4 py-3"
            [(ngModel)]="costEur"
            name="costEur"
          />
        </label>
        <label class="block">
          <span class="text-xs font-bold text-ink-muted">Notas</span>
          <textarea
            rows="3"
            class="mt-1 w-full rounded-xl border border-border px-4 py-3"
            [(ngModel)]="notes"
            name="notes"
          ></textarea>
        </label>
        @if (error) {
          <p class="text-sm text-coral">{{ error }}</p>
        }
        <button
          type="submit"
          [disabled]="loading"
          class="rounded-full bg-sea px-6 py-3.5 text-sm font-bold text-white disabled:opacity-50"
        >
          {{ loading ? 'Enviando…' : 'Enviar lectura' }}
        </button>
      </form>
    </main>
  `,
})
export class ReadingNewPage {
  private api = inject(ApiService);
  private router = inject(Router);
  period = new Date().toISOString().slice(0, 7);
  kwh: number | null = null;
  costEur: number | null = null;
  notes = '';
  loading = false;
  error = '';

  constructor() {
    if (!this.api.token()) this.router.navigateByUrl('/login');
    if (this.api.user()?.role !== 'RESIDENT') this.router.navigateByUrl('/lecturas');
  }

  submit() {
    if (this.kwh == null) return;
    this.loading = true;
    this.error = '';
    this.api
      .create({
        period: this.period,
        kwh: Number(this.kwh),
        costEur: this.costEur != null ? Number(this.costEur) : undefined,
        notes: this.notes,
      })
      .subscribe({
        next: (r) => {
          this.loading = false;
          this.router.navigate(['/lecturas', r.id]);
        },
        error: (e) => {
          this.loading = false;
          this.error = e?.error?.message || 'No se pudo crear la lectura';
        },
      });
  }
}

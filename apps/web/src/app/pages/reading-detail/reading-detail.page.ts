import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService, Reading } from '../../core/api.service';

@Component({
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <main class="mx-auto max-w-2xl px-4 py-10">
      <a routerLink="/lecturas" class="text-sm font-bold text-sea">← Lecturas</a>
      @if (item) {
        <p class="mt-6 text-xs font-bold tracking-wide text-sea">{{ item.code }}</p>
        <h1 class="font-display text-3xl font-extrabold text-ink">{{ item.period }}</h1>
        <p class="mt-1 text-ink-muted">{{ item.home?.label }} · {{ item.home?.cups }}</p>
        <div class="mt-6 grid gap-3 sm:grid-cols-3">
          <div class="rounded-2xl border border-border p-4">
            <p class="text-[11px] font-bold text-ink-muted">kWh</p>
            <p class="text-xl font-extrabold text-ink">{{ item.kwh }}</p>
          </div>
          <div class="rounded-2xl border border-border p-4">
            <p class="text-[11px] font-bold text-ink-muted">COSTE</p>
            <p class="text-xl font-extrabold text-ink">
              {{ item.costEur != null ? item.costEur + ' €' : '—' }}
            </p>
          </div>
          <div class="rounded-2xl border border-border p-4">
            <p class="text-[11px] font-bold text-ink-muted">ESTADO</p>
            <p class="text-xl font-extrabold text-ink">{{ item.status }}</p>
          </div>
        </div>
        @if (item.notes) {
          <div class="mt-4 rounded-2xl border border-border p-4">
            <p class="text-[11px] font-bold text-ink-muted">NOTAS RESIDENTE</p>
            <p class="mt-1">{{ item.notes }}</p>
          </div>
        }
        @if (item.advisorNote) {
          <div class="mt-4 rounded-2xl border border-sea/30 bg-sea-soft p-4">
            <p class="text-[11px] font-bold text-sea">NOTA ASESOR</p>
            <p class="mt-1">{{ item.advisorNote }}</p>
          </div>
        }
        @if (isAdvisor) {
          <div class="mt-6 space-y-3">
            <label class="block">
              <span class="text-xs font-bold text-ink-muted">Nota del asesor</span>
              <textarea
                rows="2"
                class="mt-1 w-full rounded-xl border border-border px-4 py-3"
                [(ngModel)]="advisorNote"
                name="advisorNote"
              ></textarea>
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                class="rounded-full bg-sea px-4 py-2 text-sm font-bold text-white"
                (click)="set('REVIEWED')"
              >
                Marcar REVIEWED
              </button>
              <button
                class="rounded-full bg-coral px-4 py-2 text-sm font-bold text-white"
                (click)="set('FLAGGED')"
              >
                Marcar FLAGGED
              </button>
            </div>
          </div>
        }
      }
    </main>
  `,
})
export class ReadingDetailPage implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  item: Reading | null = null;
  isAdvisor = this.api.user()?.role === 'ADVISOR';
  advisorNote = '';

  ngOnInit() {
    if (!this.api.token()) {
      this.router.navigateByUrl('/login');
      return;
    }
    const id = this.route.snapshot.paramMap.get('id')!;
    this.api.get(id).subscribe({
      next: (r) => {
        this.item = r;
        this.advisorNote = r.advisorNote || '';
      },
    });
  }

  set(status: string) {
    if (!this.item) return;
    this.api.patchStatus(this.item.id, status, this.advisorNote).subscribe({
      next: (r) => (this.item = r),
    });
  }
}

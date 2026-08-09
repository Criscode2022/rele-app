import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="grid min-h-screen md:grid-cols-2">
      <div class="flex flex-col justify-center bg-ink px-10 py-16 text-white">
        <p class="text-xs font-bold tracking-[0.16em] text-sea">RELE · ACCESO</p>
        <h1 class="mt-4 font-display text-4xl font-extrabold leading-tight">
          Panel de lecturas del hogar
        </h1>
        <p class="mt-4 text-white/70">Residente envía kWh. Asesor valida y anota.</p>
      </div>
      <div class="flex flex-col justify-center px-8 py-16 sm:px-16">
        <a routerLink="/" class="mb-8 text-sm font-semibold text-ink-muted">← Inicio</a>
        <h2 class="font-display text-2xl font-bold">Iniciar sesión</h2>
        <form class="mt-6 space-y-4" (ngSubmit)="submit()">
          <label class="block">
            <span class="text-xs font-bold text-ink-muted">Email</span>
            <input
              type="email"
              class="mt-1 w-full rounded-xl border border-border px-4 py-3"
              [(ngModel)]="email"
              name="email"
              required
            />
          </label>
          <label class="block">
            <span class="text-xs font-bold text-ink-muted">Contraseña</span>
            <input
              type="password"
              class="mt-1 w-full rounded-xl border border-border px-4 py-3"
              [(ngModel)]="password"
              name="password"
              required
            />
          </label>
          @if (error) {
            <p class="text-sm text-coral">{{ error }}</p>
          }
          <button type="submit" class="w-full rounded-full bg-sea py-3.5 text-sm font-bold text-white">
            Entrar
          </button>
        </form>
        <p class="mt-4 text-xs text-ink-muted">
          casa&#64;rele.energy · asesor&#64;rele.energy · password123
        </p>
      </div>
    </div>
  `,
})
export class LoginPage {
  private api = inject(ApiService);
  private router = inject(Router);
  email = 'casa@rele.energy';
  password = 'password123';
  error = '';

  submit() {
    this.error = '';
    this.api.login(this.email, this.password).subscribe({
      next: () => this.router.navigateByUrl('/lecturas'),
      error: () => (this.error = 'Credenciales inválidas'),
    });
  }
}

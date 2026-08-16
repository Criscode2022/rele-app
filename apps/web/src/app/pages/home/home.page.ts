import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="border-b border-border bg-surface/95 sticky top-0 z-10">
      <div class="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 sm:px-6">
        <a routerLink="/" class="font-display text-2xl font-extrabold tracking-tight text-ink">RELE</a>
        <div class="flex items-center gap-3">
          <a routerLink="/login" class="text-sm font-semibold text-ink-muted hover:text-ink">Entrar</a>
          <a routerLink="/login" class="rounded-full bg-sea px-5 py-2.5 text-sm font-bold text-white hover:bg-sea-strong">Abrir panel</a>
        </div>
      </div>
    </header>

    <section class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p class="text-xs font-bold tracking-[0.16em] text-sea">ENERGÍA · HOGAR</p>
      <p class="mt-6 font-display text-[clamp(4.5rem,12vw,9rem)] font-extrabold leading-none tracking-tight text-ink">
        428<span class="text-sea"> kWh</span>
      </p>
      <p class="mt-2 text-sm font-semibold text-ink-muted">Lectura de abril · casa de ejemplo</p>
      <h1 class="mt-8 max-w-2xl font-display text-3xl font-extrabold text-ink md:text-4xl">El consumo, a la vista.</h1>
      <p class="mt-3 max-w-xl text-lg text-ink-muted">
        Lecturas de contador y revisión del asesor energético en un solo panel. Sin Excel sueltos ni capturas por WhatsApp.
      </p>
      <div class="mt-8 flex flex-wrap gap-3">
        <a routerLink="/login" class="rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-white">Soy residente</a>
        <a routerLink="/login" class="rounded-full border border-border bg-surface px-6 py-3.5 text-sm font-bold text-ink">Soy asesor</a>
      </div>
    </section>

    <img src="assets/hero.jpg" alt="Contador y entorno doméstico de energía" class="h-40 w-full object-cover md:h-52" />

    <section class="border-y border-border bg-primary-soft/40">
      <div class="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 class="font-display text-3xl font-bold text-ink">Cómo funciona</h2>
        <div class="mt-8 grid gap-4 md:grid-cols-3">
          <article class="rounded-2xl border border-border bg-surface p-6">
            <p class="text-xs font-bold text-sea">01</p>
            <h3 class="mt-2 font-bold">Registras la lectura</h3>
            <p class="mt-2 text-sm text-ink-muted">Periodo, kWh y coste estimado de la factura.</p>
          </article>
          <article class="rounded-2xl border border-border bg-surface p-6">
            <p class="text-xs font-bold text-sea">02</p>
            <h3 class="mt-2 font-bold">El asesor revisa</h3>
            <p class="mt-2 text-sm text-ink-muted">Marca REVIEWED o FLAGGED con una nota.</p>
          </article>
          <article class="rounded-2xl border border-border bg-surface p-6">
            <p class="text-xs font-bold text-sea">03</p>
            <h3 class="mt-2 font-bold">Ves el histórico</h3>
            <p class="mt-2 text-sm text-ink-muted">kWh acumulados y estados claros.</p>
          </article>
        </div>
      </div>
    </section>

    <footer class="bg-ink text-white">
      <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p class="font-display text-xl font-bold">RELE</p>
        <p class="mt-2 text-sm text-white/70">Demo: casa&#64;rele.energy / asesor&#64;rele.energy · password123 · API :3009</p>
      </div>
    </footer>
  `,
})
export class HomePage {}

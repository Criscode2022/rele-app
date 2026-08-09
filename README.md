# RELE

Consumo energético del hogar — lecturas kWh multi-rol **RESIDENT + ADVISOR**.

> El consumo, a la vista.

## Stack

Angular · NestJS · Prisma · Neon · Tailwind · JWT

## Arranque

```bash
cp apps/api/.env.example apps/api/.env
npm install --prefix apps/api && npm install --prefix apps/web
npm --prefix apps/api run prisma:migrate
npm --prefix apps/api run prisma:seed
npm run api   # :3009
npm run web   # :4200
```

## Demo

| Rol | Email | Password |
|-----|-------|----------|
| Residente | casa@rele.energy | password123 |
| Asesor | asesor@rele.energy | password123 |

## Case / diseño

- Case: `ux-projects/2026-08-09-rele/`
- Paper: https://app.paper.design/file/01KZJNCCMJ1FDHHPZZ923RWDWY
- Neon: sparkling-snow-59844541

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.reading.deleteMany();
  await prisma.home.deleteMany();
  await prisma.user.deleteMany();
  const hash = await bcrypt.hash('password123', 10);
  const resident = await prisma.user.create({
    data: {
      email: 'casa@rele.energy',
      passwordHash: hash,
      name: 'Elena Marín',
      role: 'RESIDENT',
    },
  });
  const advisor = await prisma.user.create({
    data: {
      email: 'asesor@rele.energy',
      passwordHash: hash,
      name: 'Toni Gil',
      role: 'ADVISOR',
    },
  });
  const home = await prisma.home.create({
    data: {
      label: 'Piso Ruzafa',
      address: 'C/ Sueca 18, 3º · València',
      cups: 'ES0021000000000001AB',
      residentId: resident.id,
    },
  });
  await prisma.reading.createMany({
    data: [
      {
        code: 'RE-0809-01',
        period: '2026-07',
        kwh: 212,
        costEur: 48.6,
        notes: 'Julio con AC',
        status: 'REVIEWED',
        homeId: home.id,
        residentId: resident.id,
        advisorId: advisor.id,
        advisorNote: 'Pico coherente con ola de calor.',
      },
      {
        code: 'RE-0809-02',
        period: '2026-06',
        kwh: 168,
        costEur: 39.2,
        notes: '',
        status: 'REVIEWED',
        homeId: home.id,
        residentId: resident.id,
        advisorId: advisor.id,
        advisorNote: 'Dentro de rango.',
      },
      {
        code: 'RE-0809-03',
        period: '2026-08',
        kwh: 245,
        costEur: 56.1,
        notes: 'Lectura contador 14 ago',
        status: 'SUBMITTED',
        homeId: home.id,
        residentId: resident.id,
      },
      {
        code: 'RE-0809-04',
        period: '2026-05',
        kwh: 141,
        costEur: 33.4,
        status: 'FLAGGED',
        homeId: home.id,
        residentId: resident.id,
        advisorId: advisor.id,
        advisorNote: 'Revisar tarifa PVPC vs fija.',
        notes: '',
      },
      {
        code: 'RE-0809-05',
        period: '2026-04',
        kwh: 155,
        costEur: 36.0,
        status: 'SUBMITTED',
        homeId: home.id,
        residentId: resident.id,
        notes: 'Sin calefacción',
      },
    ],
  });
  console.log('RELE seed OK');
}

main().finally(() => prisma.$disconnect());

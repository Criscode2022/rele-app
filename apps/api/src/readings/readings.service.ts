import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ReadingStatus, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReadingsService {
  constructor(private prisma: PrismaService) {}

  private code() {
    const n = Math.floor(100 + Math.random() * 900);
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `RE-${mm}${dd}-${n}`;
  }

  list(userId: string, role: Role) {
    if (role === 'ADVISOR') {
      return this.prisma.reading.findMany({
        include: { home: true, resident: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      });
    }
    return this.prisma.reading.findMany({
      where: { residentId: userId },
      include: { home: true, advisor: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async get(id: string, userId: string, role: Role) {
    const r = await this.prisma.reading.findUnique({
      where: { id },
      include: {
        home: true,
        resident: { select: { id: true, name: true, email: true } },
        advisor: { select: { id: true, name: true } },
      },
    });
    if (!r) throw new NotFoundException();
    if (role === 'RESIDENT' && r.residentId !== userId) throw new ForbiddenException();
    return r;
  }

  async create(
    userId: string,
    role: Role,
    data: { period: string; kwh: number; costEur?: number; notes?: string; homeLabel?: string },
  ) {
    if (role !== 'RESIDENT') throw new ForbiddenException();
    let home = await this.prisma.home.findFirst({ where: { residentId: userId } });
    if (!home) {
      home = await this.prisma.home.create({
        data: {
          label: data.homeLabel || 'Mi vivienda',
          address: '—',
          cups: 'ES0000000000000000XX',
          residentId: userId,
        },
      });
    }
    return this.prisma.reading.create({
      data: {
        code: this.code(),
        period: data.period,
        kwh: data.kwh,
        costEur: data.costEur,
        notes: data.notes || '',
        status: 'SUBMITTED',
        homeId: home.id,
        residentId: userId,
      },
      include: { home: true },
    });
  }

  async updateStatus(
    id: string,
    userId: string,
    role: Role,
    status: ReadingStatus,
    advisorNote?: string,
  ) {
    if (role !== 'ADVISOR') throw new ForbiddenException();
    await this.get(id, userId, role);
    return this.prisma.reading.update({
      where: { id },
      data: {
        status,
        advisorId: userId,
        advisorNote: advisorNote ?? undefined,
      },
      include: { home: true, resident: { select: { name: true, email: true } } },
    });
  }

  async summary(userId: string, role: Role) {
    const where = role === 'RESIDENT' ? { residentId: userId } : {};
    const rows = await this.prisma.reading.groupBy({ by: ['status'], where, _count: true });
    const byStatus = Object.fromEntries(
      (['DRAFT', 'SUBMITTED', 'REVIEWED', 'FLAGGED'] as ReadingStatus[]).map((s) => [s, 0]),
    ) as Record<ReadingStatus, number>;
    for (const r of rows) byStatus[r.status] = r._count;
    const total = Object.values(byStatus).reduce((a, b) => a + b, 0);
    const open = byStatus.SUBMITTED + byStatus.FLAGGED;
    const kwhAgg = await this.prisma.reading.aggregate({ where, _sum: { kwh: true } });
    return { total, open, byStatus, kwhTotal: kwhAgg._sum.kwh || 0 };
  }
}

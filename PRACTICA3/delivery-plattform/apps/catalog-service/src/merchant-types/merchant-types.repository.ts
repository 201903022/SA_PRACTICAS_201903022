import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IMerchantTypesRepository } from './interfaces/IMerchant-types.repo.inteface';
import { MerchantTypesRow } from './interfaces/merchant-type-row.interface';

@Injectable()
export class MerchantTypesRepository implements IMerchantTypesRepository {
  private readonly logger = new Logger(MerchantTypesRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<MerchantTypesRow[]> {
    this.logger.debug('Repository merchant types');
    const result = await this.prisma.merchant_types.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
      },
    });

    if (!result || result.length === 0) {
      console.warn('No merchant types found in the database.');
      return [];
    }
    this.logger.debug(`Found ${result.length} merchant types in the database.`);
    return result.map((r) => ({
      id: r.id,
      code: r.code,
      name: r.name,
      description: r.description ?? '',
    }));
  }

  async findById(id: string): Promise<MerchantTypesRow | null> {
    this.logger.debug(`Finding merchant type with id: ${id}`);
    const row = await this.prisma.merchant_types.findUnique({
      where: { id },
      select: { id: true, code: true, name: true, description: true },
    });
    return row ? { ...row, description: row.description ?? '' } : null;
  }
}

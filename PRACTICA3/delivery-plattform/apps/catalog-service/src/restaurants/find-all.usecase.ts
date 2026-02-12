import { Injectable, Logger } from '@nestjs/common';
import { RestaurantsRepository } from './restaurants.repository';
import { RestaurantsMapper } from './restaurants.mapper';

@Injectable()
export class ListRestaurantsUseCase {
  private readonly logger = new Logger(ListRestaurantsUseCase.name);
  constructor(private readonly repo: RestaurantsRepository) {}

  async execute(input: {
    onlyActive?: boolean;
    limit?: number;
    offset?: number;
  }) {
    this.logger.debug(`Executing with input: ${JSON.stringify(input)}`);
    const limit = Math.min(Math.max(input.limit ?? 20, 1), 100);
    const offset = Math.max(input.offset ?? 0, 0);

    const rows = await this.repo.findAll({
      onlyActive: input.onlyActive ?? true,
      limit,
      offset,
    });

    return {
      restaurants: rows.map(RestaurantsMapper.toDto),
    };
  }
}

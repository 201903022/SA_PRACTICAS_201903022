import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CatalogGrpcService } from './catalog.grpc';
import { MerchantGuard } from '../guards/MerchantOperation.guard';
import { CreateCompanyDto } from './dto/create-company.dto';
import { toBool, toInt } from './utils/helper';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
type RequestWithUser = {
  user: { id: string; role: string; email: string; name?: string };
};

type CompaneyResponse = {
  found: boolean;
  restaurant?: {
    id: string;
    name: string;
    address: string;
    phone: string;
    alias: string;
    openingHours: string;
    isActive: boolean;
    merchantTypeId: string;
  };
};
@Controller('catalog')
export class CatalogController {
  private readonly logger = new Logger(CatalogController.name);
  constructor(private readonly catalogGrpc: CatalogGrpcService) {}

  @Get('health')
  health() {
    return this.catalogGrpc.health();
  }

  @UseGuards(MerchantGuard)
  @Get('my/company')
  async getMyCompany(@Req() req: RequestWithUser): Promise<CompaneyResponse> {
    console.log(req.user);
    const ownerUserId = req.user.id;
    const onlyActive = true;

    return this.catalogGrpc.getRestaurantByOwnerId({
      ownerUserId,
      onlyActive,
    });
  }

  @UseGuards(MerchantGuard)
  @Post('my/company')
  async createOrUpdateCompany(
    @Req() req: RequestWithUser,
    @Body() body: CreateCompanyDto,
  ) {
    console.log('Create Company controller hit');

    return this.catalogGrpc.createCompany({
      ownerUserId: req.user.id,
      name: body.name,
      address: body.address,
      phone: body.phone ?? '',
      alias: body.alias ?? '',
      openingHours: body.openingHours ?? '',
      merchantTypeId: body.merchantTypeId,
    });
  }

  @Get('merchant-types')
  async listMerchantTypes() {
    console.log('Merchant Types @Get');
    return this.catalogGrpc.listMerchantTypes();
  }
  @Get('restaurants/menu-items')
  async listMenuItemsByRestaurant(
    @Query('restaurantId') restaurantId: string,
    @Query('onlyAvailable') onlyAvailable?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    // defaults + clamp
    this.logger.debug(
      `Query params - restaurantId: ${restaurantId}, onlyAvailable: ${onlyAvailable}, limit: ${limit}, offset: ${offset}`,
    );
    const onlyAvail = toBool(onlyAvailable, false);
    const take = toInt(limit, 20, 1, 100);
    const skip = toInt(offset, 0, 0, 10_000);

    return this.catalogGrpc.listMenuItemsByRestaurant({
      restaurantId,
      onlyAvailable: onlyAvail,
      limit: take,
      offset: skip,
    });
  }

  @UseGuards(MerchantGuard)
  @Get('my/company/menu-items')
  async listMyCompanyMenuItems(@Req() req: RequestWithUser) {
    const ownerUserId = req.user.id;
    this.logger.debug(`Listing menu items for ownerUserId: ${ownerUserId}`);
    const restaurant = await this.catalogGrpc.getRestaurantByOwnerId({
      ownerUserId,
      onlyActive: false,
    });

    if (!restaurant.found || !restaurant.restaurant) {
      this.logger.warn(`No restaurant found for ownerUserId: ${ownerUserId}`);
      return { items: [] };
    }

    const restaurantId = restaurant.restaurant.id;
    this.logger.debug(
      `Found restaurant with ID: ${restaurantId} for ownerUserId: ${ownerUserId}`,
    );
    return this.catalogGrpc.listMenuItemsByRestaurant({
      restaurantId,
      onlyAvailable: false,
      limit: 20,
      offset: 0,
    });
  }

  @UseGuards(MerchantGuard)
  @Post('my/company/menu-items')
  async createMenuItem(
    @Req() req: RequestWithUser,
    @Body() body: CreateMenuItemDto,
  ) {
    const ownerUserId = req.user.id;

    this.logger.debug(
      `Creating menu item ownerUserId=${ownerUserId} name=${body.name} price=${body.price}`,
    );

    try {
      return await this.catalogGrpc.createMenuItem({
        ownerUserId,
        name: body.name,
        description: body.description ?? '',
        price: body.price,
        currency: body.currency ?? 'GTQ',
        isAvailable: body.isAvailable ?? true,
        categoryIds: body.categoryIds ?? [],
      });
    } catch (e: any) {
      // si quieres mapear errores gRPC a HTTP 400/404:
      throw new BadRequestException(e?.message ?? 'Failed to create menu item');
    }
  }

  @Get('restaurants')
  async listRestaurants(
    @Query('search') search?: string,
    @Query('merchantTypeId') merchantTypeId?: string,
    @Query('onlyActive') onlyActive?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const onlyAvail = toBool(onlyActive, false);
    const take = toInt(limit, 20, 1, 100);
    const skip = toInt(offset, 0, 0, 10_000);

    return this.catalogGrpc.listRestaurants({
      onlyActive: onlyAvail,
      limit: take,
      offset: skip,
    });
  }

  @Get('menu-all-items')
  async getMenuAllItems() {
    const restaurantsRes = await this.catalogGrpc.listRestaurants({
      onlyActive: true,
      limit: 100,
      offset: 0,
    });

    const restaurants = restaurantsRes.restaurants ?? [];

    const menus = await Promise.all(
      restaurants.map(async (r) => {
        const itemsRes = await this.catalogGrpc.listMenuItemsByRestaurant({
          restaurantId: r.id,
          onlyAvailable: true,
          limit: 100,
          offset: 0,
        });

        return {
          restaurant: r,
          items: itemsRes.items ?? [],
        };
      }),
    );

    return { menus };
  }
}

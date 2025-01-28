import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Post()
  create(@Body() createServiceDto: CreateServiceDto, @Req() req: any) {
    const user = req.user; // Adăugat din middleware
    return this.servicesService.create(createServiceDto, user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @Req() req: any,
  ) {
    const user = req.user;
    return this.servicesService.update(id, updateServiceDto, user.id);
  }

  @Get('category/:categoryId')
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.servicesService.findByCategory(categoryId);
  }

  @Get('category/name/:categoryName')
  findByCategoryName(@Param('categoryName') categoryName: string) {
    const decodedCategoryName = decodeURIComponent(categoryName);
    return this.servicesService.findByCategoryName(decodedCategoryName);
  }

  @Get('provider/:providerId')
  async getServicesByProviderId(@Param('providerId') providerId: string) {
    return this.servicesService.getServicesByProviderId(providerId);
  }
}

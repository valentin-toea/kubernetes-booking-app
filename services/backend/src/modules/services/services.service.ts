import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  findAll(): Promise<Service[]> {
    return this.serviceRepository.find();
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }

  async create(
    createServiceDto: CreateServiceDto,
    userId: string,
  ): Promise<Service> {
    const { categoryId, ...otherFields } = createServiceDto;

    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    const service = this.serviceRepository.create({
      ...otherFields,
      category,
      providerId: userId,
    });

    return this.serviceRepository.save(service);
  }

  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
    providerId: string,
  ): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id, providerId },
    });
    if (!service) {
      throw new NotFoundException('Service not found or unauthorized');
    }
    Object.assign(service, updateServiceDto);
    return this.serviceRepository.save(service);
  }

  async findByCategory(categoryId: string): Promise<Service[]> {
    const services = await this.serviceRepository.find({
      where: { category: { id: categoryId } },
      relations: ['category'],
    });

    if (services.length === 0) {
      throw new NotFoundException(
        `No services found for category with ID ${categoryId}`,
      );
    }

    return services;
  }

  async findByCategoryName(categoryName: string): Promise<Service[]> {
    const category = await this.categoryRepository.findOne({
      where: { name: ILike(categoryName) },
    });

    if (!category) {
      throw new NotFoundException(
        `Category with name "${categoryName}" not found`,
      );
    }

    const services = await this.serviceRepository.find({
      where: { category: { id: category.id } },
      relations: ['category'],
    });

    if (services.length === 0) {
      throw new NotFoundException(
        `No services found for category "${categoryName}"`,
      );
    }

    return services;
  }

  async getServicesByProviderId(providerId: string): Promise<Service[]> {
    return this.serviceRepository.find({
      where: { providerId },
      relations: ['category'],
    });
  }
}

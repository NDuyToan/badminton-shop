import { Controller, Get, Post } from '@nestjs/common';

import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesClass {
  constructor(private readonly categoriesService: CategoriesService) {}
  @Post()
  create(): string {
    return this.categoriesService.create();
  }
  @Get()
  findAll(): string {
    return this.categoriesService.findAll();
  }
}

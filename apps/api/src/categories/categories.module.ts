import { CategoriesClass } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [CategoriesClass],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}

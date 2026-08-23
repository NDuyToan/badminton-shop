import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesService {
  constructor() {}

  create() {
    return 'create category';
  }
  findAll() {
    return 'get all category...';
  }
}

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';


@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.prisma.category.create({
        data: createCategoryDto,
      })
      return category
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(`Category slug '${createCategoryDto.slug}' already exists`)
        }
      }
      throw error
    }
  }

  findAll() {
    return this.prisma.category.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
    })

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`)
    }

    return category
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id)

    try {
      return await this.prisma.category.update({
        where: {
          id,
        },
        data: updateCategoryDto
      })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(`Category slug '${updateCategoryDto.slug}' already exists`)
        }
      }
      throw error
    }


  }

  async remove(id: number) {
    await this.findOne(id)

    return this.prisma.category.delete({
      where: {
        id
      }
    })
  }
}

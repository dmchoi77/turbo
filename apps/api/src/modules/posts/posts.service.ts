import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreatePostDto, UpdatePostDto, QueryPostsDto } from "./dto";
import { PaginatedResult } from "../../common/pagination.dto";
import { Post } from "@prisma/client";

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    return this.prisma.post.create({
      data: createPostDto,
      include: { category: true },
    });
  }

  async findAll(query: QueryPostsDto): Promise<PaginatedResult<Post>> {
    const {
      page = 1,
      limit = 10,
      sortBy,
      sortOrder = "desc",
      published,
      categoryId,
      search,
    } = query;
    const skip = (page - 1) * limit;

    const where = {
      ...(published !== undefined && { published }),
      ...(categoryId && { categoryId }),
      ...(search && {
        OR: [
          { title: { contains: search } },
          { content: { contains: search } },
        ],
      }),
    };

    const orderBy = sortBy ? { [sortBy]: sortOrder } : { createdAt: sortOrder };

    const [data, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: { category: true },
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { category: true, comments: true },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async findBySlug(slug: string): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: { category: true, comments: true },
    });

    if (!post) {
      throw new NotFoundException(`Post with slug "${slug}" not found`);
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    await this.findOne(id);

    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
      include: { category: true },
    });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.post.delete({ where: { id } });
  }
}

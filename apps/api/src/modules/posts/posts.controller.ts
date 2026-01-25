import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { PostsService } from "./posts.service";
import { CreatePostDto, UpdatePostDto, QueryPostsDto } from "./dto";

@ApiTags("posts")
@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new post" })
  @ApiResponse({ status: 201, description: "Post created successfully" })
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all posts with pagination" })
  @ApiResponse({ status: 200, description: "Returns paginated posts" })
  findAll(@Query() query: QueryPostsDto) {
    return this.postsService.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a post by ID" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Returns the post" })
  @ApiResponse({ status: 404, description: "Post not found" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @Get("slug/:slug")
  @ApiOperation({ summary: "Get a post by slug" })
  @ApiParam({ name: "slug", type: String })
  @ApiResponse({ status: 200, description: "Returns the post" })
  @ApiResponse({ status: 404, description: "Post not found" })
  findBySlug(@Param("slug") slug: string) {
    return this.postsService.findBySlug(slug);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a post" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Post updated successfully" })
  @ApiResponse({ status: 404, description: "Post not found" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a post" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 204, description: "Post deleted successfully" })
  @ApiResponse({ status: 404, description: "Post not found" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.postsService.remove(id);
  }
}

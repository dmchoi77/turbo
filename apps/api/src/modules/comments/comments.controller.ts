import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto";

@ApiTags("comments")
@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post("posts/:postId/comments")
  @ApiOperation({ summary: "Add a comment to a post" })
  @ApiParam({ name: "postId", type: Number })
  @ApiResponse({ status: 201, description: "Comment created successfully" })
  @ApiResponse({ status: 404, description: "Post not found" })
  create(
    @Param("postId", ParseIntPipe) postId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(postId, createCommentDto);
  }

  @Get("posts/:postId/comments")
  @ApiOperation({ summary: "Get all comments for a post" })
  @ApiParam({ name: "postId", type: Number })
  @ApiResponse({ status: 200, description: "Returns comments for the post" })
  findByPost(@Param("postId", ParseIntPipe) postId: number) {
    return this.commentsService.findByPost(postId);
  }

  @Get("comments/:id")
  @ApiOperation({ summary: "Get a comment by ID" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Returns the comment" })
  @ApiResponse({ status: 404, description: "Comment not found" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.commentsService.findOne(id);
  }

  @Delete("comments/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a comment" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 204, description: "Comment deleted successfully" })
  @ApiResponse({ status: 404, description: "Comment not found" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.commentsService.remove(id);
  }
}

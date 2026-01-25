import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { PostsModule } from "./modules/posts/posts.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { CommentsModule } from "./modules/comments/comments.module";

@Module({
  imports: [PrismaModule, PostsModule, CategoriesModule, CommentsModule],
})
export class AppModule {}

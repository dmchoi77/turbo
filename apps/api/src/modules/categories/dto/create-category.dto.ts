import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, MinLength, MaxLength } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({ example: "Technology" })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: "technology" })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  slug: string;

  @ApiPropertyOptional({ example: "Posts about technology" })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

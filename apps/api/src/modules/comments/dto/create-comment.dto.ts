import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsEmail,
  MinLength,
  MaxLength,
} from "class-validator";

export class CreateCommentDto {
  @ApiProperty({ example: "Great post!" })
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  content: string;

  @ApiProperty({ example: "John Doe" })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  author: string;

  @ApiPropertyOptional({ example: "john@example.com" })
  @IsOptional()
  @IsEmail()
  email?: string;
}

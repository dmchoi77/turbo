import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsBoolean, IsInt, IsString } from "class-validator";
import { Transform, Type } from "class-transformer";
import { PaginationDto } from "../../../common/pagination.dto";

export class QueryPostsDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === "true")
  @IsBoolean()
  published?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}

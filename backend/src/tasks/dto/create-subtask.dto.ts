import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateSubtaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  dueDate?: string;
}

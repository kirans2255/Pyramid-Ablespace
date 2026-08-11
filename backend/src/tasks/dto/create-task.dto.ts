import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  dueDate?: any;

  @IsOptional()
  @IsArray()
  labels?: string[];

  @IsOptional()
  projectId?: any;

  @IsOptional()
  userId?: any;

  @IsOptional()
  assigneeId?: any;

  @IsOptional()
  isLocked?: boolean;
}

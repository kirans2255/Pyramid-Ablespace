import { IsOptional, IsString, IsArray, IsBoolean } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

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
  @IsBoolean()
  isLocked?: boolean;
}

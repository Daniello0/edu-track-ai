import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { MaterialStatus } from '../../enums/material-status.enum';

/** Payload for updating a material mastery status. */
export class UpdateMaterialStatusDto {
  @ApiProperty({ enum: MaterialStatus, example: MaterialStatus.MASTERED })
  @IsEnum(MaterialStatus)
  status!: MaterialStatus;
}

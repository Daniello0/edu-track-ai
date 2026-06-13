import { ApiProperty } from '@nestjs/swagger';

/** Payload returned by the root health-check endpoint. */
export class HealthResponseDto {
  @ApiProperty({ example: 'ok', description: 'Service health status' })
  status!: string;
}

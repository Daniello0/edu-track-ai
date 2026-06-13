import { Injectable } from '@nestjs/common';
import { HealthResponseDto } from './health-response.dto';

@Injectable()
export class HealthService {
  /**
   * Returns a simple health-check payload for the root endpoint.
   */
  getHealth(): HealthResponseDto {
    return { status: 'ok' };
  }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  /**
   * Returns a simple health-check payload for the root endpoint.
   */
  getHealth(): { status: string } {
    return { status: 'ok' };
  }
}

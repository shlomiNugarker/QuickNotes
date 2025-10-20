import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { PrometheusService } from './prometheus.service';

@Controller()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private prometheusService: PrometheusService,
  ) {}

  @Get('health')
  @HealthCheck()
  check() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }

  @Get('metrics')
  getMetrics() {
    return this.prometheusService.getMetrics();
  }
}

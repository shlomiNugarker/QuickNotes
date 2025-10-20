import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { PrometheusService } from './prometheus.service';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [PrometheusService],
  exports: [PrometheusService],
})
export class HealthModule {}

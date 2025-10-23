import { Injectable } from '@nestjs/common';
import {
  register,
  collectDefaultMetrics,
  Counter,
  Histogram,
} from 'prom-client';

@Injectable()
export class PrometheusService {
  private httpRequestCounter: Counter;
  private httpRequestDuration: Histogram;

  constructor() {
    // Collect default metrics
    collectDefaultMetrics({ register });

    // Custom metrics
    this.httpRequestCounter = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status'],
      registers: [register],
    });

    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status'],
      registers: [register],
    });
  }

  async getMetrics() {
    return register.metrics();
  }

  incrementHttpRequests(method: string, route: string, status: number) {
    this.httpRequestCounter.inc({ method, route, status });
  }

  observeHttpDuration(
    method: string,
    route: string,
    status: number,
    duration: number,
  ) {
    this.httpRequestDuration.observe({ method, route, status }, duration);
  }
}

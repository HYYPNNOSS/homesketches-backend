import { Controller, Get, Head, Header } from '@nestjs/common';

@Controller()
export class HealthController {
  @Head('health')
  @Header('Cache-Control', 'no-store, max-age=0')
  head() {}

  @Get('health')
  @Header('Cache-Control', 'no-store, max-age=0')
  check() {
    return { status: 'ok', uptime: process.uptime() };
  }
}

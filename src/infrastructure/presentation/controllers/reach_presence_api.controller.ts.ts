import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Reach Presence API')
@Controller('/ReachPresenceApi/')
export class ReachPresenceApiController {
  @Post('/heartbeat.ashx')
  getFileshare() {
    return 'ok';
  }
}

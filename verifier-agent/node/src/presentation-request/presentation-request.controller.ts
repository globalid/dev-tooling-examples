import { Controller, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { PresentationRequestResponseDto } from '../gid';
import { UserResponsePipe } from '../gid/user-response.pipe';
import { PresentationRequestGateway } from './presentation-request.gateway';
import { PresentationRequestService } from './presentation-request.service';

@Controller()
export class AppController {
  constructor(
    private readonly presentationRequestService: PresentationRequestService,
    private readonly presentationRequestGateway: PresentationRequestGateway
  ) {}

  @Post('request-presentation')
  async requestPresentation(@Param('tracking_id') trackingId: string): Promise<PresentationRequestResponseDto> {
    return await this.presentationRequestService.requestPresentation(trackingId);
  }

  @Post('handle-user-response')
  async handleUserResponse(@Param('user_response', UserResponsePipe) @Req() request: Request) {
    await this.presentationRequestService.verifySignature(<string>request.headers['X-Signature'], request.body);
  }
}

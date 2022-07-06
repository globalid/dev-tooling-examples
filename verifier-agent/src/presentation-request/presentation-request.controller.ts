import { PresentationRequestResponseDto, UserAcceptance, UserRejection } from '@globalid/verifier-toolkit';
import { Body, Controller, Get, Headers, Logger, Post, Query, Render } from '@nestjs/common';

import { PresentationRequestService } from './presentation-request.service';
import { QrCodeViewModel } from './qr-code.view-model';
import { UserResponsePipe } from './user-response.pipe';

@Controller()
export class PresentationRequestController {
  private readonly logger = new Logger(PresentationRequestController.name);

  constructor(private readonly service: PresentationRequestService) {}

  @Get()
  @Render('index')
  index(): QrCodeViewModel {
    return this.service.createQrCodeViewModel();
  }

  @Post('request-presentation')
  async requestPresentation(@Query('tracking_id') trackingId: string): Promise<PresentationRequestResponseDto> {
    this.logger.log(`requesting presentation (tracking ID: ${trackingId})`);
    return await this.service.requestPresentation(trackingId);
  }

  @Post('handle-user-response')
  async handleUserResponse(
    @Headers('X-Signature') signature: string,
    @Body(UserResponsePipe) userResponse: UserAcceptance | UserRejection
  ) {
    this.logger.log(`handling user response (tracking ID: ${userResponse.trackingId})`);
    await this.service.handleUserResponse(signature, userResponse);
  }
}

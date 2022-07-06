import { HolderAcceptance, HolderRejection, PresentationRequestResponseDto } from '@globalid/verifier-toolkit';
import { Body, Controller, Get, Headers, Logger, Post, Query, Render } from '@nestjs/common';

import { HolderResponsePipe } from './holder-response.pipe';
import { PresentationRequestService } from './presentation-request.service';
import { QrCodeViewModel } from './qr-code.view-model';

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

  @Post('handle-response')
  async handleResponse(
    @Headers('X-Signature') signature: string,
    @Body(HolderResponsePipe) holderResponse: HolderAcceptance | HolderRejection
  ) {
    this.logger.log(`handling Holder response (tracking ID: ${holderResponse.trackingId})`);
    await this.service.handleResponse(signature, holderResponse);
  }
}

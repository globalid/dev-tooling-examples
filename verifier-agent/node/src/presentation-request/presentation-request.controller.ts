import { HolderAcceptance, HolderRejection, PresentationRequestResponseDto } from '@globalid/verifier-toolkit';
import { Body, Controller, Get, Headers, Logger, Param, Post, Query, Render } from '@nestjs/common';
import { PresentationRequestService } from './presentation-request.service';
import { HolderResponsePipe } from './holder-response.pipe';

@Controller()
export class PresentationRequestController {
  private readonly logger = new Logger(PresentationRequestController.name);

  constructor(private readonly service: PresentationRequestService) {}

  @Get()
  @Render('index')
  index(@Query('name') name?: string) {
    return this.service.createQrCodeViewModel(name);
  }

  @Post('request-presentation/:name')
  async requestPresentation(
    @Param('name') name: string,
    @Query('tracking_id') trackingId: string
  ): Promise<PresentationRequestResponseDto> {
    this.logger.log(`requesting presentation (tracking ID: ${trackingId})`);
    return await this.service.requestPresentation(name, trackingId);
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

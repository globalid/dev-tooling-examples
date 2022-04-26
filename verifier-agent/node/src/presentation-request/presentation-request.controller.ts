import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { PresentationRequestResponseDto } from '../gid';
import { UserAcceptance, UserRejection } from '../gid/user-response';
import { UserResponsePipe } from '../gid/user-response.pipe';
import { PresentationRequestGateway } from './presentation-request.gateway';
import { PresentationRequestService } from './presentation-request.service';

@Controller()
export class PresentationRequestController {
  constructor(
    private readonly presentationRequestService: PresentationRequestService,
    private readonly presentationRequestGateway: PresentationRequestGateway
  ) {}

  @Post('request-presentation')
  async requestPresentation(@Param('tracking_id') trackingId: string): Promise<PresentationRequestResponseDto> {
    return await this.presentationRequestService.requestPresentation(trackingId);
  }

  @Post('handle-user-response')
  async handleUserResponse(
    @Body(UserResponsePipe) userResponse: UserAcceptance | UserRejection,
    @Req() request: Request
  ) {
    await this.presentationRequestService.verifySignature(<string>request.headers['X-Signature'], userResponse);

    if (userResponse instanceof UserAcceptance) {
      this.presentationRequestGateway.acceptPresentation(userResponse.tracking_id, userResponse.proof_presentation);
    } else {
      this.presentationRequestGateway.rejectPresentation(userResponse.tracking_id, userResponse.error_msg);
    }
  }
}

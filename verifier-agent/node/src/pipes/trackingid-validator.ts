import { Injectable, PipeTransform } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { isString } from 'class-validator';

interface HasTrackingId extends MaybeHasTrackingId {
  trackingId: string;
}

interface MaybeHasTrackingId {
  [key: string]: any;
}

const hasTrackingId = (x: MaybeHasTrackingId): x is HasTrackingId => {
  return 'trackingId' in x && (<HasTrackingId>x).trackingId !== undefined && (<HasTrackingId>x).trackingId !== null;
};

@Injectable()
export class TrackingIdValidationPipe implements PipeTransform<MaybeHasTrackingId, HasTrackingId> {
  transform(value: MaybeHasTrackingId): HasTrackingId {
    if (hasTrackingId(value) && isString(value.trackingId)) {
      return value;
    }

    throw new WsException(`param [trackingId] required but found ${value.trackingId}`);
  }
}

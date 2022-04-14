import { randomUUID } from 'crypto';

export const createPresentationRequestUrl = (clientId: string, initiationUrl: string, redirectUrl?: string): string => {
  const tracking_id = randomUUID();
  return `https://link.global.id?clientId=${clientId}&initiationUrl=${initiationUrl}&tracking_id=${tracking_id}&redirectUrl=${redirectUrl}`;
};

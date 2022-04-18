import { randomUUID } from 'crypto';

export interface CreatePresentationUrlParams {
  clientId: string;
  initiationUrl: string;
  redirectUrl?: string;
}

export const createPresentationRequestUrl = (params: CreatePresentationUrlParams): [URL, string] => {
  const trackingId = randomUUID();
  const { clientId, initiationUrl, redirectUrl } = params;

  const linkUrl = new URL('https://link.global.id');
  linkUrl.searchParams.append('app_uuid', clientId);
  const proofRequestUrl = new URL(initiationUrl);
  proofRequestUrl.searchParams.append('tracking_id', trackingId);
  linkUrl.searchParams.append('proof_request_url', proofRequestUrl.toString());
  if (redirectUrl !== undefined) {
    const redirect = new URL(redirectUrl);
    redirect.searchParams.append('tracking_id', trackingId);
    linkUrl.searchParams.append('redirect_url', redirect.toString());
  }
  return [linkUrl, trackingId];
};

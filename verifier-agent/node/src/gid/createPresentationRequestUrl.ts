import { randomUUID } from 'crypto';

export interface CreatePresentationUrlParams {
  clientId: string;
  initiationUrl: string;
  redirectUrl?: string;
}

export const createPresentationRequestUrl = (params: CreatePresentationUrlParams): URL => {
  const trackingId = randomUUID();
  const { clientId, initiationUrl, redirectUrl } = params;

  const lintUrl = new URL('https://link.global.id');
  lintUrl.searchParams.append('app_uuid', clientId);
  const proofRequestUrl = new URL(initiationUrl);
  proofRequestUrl.searchParams.append('tracking_id', trackingId);
  lintUrl.searchParams.append('proof_request_url', proofRequestUrl.toString());
  if (redirectUrl !== undefined) {
    const redirect = new URL(redirectUrl);
    redirect.searchParams.append('tracking_id', trackingId);
    lintUrl.searchParams.append('redirect_url', redirect.toString());
  }
  return lintUrl;
};
export interface CreatePresentationUrlParams {
  trackingId: string;
  clientId: string;
  initiationUrl: string;
  redirectUrl?: string;
}

export const createPresentationRequestUrl = (params: CreatePresentationUrlParams): URL => {
  const { trackingId, clientId, initiationUrl, redirectUrl } = params;

  const linkUrl = urlWithParams('https://link.global.id', { app_uuid: clientId });
  const proofRequestUrl = urlWithParams(initiationUrl, { tracking_id: trackingId });

  linkUrl.searchParams.append('proof_request_url', proofRequestUrl.toString());

  if (redirectUrl) {
    const redirect = urlWithParams(redirectUrl, { tracking_id: trackingId });
    linkUrl.searchParams.append('redirect_url', redirect.toString());
  }

  return linkUrl;
};

const urlWithParams = (uri: string, searchParams: Record<string, string>): URL => {
  const url = new URL(uri);

  Object.keys(searchParams).forEach((key: string) => {
    url.searchParams.append(key, searchParams[key]);
  });

  return url;
};

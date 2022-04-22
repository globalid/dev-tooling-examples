import { createPresentationRequestUrl, CreatePresentationUrlParams } from './create-presentation-request-url';

describe('createPresentationRequestUrl', () => {
  const baseParams: CreatePresentationUrlParams = {
    trackingId: 'ddb664a3-7160-467f-936d-a9b8c7ebc300',
    clientId: 'abc-123',
    initiationUrl: 'https://www.example.com'
  };

  it('should return a URL with origin https://link.global.id', () => {
    const url = createPresentationRequestUrl(baseParams);
    expect(url.origin).toBe('https://link.global.id');
    expect(url.searchParams.get('app_uuid')).toBe(baseParams.clientId);
    expect(url.searchParams.get('proof_request_url')).toBe(
      `${baseParams.initiationUrl}/?tracking_id=${baseParams.trackingId}`
    );
    expect(url.searchParams.get('redirect_url')).toBeNull();
  });

  it('should return a URL with origin https://link.global.id with redirectUrl', () => {
    const paramsRedirect: CreatePresentationUrlParams = {
      ...baseParams,
      redirectUrl: 'https://www.hompage.com'
    };

    const url = createPresentationRequestUrl(paramsRedirect);

    expect(url.origin).toBe('https://link.global.id');
    expect(url.searchParams.get('app_uuid')).toBe(paramsRedirect.clientId);
    expect(url.searchParams.get('proof_request_url')).toBe(
      `${paramsRedirect.initiationUrl}/?tracking_id=${paramsRedirect.trackingId}`
    );
    expect(url.searchParams.get('redirect_url')).toBe(
      `${paramsRedirect.redirectUrl}/?tracking_id=${paramsRedirect.trackingId}`
    );
  });
});

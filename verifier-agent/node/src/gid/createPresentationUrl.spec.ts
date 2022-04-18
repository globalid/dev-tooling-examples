import { createPresentationRequestUrl, CreatePresentationUrlParams } from './createPresentationRequestUrl';

describe('createPresentationRequestUrl', () => {
  const baseParams: CreatePresentationUrlParams = {
    clientId: 'abc-123',
    initiationUrl: 'https://www.example.com'
  };

  it('should return a URL with origin https://link.global.id', () => {
    const [url, tracking_id] = createPresentationRequestUrl(baseParams);

    expect(url.origin).toBe('https://link.global.id');
    expect(url.searchParams.get('app_uuid')).toBe(baseParams.clientId);
    expect(url.searchParams.get('proof_request_url')).toBe(`${baseParams.initiationUrl}/?tracking_id=${tracking_id}`);
    expect(url.searchParams.get('redirect_url')).toBeNull();
  });

  it('should return a URL with origin https://link.global.id with redirectUrl', () => {
    const paramsRedirect: CreatePresentationUrlParams = {
      ...baseParams,
      redirectUrl: 'https://www.hompage.com'
    };

    const [url, tracking_id] = createPresentationRequestUrl(paramsRedirect);

    expect(url.origin).toBe('https://link.global.id');
    expect(url.searchParams.get('app_uuid')).toBe(paramsRedirect.clientId);
    expect(url.searchParams.get('proof_request_url')).toBe(
      `${paramsRedirect.initiationUrl}/?tracking_id=${tracking_id}`
    );
    expect(url.searchParams.get('redirect_url')).toBe(`${paramsRedirect.redirectUrl}/?tracking_id=${tracking_id}`);
  });
});

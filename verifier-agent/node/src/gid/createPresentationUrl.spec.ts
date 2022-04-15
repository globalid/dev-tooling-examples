import { createPresentationRequestUrl, CreatePresentationUrlParams } from './createPresentationRequestUrl';

describe('createPresentationRequestUrl', () => {
  const baseParams: CreatePresentationUrlParams = {
    clientId: 'abc-123',
    initiationUrl: 'https://www.example.com'
  };
  const paramsRedirect: CreatePresentationUrlParams = {
    ...baseParams,
    redirectUrl: 'https://www.hompage.com'
  };

  it('should return a URL with origin https://link.global.id', () => {
    const proofUrl = createPresentationRequestUrl(baseParams);
    expect(proofUrl).toContain('https://link.global.id');
  });

  it('should return a URL with origin https://link.global.id with redirectUrl', () => {
    const proofUrl = createPresentationRequestUrl(paramsRedirect);
    expect(proofUrl).toContain('www.hompage.com');
  });
});

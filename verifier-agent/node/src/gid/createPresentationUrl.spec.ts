import { createPresentationRequestUrl, params } from './createPresentationRequestUrl';

describe('createPresentationRequestUrl', () => {
  const paramsNoRedirect: params = {
    clientId: 'abc-123',
    initiationUrl: 'https://www.example.com'
  };
  const paramsRedirect: params = {
    clientId: 'abc-123',
    initiationUrl: 'https://www.example.com',
    redirectUrl: 'https://www.hompage.com'
  };

  it('should return a URL with origin https://link.global.id', () => {
    const proofUrl = createPresentationRequestUrl(paramsNoRedirect);
    expect(proofUrl.origin).toBe('https://link.global.id');
  });

  it('should return a URL with origin https://link.global.id with redirectURL', () => {
    const proofUrl = createPresentationRequestUrl(paramsRedirect);
    expect(proofUrl.origin).toBe('https://link.global.id');
    expect(proofUrl.href).toContain('www.hompage.com');
  });
});

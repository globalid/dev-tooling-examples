import { ConnectParamsPipe } from './connect-params.pipe';
import { code, decoupledId } from '../../test/common';
import { ConnectParams } from './connect-params';
import { ErrorParams } from './error-params';
import { BadRequestException } from '@nestjs/common';

describe('ConnectParamsPipe', () => {
  let pipe: ConnectParamsPipe;

  beforeEach(() => {
    pipe = new ConnectParamsPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should transform code to ConnectParams', async () => {
    const result = await pipe.transform({ code });

    expect(result).toBeInstanceOf(ConnectParams);
    expect(result).toHaveProperty('code', code);
  });

  it('should transform code and decoupled_id to ConnectParams', async () => {
    const result = await pipe.transform({ code, decoupled_id: decoupledId });

    expect(result).toBeInstanceOf(ConnectParams);
    expect(result).toHaveProperty('code', code);
    expect(result).toHaveProperty('decoupledId', decoupledId);
  });

  it('should transform error and error_description to ErrorParams', async () => {
    const error = 'foo';
    const description = 'Lorem ipsum';
    const result = await pipe.transform({ error, error_description: description });

    expect(result).toBeInstanceOf(ErrorParams);
    expect(result).toHaveProperty('error', error);
    expect(result).toHaveProperty('errorDescription', description);
  });

  it('should validate transformation', async () => {
    await expect(pipe.transform({})).rejects.toThrow(BadRequestException);
  });
});

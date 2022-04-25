import { WebSocket } from 'ws';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ArgumentsHost, HttpException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { WsException } from '@nestjs/websockets';
import { WebsocketExceptionFilter } from '../filters/ws-filter';

describe('WebsocketExceptionFilter', () => {
  let websocketExceptionFilter: WebsocketExceptionFilter;
  let mockHost: DeepMocked<ArgumentsHost>;
  let mockClient: DeepMocked<WebSocket>;

  beforeEach(async () => {
    const testModule = await Test.createTestingModule({
      providers: [WebsocketExceptionFilter]
    }).compile();

    mockClient = createMock<WebSocket>({
      send: jest.fn()
    });

    mockHost = createMock<ArgumentsHost>({
      switchToWs: (): any => ({
        getClient: (): any => {
          return mockClient;
        }
      })
    });
    websocketExceptionFilter = testModule.get(WebsocketExceptionFilter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should catch WsException', () => {
    const errorMessage = 'error error';
    const error = new WsException(errorMessage);

    websocketExceptionFilter.catch(error, mockHost);

    expect(mockClient.send).toHaveBeenCalledTimes(1);
    expect(mockClient.send).toHaveBeenCalledWith(JSON.stringify({ event: 'error', data: errorMessage }));
  });

  it('should catch HttpException', () => {
    const errorMessage = 'error error';
    const error = new HttpException(errorMessage, 500);

    websocketExceptionFilter.catch(error, mockHost);

    expect(mockClient.send).toHaveBeenCalledTimes(1);
    expect(mockClient.send).toHaveBeenCalledWith(JSON.stringify({ event: 'error', data: errorMessage }));
  });

  it('should catch Error', () => {
    const errorMessage = 'error error';
    const error = new Error(errorMessage);

    websocketExceptionFilter.catch(error, mockHost);

    expect(mockClient.send).toHaveBeenCalledTimes(1);
    expect(mockClient.send).toHaveBeenCalledWith(JSON.stringify({ event: 'error', data: errorMessage }));
  });

  it('should catch custom error', () => {
    const errorMessage = { error: 'error error' };

    websocketExceptionFilter.catch(errorMessage, mockHost);

    expect(mockClient.send).toHaveBeenCalledTimes(1);
    expect(mockClient.send).toHaveBeenCalledWith(JSON.stringify({ event: 'error', data: 'unknown error encountered' }));
  });

  it('should catch WsException with object', () => {
    const errorMessage = { error: 'error error' };
    const error = new WsException(errorMessage);

    websocketExceptionFilter.catch(error, mockHost);

    expect(mockClient.send).toHaveBeenCalledTimes(1);
    expect(mockClient.send).toHaveBeenCalledWith(JSON.stringify({ event: 'error', data: errorMessage }));
  });
});

import { ArgumentsHost, WsExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { WebSocket } from 'ws';

export class WebsocketExceptionFilter<TError = any> implements WsExceptionFilter<TError> {
  public catch(exception: TError, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    this.handleError(client, exception);
  }

  private handleError<TClient extends WebSocket>(client: TClient, exception: TError) {
    if (exception instanceof WsException) {
      const payload = {
        event: 'error',
        data: exception.getError()
      };

      return this.sendMessage(client, payload);
    }

    return this.handleUnknownError(client, exception);
  }

  public handleUnknownError<TClient extends WebSocket>(client: TClient, exception: TError) {
    console.error(`encountered a non WsException type error of ${JSON.stringify(exception)}`);

    this.sendMessage(client, {
      event: 'error',
      data: exception instanceof Error ? exception.message : 'unknown error encountered'
    });
  }

  private sendMessage<TClient extends WebSocket>(client: TClient, payload: any) {
    client.send(JSON.stringify(payload));
  }
}

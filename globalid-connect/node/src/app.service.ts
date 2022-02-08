import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  greet(name: string): string {
    return `Hello, ${name}!`;
  }
}

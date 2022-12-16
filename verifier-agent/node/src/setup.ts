import { join } from 'path';

import { NestExpressApplication } from '@nestjs/platform-express';

export function setup(app: NestExpressApplication): void {
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.setLocal('BASE_URL', process.env.BASE_URL)
}

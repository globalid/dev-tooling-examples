import axios from 'axios';

import { version } from '../version';

export default axios.create({
  baseURL: process.env.CREDENTIALS_BASE_URL || 'https://credentials.global.id',
  headers: {
    'User-Agent': `GlobaliD-API-Client/${version}`
  }
});

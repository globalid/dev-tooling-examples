import axios from 'axios';

// import { version } from '../version'

// TODO remove when above import is in place
const version = '0.1.0';

export default axios.create({
  baseURL: 'https://api.global.id',
  headers: {
    'User-Agent': `GlobaliD-API-Client/${version}`
  }
});

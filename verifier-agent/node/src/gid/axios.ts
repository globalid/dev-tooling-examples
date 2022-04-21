import axios, { AxiosRequestConfig } from 'axios';

import { version } from './version';

const axiosConfig: AxiosRequestConfig = {
  headers: {
    'User-Agent': `Globalid-Verifier-Toolkit/${version}`
  }
};
export const credentialsAxios = axios.create({
  ...axiosConfig,
  baseURL: process.env.GID_CREDENTIALS_BASE_URL || 'https://credentials.global.id'
});

export const apiAxios = axios.create({
  ...axiosConfig,
  baseURL: process.env.GID_API_BASE_URL || 'https://api.global.id'
});

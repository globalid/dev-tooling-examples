import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ClientCredentialsMissingError } from '../errors'
import { HttpMimeType, HttpMethod, GrantType } from '../types'
import { IAuthClient } from './auth.interface'
// TODO uncomment and change path when config is figured out
// import config from './somewhere/config'

// TODO remove when config is figured out
const config: { apiBaseURL: string } = {
  apiBaseURL: '',
}

export class AuthClient implements IAuthClient {
  private clientId: string
  private clientSecret: string

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId
    this.clientSecret = clientSecret
  }

  async getAppAccessToken(): Promise<string> {
    if (!this.clientId || !this.clientSecret) {
      throw new ClientCredentialsMissingError()
    }

    interface Request {
      client_id: string
      client_secret: string
      grant_type: GrantType
    }

    interface Response {
      access_token: string
      expires_in: number
      scope: string
      token_type: string
    }

    const requestConfig: AxiosRequestConfig<Request> = {
      method: HttpMethod.Post,
      url: `${config.apiBaseURL}/v1/auth/token`,
      headers: {
        'Content-Type': HttpMimeType.ApplicationJSON,
        'Accept': HttpMimeType.ApplicationJSON,
      },
      data: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: GrantType.ClientCredentials,
      }
    }

    const response: AxiosResponse<Response, any> = await axios(requestConfig)
    return response.data.access_token
  }
}

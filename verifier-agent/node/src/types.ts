export enum HttpMethod {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE'
}

export enum HttpMimeType {
  ApplicationJSON = 'application/json'
}

export enum GrantType {
  ClientCredentials = 'client_credentials'
}

export interface ClientOptions {
  /** Developer app's client ID */
  clientId: string;
  /** Developer app's client secret */
  clientSecret: string;
}

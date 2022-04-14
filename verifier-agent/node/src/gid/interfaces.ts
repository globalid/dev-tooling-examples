export interface IAuthClient {
  clientId: string
  clientSecret: string

  init(clientId: string, cliendSecret: string): void
  getAppAccessToken(): Promise<string>
}

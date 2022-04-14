export interface IAuthClient {
  clientID: string
  clientSecret: string

  init(clientID: string, cliendSecret: string): void
  getAppAccessToken(): Promise<string>
}

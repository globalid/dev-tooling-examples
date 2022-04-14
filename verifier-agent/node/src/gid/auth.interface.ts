export interface IAuthClient {
  getAppAccessToken(): Promise<string>
}

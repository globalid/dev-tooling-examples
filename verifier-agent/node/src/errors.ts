export class ClientCredentialsMissingError extends Error {
  name: string

  constructor() {
    super('Client id and secret missing. Please initialize the auth client first')
    this.name = 'CLIENT_CREDENTIALS_MISSING'
    Object.setPrototypeOf(this, ClientCredentialsMissingError.prototype);
  }
}

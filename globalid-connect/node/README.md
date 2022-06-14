# GlobaliD Connect Example

This folder contains an example Node.js application that demonstrates integrating the [GlobaliD Connect](https://docs.global.id/developers/globalid-connect) flow. The example is built with [NestJS](https://nestjs.com/) and uses the [GlobaliD API Client](https://npmjs.com/package/@globalid/api-client) for JavaScript. There are two main pages in this demo:

- `/verifications` - Landing page that displays the Connect URL
- `/verifications/connect` - Redirect target for the GlobaliD Connect flow that retrieves and displays information about the user

For convenience, the root path (`/`) redirects to the landing page (`/verifications`).

## Setup

Follow the instructions below to run the demo app for yourself.

### Create a Developer App

Before diving into the demo app, you'll need to do some setup in our developer portal.

1. Create a [Developer App](https://docs.global.id/developers/globalid-connect/developer-app).
1. (Optional) Enable [PII sharing](https://docs.global.id/developers/globalid-connect/pii-sharing).
1. (Optional) Set up one or more [Required Verifications](https://docs.global.id/developers/globalid-connect/required-verifications). For simplicity, add requirements such as email or phone number.
1. Create a [Connect URL](https://docs.global.id/developers/globalid-connect/connect-url) with `http://localhost:3000/verifications/connect` as the **Redirect URL**.

### Configure the Demo App

First, install the necessary NPM dependencies.

```bash
npm install
```

Next, create a `.env`. You can use `.env.example` as a starting point.

```bash
cp .env.example .env
```

Then, enter values for the following environment variables in your `.env`:

- `CLIENT_ID` - Developer App's ID
- `CLIENT_SECRET` - Secret generated upon Developer App creation
- `CONNECT_URL` - Connect URL created above
- (Optional) `PRIVATE_KEY` - Private key corresponding to your public key for PII sharing
- (Optional) `PRIVATE_KEY_PASSPHRASE` - Passphrase used to encrypt your private key

### Run the Demo App

Once you have everything setup, simply run `npm start` to run the demo app and navigate to the landing page at <http://localhost:3000>.

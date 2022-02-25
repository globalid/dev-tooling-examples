# GlobaliD Connect Examples

This folder contains an example Node.js application that implements the GlobaliD Connect flow. The example is built with [NestJS](https://nestjs.com/).

There are five endpoints exposed by the demo application:

- `/` - Redirects to `/verifications`
- `/verifications` - Displays a list of Connect URLs, each demonstrating how to use an endpoint from the GlobaliD API
  - `/connect/attestations` - Retrieves all the user's attestations
  - `/connect/identity` - Retrieves the user's identity
  - `/connect/pii` - Retrieves and decrypts the user's PII associated with a Required Verification Set

The last three endpoints are used as redirect targets for the GlobaliD Connect flow.

## Setup

Follow the instructions below to run the demo app for yourself.

### Create a Developer App

Before diving into the demo app, you'll need to do some setup in our developer portal.

1. [Create a Developer App](https://docs.google.com/document/d/1ANq_sTTHRCukFtLFNM0EeUVL_Y5HfB9qQSzFvhy3hM8/edit?usp=sharing) (wait to create Connect URLs).
1. [Setup a Required Verification Set](https://docs.google.com/document/d/1pUqfyfFsqsV3MlgRv9QLN9e2H1hlZRw0l7WiyaYaG9I/edit?usp=sharing). For simplicity, add requirements such as email or phone number.
1. [Enable PII sharing](https://docs.google.com/document/d/1Eo86uM2gVO9O6wLizSw61Q-XkcP82iHnQRaz21zQrv8/edit?usp=sharing).
1. Create three Connect URLs, each with the Authorization code **Response Type**.
   1. For attestations:
      1. **URL description:** Attestations
      1. **Redirect URL:** `http://localhost:3000/verifications/connect/attestations`
      1. **Scope:** Public
   1. For identity:
      1. **URL description:** Identity
      1. **Redirect URL:** `http://localhost:3000/verifications/connect/identity`
      1. **Scope:** Public
   1. For PII:
      1. **URL description:** PII
      1. **Redirect URL:** `http://localhost:3000/verifications/connect/pii`
      1. **Scope:** OpenId
      1. **Required Verification Set:** Select the one you setup in step 2.

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
- `ATTESTATIONS_CONNECT_URL` - Attestations Connect URL created above
- `IDENTITY_CONNECT_URL` - Identity Connect URL created above
- `PII_CONNECT_URL` - PII Connect URL created above
- `PRIVATE_KEY` - Private key corresponding to your public key for PII sharing
- `PRIVATE_KEY_PASSPHRASE` - Passphrase used to encrypt your private key.

(Optional), create a `config.yaml`. You can use `config.example.yaml` as a starting point. YAML options will override environment variables (including those set in `.env`) of the same name.

```bash
cp config.example.yaml config.yaml
```

### Run the Demo App

Once you have everything setup, simply run `npm start` to run the demo app and navigate to <http://localhost:3000/verifications> to follow one of the flows.

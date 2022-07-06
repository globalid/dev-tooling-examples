# Verifier Agent Example

This folder contains an example Node.js application that demonstrates integrating with GlobaliD as a [Verifier](https://www.w3.org/TR/vc-data-model/#dfn-verifier). In this case, the application validates the [holder](https://www.w3.org/TR/vc-data-model/#dfn-holders) is 18 or older using either their driver's license or passport credential.

The example is built with [NestJS](https://nestjs.com/) and uses [GlobaliD's Verifier Toolkit](https://npmjs.com/package/@globalid/verifier-toolkit).

## Setup

To run the demo app for yourself, follow the instructions below.

### Create a Developer App

Before diving into the demo app, you'll need to [create a developer app](https://docs.global.id/developers/globalid-connect/developer-app).

### Configure the Demo

First, install the necessary dependencies from NPM.

```bash
npm install
```

Next, create a `.env`. You can use `.env.example` as a starting point.

```bash
cp .env.example .env
```

Then, enter values for the following environment variables in your `.env`:

- `BASE_URL` - Base URL of the demo app [exposed over the internet](#expose-the-demo)
- `CLIENT_ID` - Developer App's ID
- `CLIENT_SECRET` - Secret generated upon Developer App creation

### Expose the Demo

For the demo to work locally, port 3000 needs to be exposed over the internet using something like [ngrok](https://ngrok.com/).

## Run the Demo

Once you have everything [setup](#setup), run `npm start` and navigate to the `BASE_URL`.

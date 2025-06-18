// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

process.env.NODE_ENV === 'production' &&
  Sentry.init({
    dsn: 'https://06312dfb2df948f270927d1380c276e5@o4508288026279936.ingest.us.sentry.io/4508288051380224',

    // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
    tracesSampleRate: 1,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
  })

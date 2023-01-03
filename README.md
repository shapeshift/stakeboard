# Shapeshift Stakeboard

A staking dashboard for the [Shapeshift validator](https://www.mintscan.io/cosmos/validators/cosmosvaloper199mlc7fr6ll5t54w7tts7f4s0cvnqgc59nmuxf)

## Overview

The staking dashboard is a Next.js app with a minimal backend. Because it takes a while to aggregate the data, it is continously fetched in the background and stored in redis. 
The production setup (`docker-compose.yml`) consists of 3 components:

- The Stakeboard itself
- A redis cache/db
- a "syncer" service, which periodically runs an HTTP request to `/api/sync` on the stakeboard backend to trigger the synchronisation of data. For more details, see [Github](https://github.com/lmyslinski/dumbcron/)

## Development

For local dev, we only run the redis db via docker. The dev variant requires that you have [Unchained Cosmos Coinstack](https://github.com/shapeshift/unchained) running locally, but you can also use the public one from `.env.production`.

`docker-compose -f docker-compose-dev.yaml up -d`

Setup node.js:
`npm i`

Start the web app:
`npm run dev`

Start the sync manually (dev mode does not use syncer):
`curl http://localhost:3000/api/sync`

## Release & Versioning

The repo is configured to automatically release and publish the image version to Docker Hub on each Github release with a `v*` tag. 

# How it works

The app aggregates data from various data sources:

- Unchained, validator transactions 
- Unchained, validator details
- Coingecko API for coin pricing

## The sync process

Because the unchained data takes a long time to fetch, it is fetched continously in the background and stored in Redis.
The `syncer` service sends a request to the `/sync` endpoint, which starts the sync process. The sync process is divided into two modes:

### The "Initial" mode

The initial mode is used when:
- there is no data stored in Redis at all OR
- the data did not get populated all the way till the very first record returned by unchained

It basically tries to backfill the entire history of validator transactions. If an error occurs, the sync process resumes where it left off previously. Once we get a response from unchained smaller than a full page size of transactions, we know that we've fully downloaded all historical transactions.

This mode is executed only once - once if completes successfully, it is never ran again. It's finalized by setting `syncComplete` to true in Redis.

### The "New" mode

The new mode has the goal of filling the potential gap of transactions between some ealier point in time x and current time. It checks whether the last transaction that we have saved in Redis has the same timestamp as the latest transaction returned by Unchained. If that's not true, then we process to download transaction page after page, until we find a match. 
This process runs continously every hour, to make sure we always have the latest data available for our dashboard. 

## Production

All you need to run this in production is the `docker-compose.yml`. Just copy it to the target host and start it with `docker-compose up -d`.




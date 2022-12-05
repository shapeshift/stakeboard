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
`npm i`
`npm run dev`

## Release & Versioning

The repo is configured to automatically release and publish the image version to Docker Hub on each Github release with a `v*` tag. 

# How it works

The app aggregates data from various data sources:

- Unchained, validator transactions 
- Unchained, validator details
- Coingecko API for coin pricing





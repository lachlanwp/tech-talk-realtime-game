# Robot party virtual presence talk

![App demo](https://github.com/lachlanwp/eh-tech-talk-realtime-game/blob/main/bots-cross-platform.gif)

## About

This is a starter project for a virtual presence app (e.g. digital whiteboard) written in React Native (front-end), Dotnet (back-end) using
Dotnet middleware, MobX for application state on the front end and Redis Pub/Sub for broadcasting messages across Dotnet instances.

The repo is a mono-repo containing all the necessary code to run the full stack. The front-end is a cross-platform solution that can run natively
on iOS & Android as well as in a browser on any device with a modern browser.

You must setup your development environment to run React Native apps before attempting to run/build the front-end on iOS and Android simulators.

## Configure environment variables

Set the variable environment variables for the stack.

Note: in production systems it would be best to read the environment variables from the build system rather than inside the files in the repository. This guide is only intended for local development setup.

### Inside the /frontend folder

Open `/frontend/Config.ts` and set the `webSocketUrl` variable to where the `backend`
is hosted. If running the docker container locally, you can leave as `127.0.0.1`.

### Inside the /backend folder

Open `/backend/Dockerfile` and set the three `ENV` variables:

`ENV REDIS_PASSWORD=...` - replace `...` with a password. This should be the same password that was set in the `/redis/.env` file.

`ENV REDIS_HOST=host.docker.internal` - for dev purposes only, this will allow the backend to connect to the Redis instance on the host

`ENV REDIS_PORT=6366`

### Inside the /redis folder

Open `/redis/.env` and set `REDIS_PASSWORD` to your password. This should be the same
password that was set in the `/backend/Dockerfile` file.

## Prepare frontend

Run `yarn` within the `frontend` folder

## Launch the backend

Follow the steps above to configure your environment variables, then
run the following commands to launch the backend.

`cd backend`

`docker build -t "game-backend" .`

`docker run -p 5005:5005 game-backend`

## Launch Redis

Follow the steps above to configure your environment variables, then run the following commands to launch Redis.

`cd redis`

`docker compose up`

## Launch frontend

Note: running iOS and Android requires that you have setup your development environment for React Native development. If you don't want to do that, you can just run the web version of the app with `yarn web`.

iOS: `yarn ios` - an iOS simlulator will launch and the app will be installed and start running

Android: `yarn android` - an Android emulator will launch and the app will be installed and start running

Web: `yarn web` - the web app will be hosted locally. You can open a browser and goto `http://localhost:8080`

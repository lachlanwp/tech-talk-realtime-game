# Robot party virtual presence talk

![App demo](https://github.com/lachlanwp/eh-tech-talk-realtime-game/blob/main/bots-cross-platform.gif)

## About

This is a starter project for a virtual presence app (e.g. digital whiteboard) written in React Native (front-end), Dotnet (back-end) using
Dotnet middleware, MobX for application state on the front end and Redis Pub/Sub for broadcasting messages across Dotnet instances.

The repo is a mono-repo containing all the necessary code to run the full stack. The front-end is a cross-platform solution that can run natively
on iOS & Android as well as in a browser on any device with a modern browser.

You must setup your development environment to run React Native apps before attempting to run/build the front-end on iOS and Android simulators.

## Note

This is not intended to be a production app or system, it is intended for demonstration purposes. The security of the app and system is lax, for quick setup and easy demonstration. In a production system, you would have authentication and authorisation to ensure the messages are coming from an authentic user - as it is, the messages could be spoofed easily.

## Config and environment variables

### Inside the /frontend folder (config)

Open `/frontend/Config.ts` and set the `webSocketUrl` variable to where the `backend`
is hosted. If running the docker container locally, you can leave as `ws://127.0.0.1:5005`.

### For the backend (environment variables)

Open `/.env` and change the default values if desired. To get started quickly, you can leave them as they are for a local dev environment.

Note: in production systems it would be best to read the environment variables from the build system rather than inside the files in the repository. This guide is only intended for local development setup.

## Prepare frontend

Run `yarn` within the `frontend` folder

## Launch the backend (dotnet core app & redis in memory cache)

Follow the steps above to configure your environment variables, then
run the following commands to launch the backend.

`cd backend`

`docker build -t "game-backend" .`

`cd ../`

`docker compose up`

## Launch frontend

Note: running iOS and Android requires that you have setup your development environment for React Native development. If you don't want to do that, you can just run the web version of the app with `yarn web`.

`cd frontend`

then:

for iOS: `yarn ios` - an iOS simlulator will launch and the app will be installed and start running

for Android: `yarn android` - an Android emulator will launch and the app will be installed and start running

for Web: `yarn web` - the web app will be hosted locally. You can open a browser and goto `http://localhost:8080`

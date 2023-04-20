# Robot party virtual presence talk

![App demo](https://github.com/lachlanwp/eh-tech-talk-realtime-game/blob/main/bots-cross-platform.gif)

## About
This is a starter project for a virtual presence app (e.g. digital whiteboard) written in React Native (front-end), Dotnet (back-end) using 
Dotnet middleware, MobX for application state on the front end and Redis Pub/Sub for broadcasting messages across Dotnet instances.

The repo is a mono-repo containing all the necessary code to run the full stack. The front-end is a cross-platform solution that can run natively
on iOS & Android as well as in a browser on any device with a modern browser.

You must setup your development environment to run React Native apps before attempting to run/build the front-end on iOS and Android simulators.

## Setup - front-end
Run `yarn` within the `frontend` folder

## Setup - back-end
The `backend` folder contains a Dockerfile. Build the docker image and run a docker container.

## Setup - back-end (Redis)
The `redis` folder contains a docker-compose.yml file. Configure it with your own password from the build environment and run docker compose to start it

## Running the front-end
iOS: `yarn ios`

Android: `yarn android`

Web: `yarn web`

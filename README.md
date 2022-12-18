# dotnet-monorepo

## Prerequisites

* Docker Desktop with buildx enabled
* .NET CLI with >= 6.0 SDK

## Setup

* Run .\create.ps1 to set up the monorepo
* Run `docker buildx bake` to build all the Docker images

## TODO

* Add change detection so that only changed applications get rebuilt
* Look at how the external caching works with buildx

# dotnet-monorepo

## Prerequisites

* Docker Desktop with buildx enabled
* .NET CLI with >= 6.0 SDK

## Setup

* Make some changes to the apps or libs
* Run `.\build.ps1` to build all the Docker images for the changed apps

## TODO

* Look at how the external caching works with buildx

* "Diff all changes on the current branch against the parent branch" for dag
  * dag does a simple `git diff` at the moment for testing with some local changes. This needs to be implemented for it to be usable in CI.

* Re-write dag in something faster like .NET or Go

* The `deps.json` files for dag could be replaced with `.csproj` parsing

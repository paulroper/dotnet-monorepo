# dag

A tool for building a DAG for the monorepo. Very simple to support our .NET use-case.

## Method

1. Check Git history for components that have changed
2. Load all the `deps.json` files in the repo
3. Find all unique `dependsOn` changes
4. If an app has changes, mark as requiring a rebuild
5. If a `dependsOn` has changes, mark everything depending on it as requiring a rebuild


## Setup

📓 Make sure you have Node 18 / 19+

* Add a `deps.json` to the apps you want to build
* Run `yarn`
* Run `yarn start` to generate a DAG

## TODO

* Re-write in something faster like .NET or Go
* Replace this with something that parses .csproj files instead?

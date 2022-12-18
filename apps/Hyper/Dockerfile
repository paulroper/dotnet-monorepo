# https://hub.docker.com/_/microsoft-dotnet
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /source

ARG APP_NAME

# copy csproj and restore as distinct layers
COPY ./apps/$APP_NAME/*.sln ./apps/$APP_NAME/
COPY ./apps/$APP_NAME/$APP_NAME.Application/$APP_NAME.Application.csproj ./apps/$APP_NAME/$APP_NAME.Application/
COPY ./libs/Shared.Entities/*.csproj ./libs/Shared.Entities/
RUN dotnet restore ./apps/$APP_NAME/$APP_NAME.sln

# copy everything else and build app
COPY ./apps/$APP_NAME/$APP_NAME.Application/ ./apps/$APP_NAME/$APP_NAME.Application/
COPY ./libs/Shared.Entities/*.csproj ./libs/Shared.Entities
WORKDIR /source
RUN dotnet publish ./apps/$APP_NAME/ -c release -o /app --no-restore

# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app

ARG APP_NAME
ENV APP_DLL="$APP_NAME.Application.dll"

COPY --from=build /app ./
ENTRYPOINT ["/bin/sh", "-c", "dotnet ${APP_DLL}"]

# https://hub.docker.com/_/microsoft-dotnet
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /source

ARG APP_NAME

# copy csproj and restore as distinct layers
COPY *.sln .
COPY $APP_NAME.Application/$APP_NAME.Application.csproj ./$APP_NAME.Application/$APP_NAME.Application.csproj
RUN dotnet restore $APP_NAME.sln

# copy everything else and build app
COPY $APP_NAME.Application/ ./$APP_NAME.Application/
WORKDIR /source
RUN dotnet publish -c release -o /app --no-restore

# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build /app ./
ENTRYPOINT ["dotnet", "$APP_NAME.Application.dll"]

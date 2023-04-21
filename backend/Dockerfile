FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app

COPY ./ ./Realtime-Game/backend/

WORKDIR /app/Realtime-Game/backend/

RUN dotnet restore

RUN dotnet publish -f net6.0 -c release -o /out --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime

WORKDIR /app
COPY --from=build /out ./

ENV ASPNETCORE_URLS http://*:5005

# install dependencies
RUN apt-get update \
    && apt-get install -y --allow-unauthenticated \
        nano \
     && rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["dotnet", "RealtimeGame.dll"]
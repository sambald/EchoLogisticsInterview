# Build environment
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env

WORKDIR /app

COPY backend.csproj /app/ 
RUN dotnet restore 

COPY ./ /app/
RUN dotnet publish /app/backend.csproj \
  -c Release -o /app/output


# Runtime environment
FROM mcr.microsoft.com/dotnet/aspnet:6.0

WORKDIR /app

COPY --from=build-env /app/output /app
ENTRYPOINT [ "dotnet", "backend.dll" ]

# Tickets Service

Tickets microservice built with .NET 8 minimal APIs.

## Features

- Ticket management (CRUD operations)
- Comments on tickets
- Priority and status tracking
- PostgreSQL persistence with Entity Framework Core
- Health checks
- Swagger/OpenAPI documentation

## Technologies

- **Framework**: .NET 8.0
- **Database**: PostgreSQL 16 with EF Core
- **Pattern**: Minimal APIs
- **ORM**: Entity Framework Core 8

## API Endpoints

### Tickets
- `GET /api/tickets` - Get all tickets
- `GET /api/tickets/{id}` - Get ticket by ID
- `POST /api/tickets` - Create a new ticket
- `PUT /api/tickets/{id}` - Update a ticket
- `DELETE /api/tickets/{id}` - Delete a ticket

### Comments
- `GET /api/tickets/{id}/comments` - Get comments for a ticket
- `POST /api/tickets/{id}/comments` - Add a comment to a ticket

### Health
- `GET /health` - Health check
- `GET /swagger` - API documentation

## Running Locally

### Prerequisites
- .NET 8 SDK
- PostgreSQL 16

### Setup

1. Start PostgreSQL:
```bash
docker run -d --name postgres -e POSTGRES_DB=lmra -e POSTGRES_USER=lmra_user -e POSTGRES_PASSWORD=lmra_password -p 5432:5432 postgres:16-alpine
```

2. Restore dependencies:
```bash
dotnet restore
```

3. Run the application:
```bash
dotnet run
```

The service will be available at `http://localhost:8081`

### Using Docker

```bash
docker build -t tickets-service .
docker run -p 8081:8080 \
  -e CONNECTION_STRING="Host=host.docker.internal;Port=5432;Database=lmra;Username=lmra_user;Password=lmra_password" \
  tickets-service
```

## Testing

Run tests with:
```bash
dotnet test
```

## Modern C# Features Used

This service demonstrates modern C#/.NET features:

- **Minimal APIs** for endpoint definition
- **Records** for DTOs
- **Nullable Reference Types** enabled
- **Top-level statements** in Program.cs
- **Async/await** throughout
- **Pattern matching** where applicable
- **LINQ** for data queries
- **Primary constructors** in .NET 8

## Legacy vs Modern

### Before (Legacy)
- .NET Framework 4.x with Web Forms
- ASP.NET Web API with controllers
- XML configuration
- ADO.NET with DataTables

### After (Modern)
- .NET 8 with minimal APIs
- No controllers - direct endpoint mapping
- JSON/Code-based configuration
- Entity Framework Core with migrations
- Record types for immutable DTOs
- Nullable reference types


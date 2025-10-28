# Users Service

Users microservice built with Spring Boot 3 and JDK 21.

## Features

- User registration and authentication
- JWT-based authentication
- Role-based access control (USER, ADMIN, MODERATOR)
- PostgreSQL persistence with Flyway migrations
- Health checks and metrics
- OpenTelemetry integration for observability

## Technologies

- **Framework**: Spring Boot 3.2.0
- **Java**: JDK 21
- **Database**: PostgreSQL 16
- **Migrations**: Flyway
- **Security**: Spring Security with JWT
- **Build Tool**: Maven

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login and get JWT token

### Users
- `POST /api/users/register` - Register a new user
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users` - Get all users
- `GET /api/users/email/{email}` - Get user by email

### Health
- `GET /health` - Health check
- `GET /actuator/health` - Detailed health info

## Running Locally

### Prerequisites
- JDK 21
- Maven 3.9+
- PostgreSQL 16

### Setup

1. Start PostgreSQL:
```bash
docker run -d --name postgres -e POSTGRES_DB=lmra -e POSTGRES_USER=lmra_user -e POSTGRES_PASSWORD=lmra_password -p 5432:5432 postgres:16-alpine
```

2. Build the application:
```bash
mvn clean package
```

3. Run the application:
```bash
mvn spring-boot:run
```

The service will be available at `http://localhost:8080`

### Using Docker

```bash
docker build -t users-service .
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/lmra \
  -e SPRING_DATASOURCE_USERNAME=lmra_user \
  -e SPRING_DATASOURCE_PASSWORD=lmra_password \
  users-service
```

## Testing

Run tests with:
```bash
mvn test
```

## Modern Java Features Used

This service demonstrates modern Java/Spring Boot features:

- **Records** for DTOs
- **Pattern Matching** in future features
- **Sealed Classes** where applicable
- **Text Blocks** for SQL migrations
- **Null Safety** with annotations
- **Functional Programming** with Streams API
- **Jakarta EE** (migrated from Java EE)
- **No XML configuration** - pure Java-based configuration

## Legacy vs Modern

### Before (Legacy)
- Java EE with XML configuration
- Spring Framework 4 with XML beans
- Manual JWT handling
- XML-based database mapping

### After (Modern)
- Spring Boot 3 with auto-configuration
- Java-based configuration
- Spring Security with JWT support
- JPA/Hibernate with annotation-based mapping
- Record classes for DTOs
- JDK 21 features


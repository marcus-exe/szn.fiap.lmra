# ADR-002: Technology Stack Selection

**Status**: Accepted  
**Date**: 2025-01-27  
**Decision Makers**: Architecture Team

## Context

We need to select modern technologies that represent current best practices while demonstrating migration from legacy stacks.

## Decision

Selected technology stack:

### Backend Services
- **Java**: Spring Boot 3, JDK 21
- **C#**: .NET 8 minimal APIs
- **Node.js**: Express.js with TypeScript

### Frontend
- **Web**: Next.js 14 with React 18
- **Mobile**: Kotlin with Jetpack Compose

### Database
- PostgreSQL 16

### Infrastructure
- Docker for containerization
- AWS for cloud deployment
- Terraform for IaC

### AI
- Ollama for self-hosted LLM

## Consequences

### Positive
- Modern, actively maintained technologies
- Strong community support
- Good documentation
- Cross-platform support

### Negative
- Learning curve for multiple technologies
- Requires expertise in multiple stacks
- More complex development environment

## Alternatives Considered

### Alternative: All services in one language
- **Considered**: Python for all services
- **Rejected because**: Doesn't demonstrate polyglot microservices

### Alternative: Managed AI service
- **Considered**: OpenAI or Anthropic APIs
- **Rejected because**: Preference for self-hosted solution


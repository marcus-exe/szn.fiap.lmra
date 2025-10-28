# ADR-003: PostgreSQL as Primary Database

**Status**: Accepted  
**Date**: 2025-01-27  
**Decision Makers**: Architecture Team

## Context

We need a database solution that supports both Java (JPA/Hibernate) and C# (EF Core) services, providing ACID guarantees and good performance.

## Decision

Use PostgreSQL 16 as the primary database for all services.

## Consequences

### Positive
- Excellent support for Java and .NET
- ACID compliance
- Strong SQL support
- JSON/JSONB support for semi-structured data
- Good performance
- Open source and cost-effective

### Negative
- Requires careful migration planning for schema changes
- SQL knowledge required
- May need optimization for high-scale use cases

## Alternatives Considered

### MySQL
- **Considered**: Runnable alternative
- **Rejected because**: PostgreSQL has better JSON support

### MongoDB
- **Considered**: NoSQL option
- **Rejected because**: We need ACID guarantees and complex queries

### Multi-Database Approach
- **Considered**: Different DB for each service
- **Rejected because**: Adds complexity and makes cross-service queries difficult


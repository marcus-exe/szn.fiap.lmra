# Contributing to LMRA

Thank you for your interest in contributing to the Legacy Modernization Reference Application!

## Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Follow the coding standards for each technology
4. **Test your changes**: Ensure all tests pass
5. **Commit your changes**: Use conventional commit messages
6. **Push to your fork**: `git push origin feature/amazing-feature`
7. **Create a Pull Request**

## Coding Standards

### Java (Spring Boot)
- Follow Google Java Style Guide
- Use JDK 21 features (records, pattern matching, etc.)
- Write comprehensive unit and integration tests
- Document public APIs with JavaDoc

### C# (.NET)
- Follow Microsoft C# Coding Conventions
- Use .NET 8 features (minimal APIs, nullable reference types)
- Write unit tests with xUnit
- Use async/await for I/O operations

### TypeScript/JavaScript
- Use ESLint and Prettier
- Follow the Airbnb TypeScript Style Guide
- Write tests with Jest or Vitest
- Use modern ES6+ features

### Kotlin (Android)
- Follow Kotlin Coding Conventions
- Use Jetpack Compose best practices
- Write unit tests with JUnit and integration tests with Espresso
- Follow MVVM architecture pattern

## Commit Message Format

Use conventional commits:

```
feat: add user authentication
fix: resolve database connection issue
docs: update API documentation
refactor: improve error handling
test: add integration tests for tickets service
chore: update dependencies
```

## Pull Request Guidelines

- Keep PRs focused and small
- Include tests for new features
- Update documentation as needed
- Ensure CI/CD pipelines pass
- Request reviews from maintainers

## Questions?

Feel free to open an issue for questions or discussions.


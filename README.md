# Legacy Modernization Reference Application (LMRA)

🌐 **Language**: [English](README.md) | [Português](README_PT.md)

A comprehensive reference application demonstrating how to modernize legacy codebases using modern technologies, cloud-native architectures, and best practices.

## 🎯 Project Goals

This project showcases:
- **Legacy Code Modernization**: Upgrading deprecated frameworks and technologies
- **Multi-Language Microservices**: Java (Spring Boot), C# (.NET), and Node.js working together
- **Cloud-Native Architecture**: Containerized services with Docker and AWS
- **Full-Stack Application**: Web frontend (Next.js), Android mobile app (Kotlin + Compose)
- **Modern DevOps Practices**: CI/CD, Infrastructure as Code, Observability
- **AI Integration**: Self-hosted LLM (Ollama) for intelligent features

## 📁 Project Structure

```
challenge_2025/
├── services/
│   ├── users-java/          # Users service (Spring Boot 3 + JDK 21)
│   ├── tickets-dotnet/      # Tickets service (.NET 8 minimal APIs)
│   └── ai-gateway-node/     # AI Gateway (Node.js + Ollama)
├── web/
│   └── nextjs/              # Web frontend (Next.js + TypeScript)
├── mobile/
│   └── android-compose/     # Android app (Kotlin + Jetpack Compose)
├── infra/
│   └── terraform/           # Infrastructure as Code (Terraform)
├── ops/
│   ├── docker/              # Dockerfiles and compose files
│   └── ci-cd/               # CI/CD pipelines (GitHub Actions)
├── docs/
│   ├── migration-playbook.md
│   └── decisions/           # Architecture Decision Records
└── legacy/                  # Legacy code examples for reference

```

## 🏗️ Architecture

### Services

1. **Users Service (Java)**
   - Technology: Spring Boot 3.x, JDK 21
   - Responsibilities: User authentication, profile management
   - Database: PostgreSQL (shared)
   - Port: 8080

2. **Tickets Service (C#)**
   - Technology: .NET 8 minimal APIs
   - Responsibilities: Ticket/ticket management, workflow
   - Database: PostgreSQL (shared)
   - Port: 8081

3. **AI Gateway Service (Node.js)**
   - Technology: Node.js + Express
   - Responsibilities: Proxy to Ollama, AI-powered features
   - Models: LLM for summaries, embeddings for search
   - Port: 8082

### Frontends

1. **Web Application (Next.js)**
   - Technology: Next.js 14, React 18, TypeScript
   - Responsibilities: Primary user interface
   - Authentication: AWS Cognito
   - Port: 3000
   - UI Features: Modern dark theme with black background, animated DNA helix visualization, rolling slider with Chinese phrase, Arimo font family

2. **Android Application**
   - Technology: Kotlin 2.x, Jetpack Compose
   - Responsibilities: Mobile access to all features
   - Authentication: AWS Cognito

## 🚀 Getting Started

### Prerequisites

- Docker & Docker Compose
- JDK 21 (for local Java development)
- .NET 8 SDK (for local C# development)
- Node.js 20+ (for local frontend development)
- PostgreSQL 16 (or use Docker)
- Android Studio (for Android development)
- Terraform (for infrastructure provisioning)

### Quick Start (Docker)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Local Development

Each service has its own README with specific setup instructions. See individual directories:
- `services/users-java/README.md`
- `services/tickets-dotnet/README.md`
- `web/nextjs/README.md`
- `mobile/android-compose/README.md`

## 🔄 Migration Storyline

This project demonstrates modernization of:

- **Java EE → Spring Boot 3**: XML configuration to Java config, Jakarta EE migration
- **.NET Framework → .NET 8**: Web API to minimal APIs, nullable reference types
- **jQuery → Next.js**: Server-side rendering and modern React patterns
- **XML Layouts → Jetpack Compose**: Declarative UI on Android

See `docs/migration-playbook.md` for detailed guides.

## 🛠️ Technology Stack

### Backend
- **Java**: Spring Boot 3.x, JDK 21, Spring Security 6
- **C#**: .NET 8, Minimal APIs, Entity Framework Core 8
- **Node.js**: Node 20+, Express, TypeScript

### Frontend
- **Web**: Next.js 14, React 18, TypeScript, Tailwind CSS, Arimo font
- **Mobile**: Kotlin 2.x, Jetpack Compose, Ktor, Room

### Database
- PostgreSQL 16
- Migrations: Flyway (Java) + EF Core Migrations (C#)

### Infrastructure
- **Containerization**: Docker, Docker Compose
- **Cloud**: AWS (ECS Fargate, RDS, S3, CloudFront, Cognito)
- **IaC**: Terraform
- **CI/CD**: GitHub Actions
- **Monitoring**: OpenTelemetry, Grafana/CloudWatch

### AI
- **Self-hosted**: Ollama
- **Models**: Llama 3, Qwen2
- **Use cases**: Ticket summaries, code modernization suggestions

## 🎨 UI/UX Features

The web application features a modern, minimalist design:

- **Dark Theme**: Full black background with a subtle white grid pattern for depth
- **Animated DNA Visualization**: Interactive 3D canvas-based DNA helix animation with continuous rotation
- **Rolling Slider**: Infinite-scrolling banner with the Chinese phrase "现代化旧代码库的完整参考指南" (A comprehensive reference guide for modernizing legacy codebases)
- **Typography**: Arimo font family for a clean, modern look across all pages
- **Card-Based Layout**: Black cards with white borders and hover effects
- **Global Components**: Consistent footer ("All rights reserved to SNK") and rolling slider on all pages
- **Responsive Design**: Optimized for all screen sizes with Tailwind CSS

## 📚 Documentation

- [Migration Playbook](docs/migration-playbook.md)
- [Architecture Decision Records](docs/decisions/)
- [API Documentation](docs/api/)
- [Deployment Guide](docs/deployment.md)

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🎓 Learning Outcomes

After working through this project, you'll understand:
- How to modernize legacy codebases incrementally
- Building and operating microservices with multiple languages
- Cloud-native deployment patterns
- Modern frontend and mobile development
- Infrastructure as Code and CI/CD best practices
- Integration of AI capabilities into applications

## 🌐 Language

- [English](README.md)
- [Português](README_PT.md)


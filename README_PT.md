# Aplicação de Referência para Modernização de Código Legado (LMRA)

🌐 **Idioma**: [English](README.md) | [Português](README_PT.md)

Uma aplicação de referência abrangente demonstrando como modernizar bases de código legadas usando tecnologias modernas, arquiteturas cloud-native e melhores práticas.

## 🎯 Objetivos do Projeto

Este projeto apresenta:
- **Modernização de Código Legado**: Atualização de frameworks e tecnologias obsoletas
- **Microserviços Multi-linguagem**: Java (Spring Boot), C# (.NET) e Node.js trabalhando juntos
- **Arquitetura Cloud-Native**: Serviços containerizados com Docker e AWS
- **Aplicação Full-Stack**: Frontend web (Next.js), aplicativo móvel Android (Kotlin + Compose)
- **Práticas Modernas de DevOps**: CI/CD, Infrastructure as Code, Observabilidade
- **Integração de IA**: LLM auto-hospedado (Ollama) para funcionalidades inteligentes

## 📁 Estrutura do Projeto

```
challenge_2025/
├── services/
│   ├── users-java/          # Serviço de usuários (Spring Boot 3 + JDK 21)
│   ├── tickets-dotnet/      # Serviço de tickets (.NET 8 minimal APIs)
│   └── ai-gateway-node/     # Gateway de IA (Node.js + Ollama)
├── web/
│   └── nextjs/              # Frontend web (Next.js + TypeScript)
├── mobile/
│   └── android-compose/     # Aplicativo Android (Kotlin + Jetpack Compose)
├── infra/
│   └── terraform/           # Infrastructure as Code (Terraform)
├── ops/
│   ├── docker/              # Dockerfiles e arquivos compose
│   └── ci-cd/               # Pipelines de CI/CD (GitHub Actions)
├── docs/
│   ├── migration-playbook.md
│   └── decisions/           # Arquivos de Decisões de Arquitetura
└── legacy/                  # Exemplos de código legado para referência

```

## 🏗️ Arquitetura

### Serviços

1. **Serviço de Usuários (Java)**
   - Tecnologia: Spring Boot 3.x, JDK 21
   - Responsabilidades: Autenticação de usuários, gerenciamento de perfis
   - Banco de Dados: PostgreSQL (compartilhado)
   - Porta: 8080

2. **Serviço de Tickets (C#)**
   - Tecnologia: .NET 8 minimal APIs
   - Responsabilidades: Gerenciamento de tickets, workflow
   - Banco de Dados: PostgreSQL (compartilhado)
   - Porta: 8081

3. **Serviço de Gateway de IA (Node.js)**
   - Tecnologia: Node.js + Express
   - Responsabilidades: Proxy para Ollama, funcionalidades com IA
   - Modelos: LLM para resumos, embeddings para busca
   - Porta: 8082

### Frontends

1. **Aplicação Web (Next.js)**
   - Tecnologia: Next.js 14, React 18, TypeScript
   - Responsabilidades: Interface primária do usuário
   - Autenticação: AWS Cognito
   - Porta: 3000
   - Recursos de UI: Tema escuro moderno com fundo preto, visualização animada de hélice de DNA, slider rolante com frase em chinês, família de fontes Arimo

2. **Aplicação Android**
   - Tecnologia: Kotlin 2.x, Jetpack Compose
   - Responsabilidades: Acesso móvel a todas as funcionalidades
   - Autenticação: AWS Cognito

## 🚀 Como Começar

### Pré-requisitos

- Docker & Docker Compose
- JDK 21 (para desenvolvimento local em Java)
- .NET 8 SDK (para desenvolvimento local em C#)
- Node.js 20+ (para desenvolvimento de frontend local)
- PostgreSQL 16 (ou use Docker)
- Android Studio (para desenvolvimento Android)
- Terraform (para provisionamento de infraestrutura)

### Início Rápido (Docker)

```bash
# Iniciar todos os serviços
docker-compose up -d

# Visualizar logs
docker-compose logs -f

# Parar todos os serviços
docker-compose down
```

### Desenvolvimento Local

Cada serviço tem seu próprio README com instruções específicas de configuração. Veja os diretórios individuais:
- `services/users-java/README.md`
- `services/tickets-dotnet/README.md`
- `web/nextjs/README.md`
- `mobile/android-compose/README.md`

## 🔄 História de Migração

Este projeto demonstra a modernização de:

- **Java EE → Spring Boot 3**: Configuração XML para config Java, migração Jakarta EE
- **.NET Framework → .NET 8**: Web API para minimal APIs, nullable reference types
- **jQuery → Next.js**: Server-side rendering e padrões modernos de React
- **XML Layouts → Jetpack Compose**: UI declarativa no Android

Veja `docs/migration-playbook.md` para guias detalhados.

## 🛠️ Stack Tecnológico

### Backend
- **Java**: Spring Boot 3.x, JDK 21, Spring Security 6
- **C#**: .NET 8, Minimal APIs, Entity Framework Core 8
- **Node.js**: Node 20+, Express, TypeScript

### Frontend
- **Web**: Next.js 14, React 18, TypeScript, Tailwind CSS, fonte Arimo
- **Mobile**: Kotlin 2.x, Jetpack Compose, Ktor, Room

### Banco de Dados
- PostgreSQL 16
- Migrações: Flyway (Java) + EF Core Migrations (C#)

### Infraestrutura
- **Containerização**: Docker, Docker Compose
- **Cloud**: AWS (ECS Fargate, RDS, S3, CloudFront, Cognito)
- **IaC**: Terraform
- **CI/CD**: GitHub Actions
- **Monitoramento**: OpenTelemetry, Grafana/CloudWatch

### IA
- **Auto-hospedado**: Ollama
- **Modelos**: Llama 3, Qwen2
- **Casos de uso**: Resumos de tickets, sugestões de modernização de código

## 🎨 Recursos de UI/UX

A aplicação web apresenta um design moderno e minimalista:

- **Tema Escuro**: Fundo preto completo com um padrão de grade branca sutil para profundidade
- **Visualização Animada de DNA**: Animação interativa de hélice de DNA em 3D baseada em canvas com rotação contínua
- **Slider Rolante**: Banner com rolagem infinita com a frase em chinês "现代化旧代码库的完整参考指南" (Um guia de referência abrangente para modernizar bases de código legadas)
- **Tipografia**: Família de fontes Arimo para uma aparência limpa e moderna em todas as páginas
- **Layout Baseado em Cards**: Cards pretos com bordas brancas e efeitos de hover
- **Componentes Globais**: Rodapé consistente ("All rights reserved to SNK") e slider rolante em todas as páginas
- **Design Responsivo**: Otimizado para todos os tamanhos de tela com Tailwind CSS

## 📚 Documentação

- [Playbook de Migração](docs/migration-playbook.md)
- [Arquivos de Decisões de Arquitetura](docs/decisions/)
- [Documentação da API](docs/api/)
- [Guia de Deploy](docs/deployment.md)

## 🤝 Contribuindo

Veja [CONTRIBUTING.md](CONTRIBUTING.md) para diretrizes.

## 📝 Licença

Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🎓 Resultados de Aprendizado

Após trabalhar neste projeto, você entenderá:
- Como modernizar bases de código legadas incrementalmente
- Construir e operar microserviços com múltiplas linguagens
- Padrões de deploy cloud-native
- Desenvolvimento moderno de frontend e mobile
- Infraestrutura as Code e melhores práticas de CI/CD
- Integração de capacidades de IA em aplicações

## 🌐 Idioma

- [English](README.md)
- [Português](README_PT.md)


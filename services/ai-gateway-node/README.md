# AI Gateway Service

AI Gateway microservice that provides integration with Ollama (self-hosted LLM).

## Features

- Chat interface with LLM models
- Text summarization
- List available models
- Rate limiting
- Health checks
- CORS enabled for web integration

## Technologies

- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Language**: TypeScript
- **AI Backend**: Ollama
- **Build Tool**: npm/tsc

## AI Endpoints

- `POST /api/ai/chat` - Chat with the AI model
- `POST /api/ai/summarize` - Summarize text
- `GET /api/ai/models` - List available models

### Example Usage

#### Chat
```bash
curl -X POST http://localhost:8082/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Explain microservices architecture"}'
```

#### Summarize
```bash
curl -X POST http://localhost:8082/api/ai/summarize \
  -H "Content-Type: application/json" \
  -d '{"text": "Long text to summarize..."}'
```

#### Get Models
```bash
curl http://localhost:8082/api/ai/models
```

## Running Locally

### Prerequisites
- Node.js 20+
- npm
- Ollama running (see below)

### Setup Ollama

1. Install Ollama:
```bash
# macOS
brew install ollama

# Or download from https://ollama.ai
```

2. Start Ollama:
```bash
ollama serve
```

3. Pull a model:
```bash
ollama pull llama3
```

### Setup AI Gateway

1. Install dependencies:
```bash
npm install
```

2. Build:
```bash
npm run build
```

3. Run:
```bash
npm start
# Or for development:
npm run dev
```

The service will be available at `http://localhost:8082`

### Using Docker

```bash
# Build
docker build -t ai-gateway .

# Run
docker run -p 8082:8080 \
  -e OLLAMA_HOST=http://host.docker.internal:11434 \
  ai-gateway
```

## Environment Variables

- `PORT` - Server port (default: 8080)
- `OLLAMA_HOST` - Ollama service URL (default: http://localhost:11434)

## Use Cases in LMRA

This AI Gateway is used for:
- Generating ticket summaries automatically
- Providing modernization suggestions for legacy code
- Answering user questions about the system
- Generating code examples and documentation

## Model Recommendations

For this project, recommended Ollama models:
- `llama3` - General purpose, fast inference
- `qwen2` - Good balance of speed and quality
- `mistral` - Small, efficient model

Larger models like `llama3:70b` can be used if GPU is available.


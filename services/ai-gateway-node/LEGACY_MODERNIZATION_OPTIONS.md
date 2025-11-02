# Legacy Code Modernization AI Functions - Options Guide

This document outlines the enhanced AI functions available for legacy code modernization. Each option is designed to help with different aspects of modernizing legacy codebases.

## Overview

The AI Gateway now provides **5 specialized endpoints** for legacy code modernization, each focusing on different aspects of the modernization process.

---

## Option 1: Enhanced Modernize Code Endpoint
**Endpoint**: `POST /api/modernization/modernize`

### What It Does
Returns structured JSON with complete modernized code, detailed migration steps, and improvement analysis.

### Features
- ✅ **Structured JSON Response** - Easy to parse and integrate
- ✅ **Complete Modernized Code** - Production-ready refactored code
- ✅ **Deprecated Patterns Detection** - Identifies outdated patterns
- ✅ **Migration Steps** - Step-by-step guidance
- ✅ **Breaking Changes Analysis** - Highlights what will break

### Request Body
```json
{
  "code": "your legacy code here",
  "language": "java|csharp|javascript|typescript|python",
  "targetVersion": "optional: e.g. 'Spring Boot 3', '.NET 8', 'ES2023'"
}
```

### Response Structure
```json
{
  "success": true,
  "deprecatedPatterns": [...],
  "modernizedCode": "...",
  "improvements": [...],
  "breakingChanges": [...],
  "migrationSteps": [...],
  "additionalRecommendations": "...",
  "model": "llama3"
}
```

### Use Cases
- Quick modernization of small code snippets
- Understanding what needs to change
- Getting production-ready modernized code

---

## Option 2: Automated Code Refactoring
**Endpoint**: `POST /api/modernization/refactor`

### What It Does
Directly generates refactored code with different focus areas (patterns, structure, performance).

### Features
- ✅ **Focused Refactoring** - Choose what to optimize
- ✅ **Change Tracking** - See what changed and why
- ✅ **Metrics** - Complexity and maintainability improvements
- ✅ **Test Generation** - Optional unit test generation

### Request Body
```json
{
  "code": "your code",
  "language": "java|csharp|javascript",
  "refactorType": "full|patterns|structure|performance",
  "generateTests": true|false
}
```

### Refactor Types
- **full**: Complete modernization (patterns, structure, best practices)
- **patterns**: Replace deprecated patterns only
- **structure**: Improve organization and architecture
- **performance**: Optimize performance and reduce complexity

### Response Structure
```json
{
  "success": true,
  "refactoredCode": "...",
  "changes": [
    {
      "type": "extract method",
      "before": "...",
      "after": "...",
      "reason": "..."
    }
  ],
  "metrics": {
    "complexityReduction": "30%",
    "maintainabilityImprovement": "45%"
  },
  "tests": "optional: generated tests",
  "model": "llama3"
}
```

### Use Cases
- Refactoring large codebases incrementally
- Performance optimization
- Code structure improvements
- Generating tests for refactored code

---

## Option 3: Legacy Code Analysis
**Endpoint**: `POST /api/modernization/analyze-legacy`

### What It Does
Identifies issues, technical debt, security concerns, and provides actionable insights without generating code.

### Features
- ✅ **Issue Detection** - Security, performance, maintainability issues
- ✅ **Technical Debt Estimation** - Days to modernize, priority, risk
- ✅ **Deprecated Features** - Lists deprecated APIs/features
- ✅ **Security Scanning** - Identifies security vulnerabilities
- ✅ **Modernization Score** - 0-100 score indicating how "legacy" the code is

### Request Body
```json
{
  "code": "your code",
  "language": "java|csharp|javascript",
  "focusAreas": ["security", "performance"] // optional
}
```

### Response Structure
```json
{
  "success": true,
  "severity": "high|medium|low",
  "issues": [
    {
      "type": "security|performance|maintainability|deprecated|bug",
      "severity": "high|medium|low",
      "line": "23-45",
      "issue": "...",
      "impact": "...",
      "recommendation": "..."
    }
  ],
  "technicalDebt": {
    "estimatedDays": "15",
    "priority": "high",
    "risk": "medium"
  },
  "deprecatedFeatures": [...],
  "securityConcerns": [...],
  "modernizationScore": 35,
  "summary": "...",
  "model": "llama3"
}
```

### Use Cases
- Initial codebase assessment
- Prioritizing what to modernize first
- Security audit
- Technical debt tracking
- Code review automation

---

## Option 4: Migration Plan Generator
**Endpoint**: `POST /api/modernization/migration-plan`

### What It Does
Creates comprehensive, step-by-step migration plans with testing strategies and rollback plans.

### Features
- ✅ **Step-by-Step Plan** - Detailed migration roadmap
- ✅ **Time Estimates** - Estimated time per step
- ✅ **Dependency Tracking** - Order of operations
- ✅ **Testing Strategy** - What to test and when
- ✅ **Rollback Plans** - How to recover if something goes wrong
- ✅ **Risk Assessment** - Difficulty and risk levels

### Request Body
```json
{
  "code": "your legacy code",
  "sourceVersion": "Spring Framework 4.3",
  "targetVersion": "Spring Boot 3.2",
  "language": "java"
}
```

### Response Structure
```json
{
  "success": true,
  "migrationPlan": {
    "estimatedTime": "3 days",
    "difficulty": "medium",
    "riskLevel": "medium",
    "prerequisites": [...],
    "steps": [
      {
        "stepNumber": 1,
        "name": "Update dependencies",
        "description": "...",
        "action": "...",
        "codeChanges": "...",
        "estimatedTime": "2 hours",
        "dependencies": [],
        "rollbackPlan": "..."
      }
    ],
    "testingStrategy": {
      "unitTests": [...],
      "integrationTests": [...],
      "manualTests": [...]
    },
    "potentialIssues": [...],
    "postMigration": {
      "cleanup": [...],
      "optimization": [...],
      "monitoring": [...]
    }
  },
  "modernizedCode": "...",
  "model": "llama3"
}
```

### Use Cases
- Planning large migrations
- Project management and estimation
- Risk assessment for stakeholders
- Creating migration documentation
- Training teams on migration process

---

## Option 5: Dependency Analysis
**Endpoint**: `POST /api/modernization/analyze-dependencies`

### What It Does
Analyzes dependency versions, identifies outdated packages, security vulnerabilities, and provides upgrade recommendations.

### Features
- ✅ **Version Analysis** - Current vs latest versions
- ✅ **Security Scanning** - Vulnerable dependencies
- ✅ **Breaking Changes** - What will break with upgrades
- ✅ **Upgrade Priority** - What to upgrade first
- ✅ **Safe Grouping** - Dependencies that can be upgraded together

### Request Body
```json
{
  "dependencies": {
    "spring-boot-starter-web": "2.7.0",
    "hibernate-core": "5.6.0",
    "jackson-databind": "2.13.0"
  },
  "language": "java"
}
```

### Response Structure
```json
{
  "success": true,
  "analysis": {
    "totalDependencies": 15,
    "outdatedCount": 8,
    "vulnerableCount": 2,
    "deprecatedCount": 1
  },
  "dependencies": [
    {
      "name": "spring-boot-starter-web",
      "currentVersion": "2.7.0",
      "latestVersion": "3.2.0",
      "status": "outdated",
      "securityIssues": [],
      "breakingChanges": ["Jakarta EE migration required"],
      "upgradePath": "major",
      "impact": "Affects all web endpoints",
      "recommendation": "should upgrade",
      "upgradeSteps": ["Update pom.xml", "Change javax.* to jakarta.*"],
      "alternative": null
    }
  ],
  "upgradePlan": {
    "priorityOrder": ["spring-boot-starter-web", "hibernate-core"],
    "groupedUpgrades": {
      "safe": ["jackson-databind"],
      "requiresTesting": ["hibernate-core"],
      "breaking": ["spring-boot-starter-web"]
    },
    "estimatedRisk": "medium",
    "testingRequired": ["All API endpoints", "Database queries"]
  },
  "summary": "...",
  "model": "llama3"
}
```

### Use Cases
- Dependency audit
- Security vulnerability assessment
- Planning dependency upgrades
- Understanding breaking changes
- Creating upgrade roadmaps

---

## Option 5b: GitHub Repository Dependency Analysis ⭐ NEW
**Endpoint**: `POST /api/modernization/analyze-dependencies-github`

### What It Does
Automatically fetches and analyzes dependencies directly from a GitHub repository. Supports auto-detection of dependency files and multiple package managers.

### Features
- ✅ **GitHub Integration** - Just provide a repo URL
- ✅ **Auto-Detection** - Automatically finds dependency files (package.json, pom.xml, *.csproj, etc.)
- ✅ **Multiple Languages** - Supports Java, JavaScript/TypeScript, C#, Python, Go, Ruby, Rust
- ✅ **Multiple Package Managers** - npm, Maven, Gradle, NuGet, pip, Go modules, etc.
- ✅ **Private Repos** - Supports private repos with GITHUB_TOKEN
- ✅ **Branch/Path Support** - Analyze specific branches or file paths

### Request Body
```json
{
  "repoUrl": "https://github.com/owner/repo",
  "branch": "main",  // optional, defaults to main/master
  "path": "package.json"  // optional, auto-detects if not provided
}
```

### Supported Formats
- **JavaScript/TypeScript**: `package.json`
- **Java**: `pom.xml`, `build.gradle`
- **C#/.NET**: `*.csproj`
- **Python**: `requirements.txt`, `pyproject.toml`
- **Go**: `go.mod`
- **Ruby**: `Gemfile`
- **Rust**: `Cargo.toml`

### Response Structure
```json
{
  "success": true,
  "repository": "https://github.com/owner/repo",
  "dependencyFiles": ["package.json"],
  "language": "javascript",
  "packageManager": "npm",
  "analysis": {
    "totalDependencies": 25,
    "outdatedCount": 8,
    "vulnerableCount": 2,
    "deprecatedCount": 0
  },
  "dependencies": [...],
  "upgradePlan": {...},
  "summary": "...",
  "model": "llama3"
}
```

### Environment Variables
- `GITHUB_TOKEN` (optional): GitHub personal access token for:
  - Accessing private repositories
  - Higher API rate limits (5000/hour vs 60/hour)
  
  To create a token: GitHub → Settings → Developer settings → Personal access tokens

### Example URLs Supported
- `https://github.com/owner/repo`
- `https://github.com/owner/repo/tree/develop`
- `https://github.com/owner/repo/blob/main/package.json`

### Use Cases
- Quick dependency audit of any GitHub repository
- Analyzing legacy repositories for modernization
- Comparing dependencies across branches
- Automated dependency health checks in CI/CD

---

## Comparison Matrix

| Feature | Modernize | Refactor | Analyze | Migration Plan | Dependencies | GitHub Dependencies |
|---------|-----------|----------|---------|----------------|--------------|---------------------|
| Generates Code | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Step-by-Step Plan | ✅ | ❌ | ❌ | ✅✅ | ✅ | ✅ |
| Issue Detection | ✅ | ❌ | ✅✅ | ✅ | ✅ | ✅ |
| Security Analysis | ✅ | ❌ | ✅✅ | ✅ | ✅✅ | ✅✅ |
| Test Generation | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Time Estimates | ❌ | ❌ | ✅ | ✅✅ | ❌ | ❌ |
| Risk Assessment | ✅ | ❌ | ✅ | ✅✅ | ✅ | ✅ |
| GitHub Integration | ❌ | ❌ | ❌ | ❌ | ❌ | ✅✅ |
| Auto-Detection | ❌ | ❌ | ❌ | ❌ | ❌ | ✅✅ |

---

## Recommended Workflow

### For Small Code Snippets
1. Use **`/modernize`** for quick modernization
2. Review the modernized code
3. Apply changes

### For Refactoring Projects
1. Start with **`/analyze-legacy`** to assess the codebase
2. Use **`/refactor`** with appropriate `refactorType` to modernize incrementally
3. Use **`/migration-plan`** for complex migrations
4. Use **`/analyze-dependencies`** to update dependencies

### For Large Migrations
1. **`/analyze-legacy`** - Understand the scope
2. **`/analyze-dependencies`** - Plan dependency upgrades
3. **`/migration-plan`** - Create detailed plan
4. Execute migration step-by-step
5. Use **`/refactor`** to modernize code as you go

---

## Example Usage

### cURL Examples

#### 1. Quick Modernization
```bash
curl -X POST http://localhost:8082/api/modernization/modernize \
  -H "Content-Type: application/json" \
  -d '{
    "code": "public class OldCode { ... }",
    "language": "java",
    "targetVersion": "Spring Boot 3"
  }'
```

#### 2. Performance Refactoring
```bash
curl -X POST http://localhost:8082/api/modernization/refactor \
  -H "Content-Type: application/json" \
  -d '{
    "code": "...",
    "language": "java",
    "refactorType": "performance",
    "generateTests": true
  }'
```

#### 3. Legacy Analysis
```bash
curl -X POST http://localhost:8082/api/modernization/analyze-legacy \
  -H "Content-Type: application/json" \
  -d '{
    "code": "...",
    "language": "java",
    "focusAreas": ["security", "performance"]
  }'
```

#### 4. Migration Plan
```bash
curl -X POST http://localhost:8082/api/modernization/migration-plan \
  -H "Content-Type: application/json" \
  -d '{
    "code": "...",
    "sourceVersion": ".NET Framework 4.8",
    "targetVersion": ".NET 8",
    "language": "csharp"
  }'
```

#### 5. Dependency Analysis
```bash
curl -X POST http://localhost:8082/api/modernization/analyze-dependencies \
  -H "Content-Type: application/json" \
  -d '{
    "dependencies": {
      "spring-boot-starter-web": "2.7.0"
    },
    "language": "java"
  }'
```

#### 5b. GitHub Repository Dependency Analysis ⭐ NEW
```bash
# Auto-detect dependencies from GitHub repo
curl -X POST http://localhost:8082/api/modernization/analyze-dependencies-github \
  -H "Content-Type: application/json" \
  -d '{
    "repoUrl": "https://github.com/spring-projects/spring-boot"
  }'

# Analyze specific branch and file
curl -X POST http://localhost:8082/api/modernization/analyze-dependencies-github \
  -H "Content-Type: application/json" \
  -d '{
    "repoUrl": "https://github.com/owner/repo",
    "branch": "develop",
    "path": "pom.xml"
  }'
```

---

## Tips for Best Results

1. **Be Specific**: Include context about framework versions and target platforms
2. **Start Small**: Test with small code snippets before processing large files
3. **Combine Tools**: Use multiple endpoints together for comprehensive modernization
4. **Review Carefully**: AI-generated code should always be reviewed and tested
5. **Iterate**: Use the analysis endpoints to prioritize, then refactor incrementally

---

## Notes

- All endpoints return JSON, with fallback to plain text if JSON parsing fails
- Responses include a `success` field to indicate if JSON parsing succeeded
- All endpoints support the same AI models (default: llama3)
- Timeout is 2-3 minutes for complex analysis
- Responses are structured for easy integration with frontend UIs


import { Router } from 'express';
import axios from 'axios';

const router = Router();
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const DEFAULT_MODEL = 'llama3';

interface ModernizeCodeRequest {
  code: string;
  language: string;
  targetVersion?: string;
}

interface RefactorCodeRequest {
  code: string;
  language: string;
  refactorType?: 'full' | 'patterns' | 'structure' | 'performance';
  generateTests?: boolean;
}

interface AnalyzeLegacyRequest {
  code: string;
  language: string;
  focusAreas?: string[];
}

interface MigrationPlanRequest {
  code: string;
  sourceVersion: string;
  targetVersion: string;
  language: string;
}

interface DependencyAnalysisRequest {
  dependencies: Record<string, string>;
  language: string;
}

interface GitHubAnalysisRequest {
  repoUrl: string;
  branch?: string;
  path?: string;
}

interface CodebaseAnalysisRequest {
  repoUrl: string;
  branch?: string;
  language?: string;
  fileExtensions?: string[];
  excludePaths?: string[];
  maxFiles?: number;
}

// OPTION 1: Enhanced Modernize Code endpoint - Returns structured JSON with actual modernized code
router.post('/modernize', async (req, res) => {
  try {
    const { code, language, targetVersion }: ModernizeCodeRequest = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const prompt = `You are an expert code modernization assistant specializing in ${language}. 
Analyze the following legacy code and provide a comprehensive modernization plan.

TARGET VERSION: ${targetVersion || 'latest modern version'}
CURRENT CODE:
\`\`\`${language}
${code}
\`\`\`

Respond in JSON format with this structure:
{
  "deprecatedPatterns": [
    {
      "pattern": "pattern name",
      "description": "why it's deprecated",
      "location": "where in code"
    }
  ],
  "modernizedCode": "complete modernized code here",
  "improvements": [
    {
      "type": "performance|security|maintainability|readability",
      "description": "what was improved",
      "impact": "high|medium|low"
    }
  ],
  "breakingChanges": ["list of breaking changes"],
  "migrationSteps": [
    {
      "step": 1,
      "action": "what to do",
      "reason": "why"
    }
  ],
  "additionalRecommendations": "extra notes"
}

Be thorough and provide production-ready modernized code.`;

    const response = await axios.post(`${OLLAMA_HOST}/api/chat`, {
      model: DEFAULT_MODEL,
      messages: [{ role: 'user', content: prompt }],
      stream: false
    }, {
      timeout: 120000
    });

    // Try to parse JSON from response, fallback to plain text if needed
    let parsedResponse;
    try {
      const content = response.data.message.content;
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      parsedResponse = JSON.parse(jsonStr);
      res.json({
        success: true,
        ...parsedResponse,
        model: response.data.model
      });
    } catch (parseError) {
      // Fallback to text response
      res.json({
        success: false,
        recommendations: response.data.message.content,
        model: response.data.model,
        note: "Response was not in JSON format"
      });
    }
  } catch (error) {
    console.error('Error analyzing code:', error);
    if (axios.isAxiosError(error)) {
      return res.status(500).json({ 
        error: 'Failed to analyze code',
        details: error.message 
      });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Compare patterns endpoint
router.post('/compare-patterns', async (req, res) => {
  try {
    const { oldPattern, newPattern, language } = req.body;

    if (!oldPattern || !newPattern || !language) {
      return res.status(400).json({ error: 'Old pattern, new pattern, and language are required' });
    }

    const prompt = `Compare these two code patterns in ${language} and explain the benefits of the modern approach:

OLD PATTERN:
\`\`\`${language}
${oldPattern}
\`\`\`

NEW PATTERN:
\`\`\`${language}
${newPattern}
\`\`\`

Provide a comparison highlighting:
1. What makes the old pattern outdated
2. Benefits of the new pattern
3. Potential issues the old pattern might have`;

    const response = await axios.post(`${OLLAMA_HOST}/api/chat`, {
      model: DEFAULT_MODEL,
      messages: [{ role: 'user', content: prompt }],
      stream: false
    }, {
      timeout: 60000
    });

    res.json({
      comparison: response.data.message.content,
      model: response.data.model
    });
  } catch (error) {
    console.error('Error comparing patterns:', error);
    res.status(500).json({ error: 'Failed to compare patterns' });
  }
});

// OPTION 2: Automated Code Refactoring - Directly generates modernized code
router.post('/refactor', async (req, res) => {
  try {
    const { code, language, refactorType = 'full', generateTests = false }: RefactorCodeRequest = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const refactorFocus = {
      'full': 'complete modernization including patterns, structure, and best practices',
      'patterns': 'focus on replacing deprecated patterns with modern equivalents',
      'structure': 'focus on improving code organization, separation of concerns, and architecture',
      'performance': 'focus on optimizing performance, reducing complexity, and improving efficiency'
    };

    let prompt = `You are an expert ${language} refactoring specialist. Refactor the following code with focus on: ${refactorFocus[refactorType as keyof typeof refactorFocus]}.

ORIGINAL CODE:
\`\`\`${language}
${code}
\`\`\`

Provide the refactored code in this JSON format:
{
  "refactoredCode": "complete refactored code here",
  "changes": [
    {
      "type": "refactoring type",
      "before": "old code snippet",
      "after": "new code snippet",
      "reason": "explanation"
    }
  ],
  "metrics": {
    "complexityReduction": "estimated percentage",
    "maintainabilityImprovement": "estimated percentage"
  }
}`;

    if (generateTests) {
      prompt += `\n\nAdditionally, generate unit tests for the refactored code in the same JSON format with a "tests" field.`;
    }

    const response = await axios.post(`${OLLAMA_HOST}/api/chat`, {
      model: DEFAULT_MODEL,
      messages: [{ role: 'user', content: prompt }],
      stream: false
    }, {
      timeout: 120000
    });

    try {
      const content = response.data.message.content;
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      const parsedResponse = JSON.parse(jsonStr);
      res.json({
        success: true,
        ...parsedResponse,
        model: response.data.model
      });
    } catch (parseError) {
      res.json({
        success: false,
        refactoredCode: response.data.message.content,
        model: response.data.model
      });
    }
  } catch (error) {
    console.error('Error refactoring code:', error);
    res.status(500).json({ error: 'Failed to refactor code' });
  }
});

// OPTION 3: Legacy Code Analysis - Identifies issues and provides actionable insights
router.post('/analyze-legacy', async (req, res) => {
  try {
    const { code, language, focusAreas = [] }: AnalyzeLegacyRequest = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const focusText = focusAreas.length > 0 
      ? `Focus your analysis on: ${focusAreas.join(', ')}.`
      : 'Provide a comprehensive analysis.';

    const prompt = `You are a legacy code analysis expert. Analyze the following ${language} code for modernization opportunities.

${focusText}

CODE TO ANALYZE:
\`\`\`${language}
${code}
\`\`\`

Provide analysis in JSON format:
{
  "severity": "high|medium|low",
  "issues": [
    {
      "type": "security|performance|maintainability|deprecated|bug",
      "severity": "high|medium|low",
      "line": "line number or range",
      "issue": "description of the issue",
      "impact": "what problems this causes",
      "recommendation": "how to fix it"
    }
  ],
  "technicalDebt": {
    "estimatedDays": "days to modernize",
    "priority": "high|medium|low",
    "risk": "risk level if not addressed"
  },
  "deprecatedFeatures": [
    {
      "feature": "feature name",
      "version": "when deprecated",
      "replacement": "modern alternative"
    }
  ],
  "securityConcerns": [
    {
      "concern": "security issue",
      "severity": "high|medium|low",
      "fix": "how to address"
    }
  ],
  "modernizationScore": 0-100,
  "summary": "brief summary of findings"
}`;

    const response = await axios.post(`${OLLAMA_HOST}/api/chat`, {
      model: DEFAULT_MODEL,
      messages: [{ role: 'user', content: prompt }],
      stream: false
    }, {
      timeout: 120000
    });

    try {
      const content = response.data.message.content;
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      const parsedResponse = JSON.parse(jsonStr);
      res.json({
        success: true,
        ...parsedResponse,
        model: response.data.model
      });
    } catch (parseError) {
      res.json({
        success: false,
        analysis: response.data.message.content,
        model: response.data.model
      });
    }
  } catch (error) {
    console.error('Error analyzing legacy code:', error);
    res.status(500).json({ error: 'Failed to analyze legacy code' });
  }
});

// OPTION 4: Migration Plan Generator - Creates step-by-step migration plans
router.post('/migration-plan', async (req, res) => {
  try {
    const { code, sourceVersion, targetVersion, language }: MigrationPlanRequest = req.body;

    if (!code || !sourceVersion || !targetVersion || !language) {
      return res.status(400).json({ 
        error: 'Code, sourceVersion, targetVersion, and language are required' 
      });
    }

    const prompt = `Create a detailed migration plan for upgrading this ${language} code from ${sourceVersion} to ${targetVersion}.

CURRENT CODE (${sourceVersion}):
\`\`\`${language}
${code}
\`\`\`

Provide a comprehensive migration plan in JSON format:
{
  "migrationPlan": {
    "estimatedTime": "hours or days estimate",
    "difficulty": "easy|medium|hard|complex",
    "riskLevel": "low|medium|high",
    "prerequisites": ["required steps before migration"],
    "steps": [
      {
        "stepNumber": 1,
        "name": "step name",
        "description": "detailed description",
        "action": "specific action to take",
        "codeChanges": "code changes needed (if any)",
        "estimatedTime": "time estimate",
        "dependencies": ["steps that must complete first"],
        "rollbackPlan": "how to rollback if this fails"
      }
    ],
    "testingStrategy": {
      "unitTests": ["tests to write"],
      "integrationTests": ["integration tests needed"],
      "manualTests": ["manual verification steps"]
    },
    "potentialIssues": [
      {
        "issue": "potential problem",
        "solution": "how to handle it",
        "severity": "high|medium|low"
      }
    ],
    "postMigration": {
      "cleanup": ["things to clean up after"],
      "optimization": ["opportunities for further optimization"],
      "monitoring": ["things to monitor"]
    }
  },
  "modernizedCode": "final modernized code example"
}`;

    const response = await axios.post(`${OLLAMA_HOST}/api/chat`, {
      model: DEFAULT_MODEL,
      messages: [{ role: 'user', content: prompt }],
      stream: false
    }, {
      timeout: 180000 // 3 minutes for complex migration plans
    });

    try {
      const content = response.data.message.content;
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      const parsedResponse = JSON.parse(jsonStr);
      res.json({
        success: true,
        ...parsedResponse,
        model: response.data.model
      });
    } catch (parseError) {
      res.json({
        success: false,
        plan: response.data.message.content,
        model: response.data.model
      });
    }
  } catch (error) {
    console.error('Error generating migration plan:', error);
    res.status(500).json({ error: 'Failed to generate migration plan' });
  }
});

// OPTION 5: Dependency Analysis & Upgrade Recommendations
router.post('/analyze-dependencies', async (req, res) => {
  try {
    const { dependencies, language }: DependencyAnalysisRequest = req.body;

    if (!dependencies || !language) {
      return res.status(400).json({ 
        error: 'Dependencies and language are required' 
      });
    }

    const depsList = Object.entries(dependencies)
      .map(([name, version]) => `  "${name}": "${version}"`)
      .join('\n');

    const prompt = `Analyze the following ${language} dependencies and provide upgrade recommendations:

DEPENDENCIES:
\`\`\`json
{
${depsList}
}
\`\`\`

Provide analysis in JSON format:
{
  "analysis": {
    "totalDependencies": 0,
    "outdatedCount": 0,
    "vulnerableCount": 0,
    "deprecatedCount": 0
  },
  "dependencies": [
    {
      "name": "dependency name",
      "currentVersion": "current version",
      "latestVersion": "latest stable version",
      "status": "up-to-date|outdated|deprecated|vulnerable",
      "securityIssues": ["any security vulnerabilities"],
      "breakingChanges": ["breaking changes in newer versions"],
      "upgradePath": "how to upgrade (major|minor|patch)",
      "impact": "what this dependency affects",
      "recommendation": "should upgrade|keep|replace",
      "upgradeSteps": ["steps to upgrade"],
      "alternative": "modern alternative if applicable"
    }
  ],
  "upgradePlan": {
    "priorityOrder": ["order to upgrade dependencies"],
    "groupedUpgrades": {
      "safe": ["safe to upgrade together"],
      "requiresTesting": ["need careful testing"],
      "breaking": ["requires code changes"]
    },
    "estimatedRisk": "low|medium|high",
    "testingRequired": ["what to test after upgrade"]
  },
  "summary": "brief summary and recommendations"
}`;

    const response = await axios.post(`${OLLAMA_HOST}/api/chat`, {
      model: DEFAULT_MODEL,
      messages: [{ role: 'user', content: prompt }],
      stream: false
    }, {
      timeout: 120000
    });

    try {
      const content = response.data.message.content;
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      const parsedResponse = JSON.parse(jsonStr);
      res.json({
        success: true,
        ...parsedResponse,
        model: response.data.model
      });
    } catch (parseError) {
      res.json({
        success: false,
        analysis: response.data.message.content,
        model: response.data.model
      });
    }
  } catch (error) {
    console.error('Error analyzing dependencies:', error);
    res.status(500).json({ error: 'Failed to analyze dependencies' });
  }
});

// Helper function to parse GitHub URL
function parseGitHubUrl(url: string): { owner: string; repo: string; branch: string; path: string } | null {
  // Support formats:
  // https://github.com/owner/repo
  // https://github.com/owner/repo/blob/branch/path
  // https://github.com/owner/repo/tree/branch
  const githubMatch = url.match(/github\.com\/([^\/]+)\/([^\/]+)(?:\/(?:blob|tree)\/([^\/]+)(?:\/(.+))?)?/);
  if (!githubMatch) return null;
  
  const [, owner, repo, branch = 'main', path = ''] = githubMatch;
  return { owner, repo, branch, path: path || '' };
}

// Helper function to detect dependency file and language from repo structure
async function detectDependencyFiles(owner: string, repo: string, branch: string): Promise<Array<{path: string; type: string; language: string}>> {
  const GITHUB_API = 'https://api.github.com';
  const files: Array<{path: string; type: string; language: string}> = [];
  
  // Common dependency file patterns
  const dependencyFiles = [
    { pattern: 'package.json', type: 'npm', language: 'javascript' },
    { pattern: 'pom.xml', type: 'maven', language: 'java' },
    { pattern: 'build.gradle', type: 'gradle', language: 'java' },
    { pattern: '*.csproj', type: 'nuget', language: 'csharp' },
    { pattern: 'requirements.txt', type: 'pip', language: 'python' },
    { pattern: 'pyproject.toml', type: 'poetry', language: 'python' },
    { pattern: 'go.mod', type: 'go', language: 'go' },
    { pattern: 'Gemfile', type: 'rubygems', language: 'ruby' },
    { pattern: 'Cargo.toml', type: 'cargo', language: 'rust' }
  ];

  try {
    // Get repository contents
    const contentsResponse = await axios.get(
      `${GITHUB_API}/repos/${owner}/${repo}/contents`,
      { 
        params: { ref: branch },
        timeout: 10000,
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {})
        }
      }
    );

    for (const item of contentsResponse.data) {
      if (item.type === 'file') {
        for (const depFile of dependencyFiles) {
          if (item.name === depFile.pattern || 
              (depFile.pattern.startsWith('*') && item.name.endsWith(depFile.pattern.slice(1)))) {
            files.push({
              path: item.path,
              type: depFile.type,
              language: depFile.language
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Error detecting dependency files:', error);
  }

  return files;
}

// Helper function to fetch and parse dependency files
async function fetchDependenciesFromGitHub(owner: string, repo: string, branch: string, filePath: string): Promise<{dependencies: Record<string, string>; language: string; fileType: string} | null> {
  const GITHUB_API = 'https://api.github.com';
  
  try {
    const fileResponse = await axios.get(
      `${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}`,
      {
        params: { ref: branch },
        timeout: 10000,
        headers: {
          'Accept': 'application/vnd.github.v3.raw',
          ...(process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {})
        }
      }
    );

    // GitHub API returns raw content when Accept: application/vnd.github.v3.raw
    // But sometimes it returns base64 in data.content, so handle both
    let content: string;
    if (typeof fileResponse.data === 'string') {
      content = fileResponse.data;
    } else if (fileResponse.data.content) {
      content = Buffer.from(fileResponse.data.content, 'base64').toString('utf-8');
    } else {
      throw new Error('Unexpected response format from GitHub API');
    }
    const fileName = filePath.split('/').pop()?.toLowerCase() || '';

    // Parse based on file type
    if (fileName === 'package.json') {
      const pkg = JSON.parse(content);
      const deps: Record<string, string> = {};
      if (pkg.dependencies) {
        Object.assign(deps, pkg.dependencies);
      }
      if (pkg.devDependencies) {
        Object.assign(deps, pkg.devDependencies);
      }
      return { dependencies: deps, language: 'javascript', fileType: 'npm' };
    } else if (fileName === 'pom.xml') {
      // Parse Maven POM XML (simplified - extract dependencies)
      const deps: Record<string, string> = {};
      const dependencyMatches = content.matchAll(/<dependency>[\s\S]*?<\/dependency>/g);
      for (const match of dependencyMatches) {
        const artifactIdMatch = match[0].match(/<artifactId>([^<]+)<\/artifactId>/);
        const versionMatch = match[0].match(/<version>([^<]+)<\/version>/);
        if (artifactIdMatch && versionMatch) {
          deps[artifactIdMatch[1]] = versionMatch[1].replace(/[${}]/g, ''); // Remove Maven variables
        }
      }
      return { dependencies: deps, language: 'java', fileType: 'maven' };
    } else if (fileName.endsWith('.csproj')) {
      // Parse .NET csproj
      const deps: Record<string, string> = {};
      const packageRefMatches = content.matchAll(/<PackageReference\s+Include="([^"]+)"\s+Version="([^"]+)"/g);
      for (const match of packageRefMatches) {
        deps[match[1]] = match[2];
      }
      return { dependencies: deps, language: 'csharp', fileType: 'nuget' };
    } else if (fileName === 'requirements.txt') {
      // Parse Python requirements.txt
      const deps: Record<string, string> = {};
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const match = trimmed.match(/^([a-zA-Z0-9_-]+[a-zA-Z0-9._-]*)(?:[=<>!]+|==|>=|<=)(.+)$/);
          if (match) {
            deps[match[1]] = match[2];
          } else {
            const simpleMatch = trimmed.match(/^([a-zA-Z0-9_-]+[a-zA-Z0-9._-]*)/);
            if (simpleMatch) {
              deps[simpleMatch[1]] = 'latest';
            }
          }
        }
      }
      return { dependencies: deps, language: 'python', fileType: 'pip' };
    } else if (fileName === 'go.mod') {
      // Parse Go modules
      const deps: Record<string, string> = {};
      const requireMatches = content.matchAll(/require\s+([^\s]+)\s+([^\s]+)/g);
      for (const match of requireMatches) {
        deps[match[1]] = match[2];
      }
      return { dependencies: deps, language: 'go', fileType: 'go' };
    }
  } catch (error) {
    console.error(`Error fetching/parsing ${filePath}:`, error);
    return null;
  }

  return null;
}

// Helper function to fetch repository file tree recursively
async function fetchRepositoryFiles(owner: string, repo: string, branch: string, path: string = '', fileExtensions?: string[], excludePaths?: string[], maxFiles: number = 50): Promise<Array<{path: string; sha: string; size: number}>> {
  const GITHUB_API = 'https://api.github.com';
  const files: Array<{path: string; sha: string; size: number}> = [];
  
  try {
    const response = await axios.get(
      `${GITHUB_API}/repos/${owner}/${repo}/git/trees/${branch}${path ? ':' + path : ''}?recursive=1`,
      {
        timeout: 15000,
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {})
        }
      }
    );

    const tree = response.data.tree || [];

    for (const item of tree) {
      // Skip if we've reached max files
      if (files.length >= maxFiles) break;

      // Skip if path should be excluded
      if (excludePaths && excludePaths.some(exclude => item.path.includes(exclude))) {
        continue;
      }

      // Only process files (not directories)
      if (item.type === 'blob') {
        // Filter by extension if provided
        if (fileExtensions && fileExtensions.length > 0) {
          const matches = fileExtensions.some(ext => item.path.endsWith(ext));
          if (!matches) continue;
        }

        // Skip binary/large files (limit to reasonable text file sizes)
        if (item.size > 100000) continue; // Skip files larger than 100KB

        files.push({
          path: item.path,
          sha: item.sha,
          size: item.size
        });
      }
    }
  } catch (error) {
    console.error('Error fetching repository files:', error);
  }

  return files;
}

// Helper function to fetch file content from GitHub using blob SHA
async function fetchFileContent(owner: string, repo: string, sha: string): Promise<string | null> {
  const GITHUB_API = 'https://api.github.com';
  try {
    const response = await axios.get(
      `${GITHUB_API}/repos/${owner}/${repo}/git/blobs/${sha}`,
      {
        timeout: 10000,
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {})
        }
      }
    );
    
    if (response.data.encoding === 'base64' && response.data.content) {
      return Buffer.from(response.data.content, 'base64').toString('utf-8');
    }
    return response.data.content || null;
  } catch (error) {
    console.error('Error fetching file content:', error);
    return null;
  }
}

// Helper function to detect language from file extension
function detectLanguageFromPath(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase() || '';
  const langMap: Record<string, string> = {
    'java': 'java',
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'cs': 'csharp',
    'py': 'python',
    'go': 'go',
    'rb': 'ruby',
    'rs': 'rust',
    'php': 'php',
    'kt': 'kotlin',
    'swift': 'swift'
  };
  return langMap[ext] || 'unknown';
}

// OPTION 6: Full Codebase Analysis - Analyzes entire repository for deprecated patterns and vulnerabilities
router.post('/analyze-codebase', async (req, res) => {
  try {
    const { repoUrl, branch, language, fileExtensions, excludePaths, maxFiles = 50 }: CodebaseAnalysisRequest = req.body;

    if (!repoUrl) {
      return res.status(400).json({ 
        error: 'GitHub repository URL is required' 
      });
    }

    // Parse GitHub URL
    const parsed = parseGitHubUrl(repoUrl);
    if (!parsed) {
      return res.status(400).json({ 
        error: 'Invalid GitHub URL format' 
      });
    }

    const { owner, repo } = parsed;
    const targetBranch = branch || parsed.branch;

    // Determine file extensions based on language if not provided
    let extensions = fileExtensions;
    if (!extensions && language) {
      const extMap: Record<string, string[]> = {
        'java': ['.java'],
        'javascript': ['.js', '.jsx'],
        'typescript': ['.ts', '.tsx'],
        'csharp': ['.cs'],
        'python': ['.py'],
        'go': ['.go'],
        'ruby': ['.rb'],
        'rust': ['.rs'],
        'php': ['.php'],
        'kotlin': ['.kt']
      };
      extensions = extMap[language] || undefined;
    }

    // Default exclude paths
    const defaultExcludePaths = ['node_modules', '.git', 'target', 'build', 'dist', '.next', 'vendor', 'bin', 'obj'];
    const finalExcludePaths = excludePaths ? [...defaultExcludePaths, ...excludePaths] : defaultExcludePaths;

    // Fetch repository files
    const files = await fetchRepositoryFiles(owner, repo, targetBranch, '', extensions, finalExcludePaths, maxFiles);

    if (files.length === 0) {
      return res.status(404).json({ 
        error: 'No code files found matching the criteria' 
      });
    }

    // Fetch and aggregate code from files (sample approach - fetch first N files)
    const codeSamples: Array<{path: string; language: string; content: string; lines: number}> = [];
    const processedFiles: string[] = [];

    for (const file of files.slice(0, Math.min(maxFiles, 30))) { // Limit to 30 files for analysis
      try {
        // Get raw file content using the blob SHA
        const content = await fetchFileContent(owner, repo, file.sha);
        if (content) {
          const detectedLang = detectLanguageFromPath(file.path);
          if (detectedLang !== 'unknown' || !language) {
            codeSamples.push({
              path: file.path,
              language: detectedLang || language || 'unknown',
              content: content.substring(0, 5000), // Limit content per file to 5KB for analysis
              lines: content.split('\n').length
            });
            processedFiles.push(file.path);
          }
        }
      } catch (error) {
        console.error(`Error processing file ${file.path}:`, error);
      }
    }

    if (codeSamples.length === 0) {
      return res.status(404).json({ 
        error: 'Could not fetch code content from repository files' 
      });
    }

    // Group files by language
    const filesByLanguage = codeSamples.reduce((acc, file) => {
      const lang = file.language;
      if (!acc[lang]) acc[lang] = [];
      acc[lang].push(file);
      return acc;
    }, {} as Record<string, typeof codeSamples>);

    // Build comprehensive codebase summary
    const codebaseSummary = Object.entries(filesByLanguage).map(([lang, files]) => {
      const totalLines = files.reduce((sum, f) => sum + f.lines, 0);
      const codeSnippet = files.map(f => 
        `// File: ${f.path}\n${f.content.substring(0, 2000)}`
      ).join('\n\n---\n\n');
      
      return {
        language: lang,
        fileCount: files.length,
        totalLines,
        codeSample: codeSnippet
      };
    });

    // Create comprehensive analysis prompt
    const prompt = `You are an expert codebase security and modernization analyst. Analyze this entire codebase for deprecated patterns, security vulnerabilities, and modernization opportunities.

REPOSITORY: ${repoUrl}
BRANCH: ${targetBranch}
FILES ANALYZED: ${processedFiles.length}
PROCESSED FILES: ${processedFiles.join(', ')}

CODEBASE SUMMARY:
${codebaseSummary.map(sum => `
Language: ${sum.language}
Files: ${sum.fileCount}
Total Lines: ${sum.totalLines}
`).join('\n')}

CODE SAMPLES BY LANGUAGE:
${codebaseSummary.map(sum => `
=== ${sum.language.toUpperCase()} CODE (${sum.fileCount} files) ===
${sum.codeSample}
`).join('\n\n')}

Provide a comprehensive analysis in JSON format:
{
  "repository": "${repoUrl}",
  "branch": "${targetBranch}",
  "filesAnalyzed": ${processedFiles.length},
  "languages": ${JSON.stringify(Object.keys(filesByLanguage))},
  "overallSeverity": "high|medium|low",
  "modernizationScore": 0-100,
  "criticalIssues": [
    {
      "type": "security|deprecated|vulnerability|performance|maintainability",
      "severity": "critical|high|medium|low",
      "file": "file path",
      "issue": "description",
      "location": "line numbers or pattern",
      "impact": "what this causes",
      "recommendation": "how to fix",
      "codeExample": "snippet showing the issue"
    }
  ],
  "deprecatedPatterns": [
    {
      "pattern": "pattern name",
      "count": "number of occurrences",
      "files": ["list of files"],
      "description": "why it's deprecated",
      "replacement": "modern alternative",
      "migrationComplexity": "low|medium|high"
    }
  ],
  "securityVulnerabilities": [
    {
      "type": "SQL injection|XSS|CSRF|Insecure deserialization|etc",
      "severity": "critical|high|medium|low",
      "file": "file path",
      "line": "line number",
      "description": "vulnerability description",
      "cve": "CVE number if known",
      "fix": "how to fix",
      "codeExample": "vulnerable code snippet"
    }
  ],
  "codeQualityIssues": [
    {
      "type": "code smell|antipattern|technical debt",
      "severity": "high|medium|low",
      "file": "file path",
      "issue": "description",
      "recommendation": "how to improve"
    }
  ],
  "technologyStack": {
    "languages": ["detected languages"],
    "frameworks": ["detected frameworks"],
    "libraries": ["notable libraries"],
    "buildTools": ["build tools detected"]
  },
  "modernizationRecommendations": [
    {
      "priority": "high|medium|low",
      "category": "security|performance|architecture|dependencies",
      "description": "what to modernize",
      "estimatedEffort": "effort estimate",
      "filesAffected": ["list of files"],
      "steps": ["step-by-step guidance"]
    }
  ],
  "technicalDebt": {
    "estimatedDays": "days to fully modernize",
    "priority": "high|medium|low",
    "risk": "risk if not addressed",
    "breakdown": {
      "security": "estimated days for security fixes",
      "deprecated": "estimated days for deprecated pattern removal",
      "refactoring": "estimated days for code refactoring"
    }
  },
  "summary": "comprehensive summary of findings"
}`;

    const response = await axios.post(`${OLLAMA_HOST}/api/chat`, {
      model: DEFAULT_MODEL,
      messages: [{ role: 'user', content: prompt }],
      stream: false
    }, {
      timeout: 300000 // 5 minutes for comprehensive analysis
    });

    try {
      const content = response.data.message.content;
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      const parsedResponse = JSON.parse(jsonStr);
      res.json({
        success: true,
        ...parsedResponse,
        processedFiles,
        model: response.data.model
      });
    } catch (parseError) {
      res.json({
        success: false,
        analysis: response.data.message.content,
        repository: repoUrl,
        branch: targetBranch,
        processedFiles,
        model: response.data.model
      });
    }
  } catch (error) {
    console.error('Error analyzing codebase:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return res.status(404).json({ 
          error: 'Repository not found. Make sure it exists and is accessible.' 
        });
      }
      if (error.response?.status === 403) {
        return res.status(403).json({ 
          error: 'GitHub API rate limit exceeded. Set GITHUB_TOKEN environment variable.' 
        });
      }
    }
    res.status(500).json({ 
      error: 'Failed to analyze codebase',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// OPTION 5b: Analyze dependencies from GitHub repository
router.post('/analyze-dependencies-github', async (req, res) => {
  try {
    const { repoUrl, branch, path }: GitHubAnalysisRequest = req.body;

    if (!repoUrl) {
      return res.status(400).json({ 
        error: 'GitHub repository URL is required (e.g., https://github.com/owner/repo)' 
      });
    }

    // Parse GitHub URL
    const parsed = parseGitHubUrl(repoUrl);
    if (!parsed) {
      return res.status(400).json({ 
        error: 'Invalid GitHub URL format. Use: https://github.com/owner/repo' 
      });
    }

    const { owner, repo } = parsed;
    const targetBranch = branch || parsed.branch;
    const targetPath = path || parsed.path;

    let dependencies: Record<string, string> = {};
    let detectedLanguage = 'unknown';
    let detectedFileType = 'unknown';
    let sourceFiles: string[] = [];

    // If specific path is provided, fetch that file
    if (targetPath) {
      const result = await fetchDependenciesFromGitHub(owner, repo, targetBranch, targetPath);
      if (result) {
        dependencies = result.dependencies;
        detectedLanguage = result.language;
        detectedFileType = result.fileType;
        sourceFiles = [targetPath];
      } else {
        return res.status(404).json({ 
          error: `Could not parse dependency file at path: ${targetPath}` 
        });
      }
    } else {
      // Auto-detect dependency files
      const files = await detectDependencyFiles(owner, repo, targetBranch);
      
      if (files.length === 0) {
        return res.status(404).json({ 
          error: 'No dependency files found. Supported: package.json, pom.xml, *.csproj, requirements.txt, go.mod, etc.' 
        });
      }

      // Use the first detected file (or combine multiple)
      const result = await fetchDependenciesFromGitHub(owner, repo, targetBranch, files[0].path);
      if (result) {
        dependencies = result.dependencies;
        detectedLanguage = result.language;
        detectedFileType = result.fileType;
        sourceFiles = files.map(f => f.path);
      } else {
        return res.status(500).json({ 
          error: `Failed to parse dependency file: ${files[0].path}` 
        });
      }

      // If multiple files found, you could merge them here
      if (files.length > 1) {
        for (let i = 1; i < files.length; i++) {
          const additionalResult = await fetchDependenciesFromGitHub(owner, repo, targetBranch, files[i].path);
          if (additionalResult) {
            Object.assign(dependencies, additionalResult.dependencies);
            sourceFiles.push(files[i].path);
          }
        }
      }
    }

    if (Object.keys(dependencies).length === 0) {
      return res.status(404).json({ 
        error: 'No dependencies found in the repository' 
      });
    }

    // Use the same analysis logic as the regular endpoint
    const depsList = Object.entries(dependencies)
      .map(([name, version]) => `  "${name}": "${version}"`)
      .join('\n');

    const prompt = `Analyze the following ${detectedLanguage} dependencies (from ${detectedFileType}) and provide upgrade recommendations:

REPOSITORY: ${repoUrl}
DEPENDENCY FILE(S): ${sourceFiles.join(', ')}
DEPENDENCIES:
\`\`\`json
{
${depsList}
}
\`\`\`

Provide analysis in JSON format:
{
  "repository": "${repoUrl}",
  "dependencyFiles": ${JSON.stringify(sourceFiles)},
  "language": "${detectedLanguage}",
  "packageManager": "${detectedFileType}",
  "analysis": {
    "totalDependencies": 0,
    "outdatedCount": 0,
    "vulnerableCount": 0,
    "deprecatedCount": 0
  },
  "dependencies": [
    {
      "name": "dependency name",
      "currentVersion": "current version",
      "latestVersion": "latest stable version",
      "status": "up-to-date|outdated|deprecated|vulnerable",
      "securityIssues": ["any security vulnerabilities"],
      "breakingChanges": ["breaking changes in newer versions"],
      "upgradePath": "how to upgrade (major|minor|patch)",
      "impact": "what this dependency affects",
      "recommendation": "should upgrade|keep|replace",
      "upgradeSteps": ["steps to upgrade"],
      "alternative": "modern alternative if applicable"
    }
  ],
  "upgradePlan": {
    "priorityOrder": ["order to upgrade dependencies"],
    "groupedUpgrades": {
      "safe": ["safe to upgrade together"],
      "requiresTesting": ["need careful testing"],
      "breaking": ["requires code changes"]
    },
    "estimatedRisk": "low|medium|high",
    "testingRequired": ["what to test after upgrade"]
  },
  "summary": "brief summary and recommendations"
}`;

    const response = await axios.post(`${OLLAMA_HOST}/api/chat`, {
      model: DEFAULT_MODEL,
      messages: [{ role: 'user', content: prompt }],
      stream: false
    }, {
      timeout: 120000
    });

    try {
      const content = response.data.message.content;
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      const parsedResponse = JSON.parse(jsonStr);
      res.json({
        success: true,
        ...parsedResponse,
        model: response.data.model
      });
    } catch (parseError) {
      res.json({
        success: false,
        analysis: response.data.message.content,
        repository: repoUrl,
        dependencies: dependencies,
        language: detectedLanguage,
        model: response.data.model
      });
    }
  } catch (error) {
    console.error('Error analyzing GitHub dependencies:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return res.status(404).json({ 
          error: 'Repository or file not found. Make sure the repository is public or provide a GITHUB_TOKEN for private repos.' 
        });
      }
      if (error.response?.status === 403) {
        return res.status(403).json({ 
          error: 'GitHub API rate limit exceeded. Set GITHUB_TOKEN environment variable to increase limits.' 
        });
      }
    }
    res.status(500).json({ 
      error: 'Failed to analyze GitHub dependencies',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as modernizationRoutes };


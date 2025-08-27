// xAI API Service for Grok Code Fast Model
// Handles API integration with xai/grok-code-fast-1

const XAI_API_BASE = 'https://api.x.ai/v1';
const MODEL = 'grok-code-fast-1';

class XAIService {
  constructor() {
    this.apiKey = this.getApiKey();
  }

  getApiKey() {
    // Get API key from environment variables
    const apiKey = import.meta.env.VITE_XAI_API_KEY ||
                   process.env.XAI_API_KEY ||
                   process.env.VITE_XAI_API_KEY;

    if (!apiKey) {
      console.warn('xAI API key not found. Please set VITE_XAI_API_KEY environment variable.');
      return null;
    }

    return apiKey;
  }

  async generateCode(prompt, context = {}) {
    if (!this.apiKey) {
      return this.getMockResponse(prompt, 'generate');
    }

    try {
      const messages = this.buildMessages(prompt, context, 'generate');

      const response = await fetch(`${XAI_API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: MODEL,
          messages: messages,
          temperature: 0.3,
          max_tokens: 2000,
          top_p: 0.9
        })
      });

      if (!response.ok) {
        throw new Error(`xAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseCodeResponse(data);
    } catch (error) {
      console.error('xAI API call failed:', error);
      return this.getMockResponse(prompt, 'generate');
    }
  }

  async explainCode(code, context = {}) {
    if (!this.apiKey) {
      return this.getMockResponse(code, 'explain');
    }

    try {
      const prompt = `Please explain what this code does:\n\n${code}`;
      const messages = this.buildMessages(prompt, context, 'explain');

      const response = await fetch(`${XAI_API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: MODEL,
          messages: messages,
          temperature: 0.1,
          max_tokens: 1500,
          top_p: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`xAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseExplanationResponse(data);
    } catch (error) {
      console.error('xAI API call failed:', error);
      return this.getMockResponse(code, 'explain');
    }
  }

  async fixBug(code, errorMessage = '', context = {}) {
    if (!this.apiKey) {
      return this.getMockResponse(code, 'fix');
    }

    try {
      let prompt = `Please identify and fix any bugs in this code:\n\n${code}`;
      if (errorMessage) {
        prompt += `\n\nError message: ${errorMessage}`;
      }

      const messages = this.buildMessages(prompt, context, 'fix');

      const response = await fetch(`${XAI_API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: MODEL,
          messages: messages,
          temperature: 0.2,
          max_tokens: 2000,
          top_p: 0.8
        })
      });

      if (!response.ok) {
        throw new Error(`xAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseFixResponse(data);
    } catch (error) {
      console.error('xAI API call failed:', error);
      return this.getMockResponse(code, 'fix');
    }
  }

  async refactorCode(code, instructions = '', context = {}) {
    if (!this.apiKey) {
      return this.getMockResponse(code, 'refactor');
    }

    try {
      let prompt = `Please refactor and improve this code:\n\n${code}`;
      if (instructions) {
        prompt += `\n\nSpecific instructions: ${instructions}`;
      }

      const messages = this.buildMessages(prompt, context, 'refactor');

      const response = await fetch(`${XAI_API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: MODEL,
          messages: messages,
          temperature: 0.4,
          max_tokens: 2000,
          top_p: 0.9
        })
      });

      if (!response.ok) {
        throw new Error(`xAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseRefactorResponse(data);
    } catch (error) {
      console.error('xAI API call failed:', error);
      return this.getMockResponse(code, 'refactor');
    }
  }

  buildMessages(prompt, context, type) {
    const systemMessage = this.getSystemMessage(type);

    const messages = [
      {
        role: 'system',
        content: systemMessage
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    // Add context if available
    if (context.language) {
      messages[0].content += `\n\nProgramming Language: ${context.language}`;
    }

    if (context.fileName) {
      messages[0].content += `\n\nFile: ${context.fileName}`;
    }

    if (context.projectType) {
      messages[0].content += `\n\nProject Type: ${context.projectType}`;
    }

    return messages;
  }

  getSystemMessage(type) {
    const baseMessage = `You are Grok, a helpful AI coding assistant built by xAI. You are integrated into the AGK Web IDE, a professional code editor similar to Visual Studio Code.`;

    switch (type) {
      case 'generate':
        return `${baseMessage} Your task is to generate high-quality, functional code based on the user's request. Provide clean, well-documented code with proper error handling and best practices.`;
      case 'explain':
        return `${baseMessage} Your task is to explain code clearly and comprehensively. Break down what the code does, how it works, and any important concepts or patterns used.`;
      case 'fix':
        return `${baseMessage} Your task is to identify bugs, errors, or issues in the provided code and suggest fixes. Be specific about what the problem is and how to resolve it.`;
      case 'refactor':
        return `${baseMessage} Your task is to refactor and improve the provided code. Focus on readability, performance, maintainability, and following best practices.`;
      default:
        return baseMessage;
    }
  }

  parseCodeResponse(data) {
    const content = data.choices[0].message.content;

    // Extract code blocks from markdown
    const codeBlocks = content.match(/```(\w+)?\n([\s\S]*?)```/g);
    if (codeBlocks) {
      const code = codeBlocks[0].replace(/```\w*\n?/, '').replace(/```\n?$/, '');
      return {
        success: true,
        content: content,
        code: code.trim(),
        explanation: content.replace(/```[\s\S]*?```/g, '').trim()
      };
    }

    return {
      success: true,
      content: content,
      code: content,
      explanation: 'Generated code'
    };
  }

  parseExplanationResponse(data) {
    const content = data.choices[0].message.content;
    return {
      success: true,
      explanation: content,
      content: content
    };
  }

  parseFixResponse(data) {
    const content = data.choices[0].message.content;

    // Try to extract fixed code
    const codeBlocks = content.match(/```(\w+)?\n([\s\S]*?)```/g);
    let fixedCode = content;
    if (codeBlocks) {
      fixedCode = codeBlocks[0].replace(/```\w*\n?/, '').replace(/```\n?$/, '').trim();
    }

    return {
      success: true,
      content: content,
      fixedCode: fixedCode,
      explanation: content.replace(/```[\s\S]*?```/g, '').trim()
    };
  }

  parseRefactorResponse(data) {
    const content = data.choices[0].message.content;

    // Try to extract refactored code
    const codeBlocks = content.match(/```(\w+)?\n([\s\S]*?)```/g);
    let refactoredCode = content;
    if (codeBlocks) {
      refactoredCode = codeBlocks[0].replace(/```\w*\n?/, '').replace(/```\n?$/, '').trim();
    }

    return {
      success: true,
      content: content,
      refactoredCode: refactoredCode,
      explanation: content.replace(/```[\s\S]*?```/g, '').trim()
    };
  }

  // Fallback responses when API key is not available
  getMockResponse(input, type) {
    const responses = {
      generate: {
        success: false,
        content: "Code generation requires xAI API key. Please set VITE_XAI_API_KEY environment variable.",
        code: "// API key required for code generation",
        explanation: "Mock response - API key needed"
      },
      explain: {
        success: false,
        explanation: "Code explanation requires xAI API key. Please set VITE_XAI_API_KEY environment variable.",
        content: "Mock response - API key needed"
      },
      fix: {
        success: false,
        content: "Bug fixing requires xAI API key. Please set VITE_XAI_API_KEY environment variable.",
        fixedCode: "// API key required for bug fixing",
        explanation: "Mock response - API key needed"
      },
      refactor: {
        success: false,
        content: "Code refactoring requires xAI API key. Please set VITE_XAI_API_KEY environment variable.",
        refactoredCode: "// API key required for refactoring",
        explanation: "Mock response - API key needed"
      }
    };

    return responses[type] || responses.generate;
  }

  // Check if API is available
  isAvailable() {
    return !!this.apiKey;
  }

  // Get API status
  getStatus() {
    return {
      available: this.isAvailable(),
      model: MODEL,
      baseUrl: XAI_API_BASE
    };
  }
}

// Export singleton instance
const xaiService = new XAIService();
export default xaiService;
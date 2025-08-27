import React, { useState, useRef, useEffect } from 'react'
import xaiService from '../services/xaiService'

function AIAssistant({ onInsertCode, onReplaceCode, currentCode, selectedCode }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: "👋 Hi! I'm your AI coding assistant. I can help you with:",
      timestamp: new Date(),
      capabilities: [
        '💻 Code generation and completion',
        '🔧 Bug fixing and debugging',
        '📚 Code explanation and documentation',
        '🔄 Refactoring and optimization',
        '📖 Best practices and suggestions'
      ],
      actions: ['generate', 'explain', 'fix', 'refactor']
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const callXAI = async (userMessage) => {
    setIsTyping(true)

    try {
      // Prepare context for AI
      const context = {
        language: selectedCode ? detectLanguage(selectedCode) : (currentCode ? detectLanguage(currentCode) : 'javascript'),
        fileName: 'current_file',
        projectType: 'web-development'
      }

      let result

      // Determine the type of request and call appropriate xAI method
      const lowerMessage = userMessage.toLowerCase()

      if (lowerMessage.includes('generate') || lowerMessage.includes('create')) {
        result = await xaiService.generateCode(userMessage, context)
      } else if (lowerMessage.includes('explain') || lowerMessage.includes('what')) {
        const codeToExplain = selectedCode || currentCode || 'Please provide code to explain'
        result = await xaiService.explainCode(codeToExplain, context)
      } else if (lowerMessage.includes('fix') || lowerMessage.includes('bug') || lowerMessage.includes('error')) {
        const codeToFix = selectedCode || currentCode || 'Please provide code to fix'
        result = await xaiService.fixBug(codeToFix, '', context)
      } else if (lowerMessage.includes('refactor') || lowerMessage.includes('improve')) {
        const codeToRefactor = selectedCode || currentCode || 'Please provide code to refactor'
        result = await xaiService.refactorCode(codeToRefactor, userMessage, context)
      } else {
        // General query - use generateCode for natural language requests
        result = await xaiService.generateCode(userMessage, context)
      }

      // Process the result
      let response = result.content || result.explanation || 'I received your request but couldn\'t process it properly.'
      let suggestions = []

      // Extract code suggestions if available
      if (result.code) {
        suggestions.push({
          type: 'code',
          title: 'Generated Code',
          content: result.code
        })
      }

      if (result.fixedCode && result.fixedCode !== result.content) {
        suggestions.push({
          type: 'fix',
          title: 'Fixed Code',
          content: result.fixedCode
        })
      }

      if (result.refactoredCode && result.refactoredCode !== result.content) {
        suggestions.push({
          type: 'refactor',
          title: 'Refactored Code',
          content: result.refactoredCode
        })
      }

      // Add API status information
      const apiStatus = xaiService.getStatus()
      if (!apiStatus.available) {
        response += '\n\n⚠️ **Note:** xAI API key not configured. Please set VITE_XAI_API_KEY environment variable to enable real AI responses.'
      }

      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
        suggestions: suggestions.length > 0 ? suggestions : undefined
      }])

    } catch (error) {
      console.error('AI Service Error:', error)
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'assistant',
        content: `❌ Sorry, I encountered an error while processing your request: ${error.message}\n\nPlease check your xAI API configuration and try again.`,
        timestamp: new Date()
      }])
    } finally {
      setIsTyping(false)
    }
  }

  const detectLanguage = (code) => {
    if (code.includes('function') || code.includes('const') || code.includes('import')) return 'JavaScript'
    if (code.includes('def ') || code.includes('import ')) return 'Python'
    if (code.includes('fn ') || code.includes('use ')) return 'Rust'
    if (code.includes('class ') || code.includes('public')) return 'Java'
    return 'code'
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }])

    const messageToSend = inputMessage
    setInputMessage('')

    // Generate AI response
    callXAI(messageToSend)
  }

  const handleQuickAction = async (action) => {
    let message = ''
    switch (action) {
      case 'generate':
        message = 'Generate a React component for a user login form'
        break
      case 'explain':
        message = selectedCode
          ? `Explain what this selected code does: ${selectedCode}`
          : 'Explain what this code does'
        break
      case 'fix':
        message = selectedCode
          ? `Fix any bugs in this selected code: ${selectedCode}`
          : 'Fix any bugs in this code'
        break
      case 'refactor':
        message = selectedCode
          ? `Refactor this selected code for better performance and readability: ${selectedCode}`
          : 'Refactor this code for better performance and readability'
        break
    }

    setInputMessage(message)
    // Auto-send the message
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} }
      handleSendMessage(fakeEvent)
    }, 100)
  }

  const handleApplySuggestion = (suggestion) => {
    if (onInsertCode) {
      onInsertCode(suggestion.content)
    }
  }

  return (
    <div className="ai-assistant">
      <div className="ai-header">
        <div className="ai-header-title">
          <span className="ai-icon">🤖</span>
          <span className="ai-title">AI Assistant</span>
        </div>
        <div className="ai-status">
          <span className="ai-status-dot"></span>
          <span className="ai-status-text">Online</span>
        </div>
      </div>

      <div className="ai-chat">
        <div className="ai-messages">
          {messages.map(message => (
            <div key={message.id} className={`ai-message ai-message-${message.type}`}>
              {message.type === 'assistant' && <div className="ai-avatar">🤖</div>}
              {message.type === 'user' && <div className="ai-avatar">👤</div>}

              <div className="ai-message-content">
                <div className="ai-message-text">{message.content}</div>

                {message.capabilities && (
                  <div className="ai-capabilities">
                    {message.capabilities.map((capability, index) => (
                      <div key={index} className="capability">{capability}</div>
                    ))}
                  </div>
                )}

                {message.actions && (
                  <div className="ai-quick-actions">
                    {message.actions.map((action, index) => (
                      <button
                        key={index}
                        className="ai-quick-btn"
                        onClick={() => handleQuickAction(action)}
                      >
                        {action === 'generate' && '✨ Generate'}
                        {action === 'explain' && '🔍 Explain'}
                        {action === 'fix' && '🐛 Fix'}
                        {action === 'refactor' && '🔄 Refactor'}
                      </button>
                    ))}
                  </div>
                )}

                {message.suggestions && (
                  <div className="ai-suggestions">
                    {message.suggestions.map((suggestion, index) => (
                      <div key={index} className="ai-suggestion">
                        <div className="suggestion-header">
                          <span className="suggestion-title">{suggestion.title}</span>
                          <button
                            className="apply-btn"
                            onClick={() => handleApplySuggestion(suggestion)}
                          >
                            Apply
                          </button>
                        </div>
                        <pre className="suggestion-code">{suggestion.content}</pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="ai-message ai-message-assistant">
              <div className="ai-avatar">🤖</div>
              <div className="ai-message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form className="ai-input-form" onSubmit={handleSendMessage}>
          <div className="ai-input-container">
            <input
              type="text"
              className="ai-input"
              placeholder="Ask me anything about your code..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isTyping}
            />
            <button type="submit" className="ai-send-btn" disabled={isTyping || !inputMessage.trim()}>
              📤
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AIAssistant
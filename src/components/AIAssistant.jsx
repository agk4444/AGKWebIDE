import React, { useState, useRef, useEffect } from 'react'

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

  const simulateAIResponse = (userMessage) => {
    // Simulate AI processing time
    setIsTyping(true)
    setTimeout(() => {
      let response = ''
      let suggestions = []

      // Analyze the user message and generate appropriate response
      const lowerMessage = userMessage.toLowerCase()

      if (lowerMessage.includes('generate') || lowerMessage.includes('create')) {
        response = "I'll help you generate that code! Here's a well-structured solution:"
        suggestions = [
          {
            type: 'code',
            title: 'Generated Code',
            content: `function exampleFunction(param) {\n  // Generated code here\n  console.log('Hello, ${param}!');\n  return param;\n}`
          }
        ]
      } else if (lowerMessage.includes('explain') || lowerMessage.includes('what')) {
        response = "Let me explain this code for you:"
        if (currentCode) {
          suggestions = [
            {
              type: 'explanation',
              title: 'Code Explanation',
              content: `This code appears to be a ${detectLanguage(currentCode)} function that...`
            }
          ]
        }
      } else if (lowerMessage.includes('fix') || lowerMessage.includes('bug') || lowerMessage.includes('error')) {
        response = "I found a potential issue in your code. Here's the fix:"
        suggestions = [
          {
            type: 'fix',
            title: 'Suggested Fix',
            content: '// Fixed version\n' + (currentCode || '/* Your code here */')
          }
        ]
      } else if (lowerMessage.includes('refactor') || lowerMessage.includes('improve')) {
        response = "Here's a refactored version with improvements:"
        suggestions = [
          {
            type: 'refactor',
            title: 'Refactored Code',
            content: `// Improved version with better practices\n${currentCode || '/* Refactored code */'}`
          }
        ]
      } else {
        response = "I'm here to help! You can ask me to:\n\n• Generate code for specific tasks\n• Explain existing code\n• Fix bugs and errors\n• Refactor and optimize code\n• Add documentation\n• Suggest best practices\n\nWhat would you like me to help you with?"
      }

      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
        suggestions: suggestions
      }])

      setIsTyping(false)
    }, 1000 + Math.random() * 2000)
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
    simulateAIResponse(messageToSend)
  }

  const handleQuickAction = (action) => {
    let message = ''
    switch (action) {
      case 'generate':
        message = 'Generate a function to handle user authentication'
        break
      case 'explain':
        message = 'Explain what this code does'
        break
      case 'fix':
        message = 'Fix any bugs in this code'
        break
      case 'refactor':
        message = 'Refactor this code for better performance'
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
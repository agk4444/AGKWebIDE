import React, { useState } from 'react'

function AgenticPanel({ onAnalyzeCode, onFormatCode }) {
  const [isVisible, setIsVisible] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyzeCode = async () => {
    setIsAnalyzing(true)
    try {
      // The actual analysis will be handled by the parent component
      // This component just manages the UI state
      onAnalyzeCode()

      // For now, show a placeholder
      setAnalysis({
        lineCount: 0,
        wordCount: 0,
        isTrimmed: false
      })
      setSuggestions([
        'Consider adding error handling',
        'Review code complexity',
        'Check for potential optimizations'
      ])
      setIsVisible(true)
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleFormatCode = () => {
    onFormatCode()
    // Could add a success message here
  }

  const closePanel = () => {
    setIsVisible(false)
    setAnalysis(null)
    setSuggestions([])
  }

  return (
    <>
      <div className="agentic-panel-controls">
        <button
          className="agentic-btn analyze-btn"
          onClick={handleAnalyzeCode}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? '🔄 Analyzing...' : '🔍 Analyze Code'}
        </button>
        <button
          className="agentic-btn format-btn"
          onClick={handleFormatCode}
        >
          🎨 Format Code
        </button>
      </div>

      {isVisible && (
        <div className="agentic-panel-overlay">
          <div className="agentic-panel">
            <div className="agentic-panel-header">
              <h3>🤖 Agentic Analysis</h3>
              <button className="close-btn" onClick={closePanel}>×</button>
            </div>

            <div className="agentic-panel-content">
              {analysis && (
                <div className="analysis-section">
                  <h4>📊 Code Metrics</h4>
                  <div className="metrics-grid">
                    <div className="metric">
                      <span className="metric-label">Lines:</span>
                      <span className="metric-value">{analysis.lineCount}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Words:</span>
                      <span className="metric-value">{analysis.wordCount}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Trimmed:</span>
                      <span className="metric-value">{analysis.isTrimmed ? '✅' : '❌'}</span>
                    </div>
                  </div>
                </div>
              )}

              {suggestions.length > 0 && (
                <div className="suggestions-section">
                  <h4>💡 Suggestions</h4>
                  <ul className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                      <li key={index} className="suggestion-item">
                        <span className="suggestion-bullet">•</span>
                        <span className="suggestion-text">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="agentic-actions">
                <button
                  className="action-btn apply-btn"
                  onClick={() => {
                    // Apply suggestions logic would go here
                    console.log('Applying suggestions...')
                  }}
                >
                  ✅ Apply All
                </button>
                <button
                  className="action-btn ignore-btn"
                  onClick={closePanel}
                >
                  🚫 Ignore
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AgenticPanel
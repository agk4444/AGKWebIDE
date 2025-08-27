import React from 'react'

function ActivityBar({ activeView, onViewChange }) {
  const views = [
    { id: 'explorer', icon: '📁', title: 'Explorer', color: '#ffffff' },
    { id: 'search', icon: '🔍', title: 'Search', color: '#ffffff' },
    { id: 'git', icon: '🟢', title: 'Source Control', color: '#ffffff' },
    { id: 'extensions', icon: '🔌', title: 'Extensions', color: '#ffffff' },
  ]

  return (
    <div className="activity-bar">
      {views.map(view => (
        <button
          key={view.id}
          className={`activity-item ${activeView === view.id ? 'active' : ''}`}
          onClick={() => onViewChange(view.id)}
          title={view.title}
        >
          <span className="activity-icon">{view.icon}</span>
        </button>
      ))}
      <div className="activity-bar-bottom">
        <button className="activity-item" title="Settings">
          <span className="activity-icon">⚙️</span>
        </button>
      </div>
    </div>
  )
}

export default ActivityBar
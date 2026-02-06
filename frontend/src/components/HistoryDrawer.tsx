import type { Conversation } from '../types';
import './HistoryDrawer.css';

interface HistoryDrawerProps {
  isOpen: boolean;
  conversations: Conversation[];
  currentConversationId: string | null;
  onClose: () => void;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

export default function HistoryDrawer({
  isOpen,
  conversations,
  currentConversationId,
  onClose,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
}: HistoryDrawerProps) {
  if (!isOpen) return null;

  const sortedConversations = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="history-drawer animate-slideInRight">
        <div className="drawer-header">
          <h2>Chat History</h2>
          <button className="close-button" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <button className="new-chat-button" onClick={onNewConversation}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Conversation
        </button>

        <div className="conversations-list">
          {sortedConversations.length === 0 ? (
            <div className="empty-history">
              <p>No conversations yet</p>
              <span>Start chatting to see your history here</span>
            </div>
          ) : (
            sortedConversations.map((conv) => (
              <div
                key={conv.id}
                className={`conversation-item ${conv.id === currentConversationId ? 'active' : ''}`}
                onClick={() => onSelectConversation(conv.id)}
              >
                <div className="conversation-info">
                  <div className="conversation-title">{conv.title}</div>
                  <div className="conversation-meta">
                    {conv.messages.length} messages • {new Date(conv.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <button
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conv.id);
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

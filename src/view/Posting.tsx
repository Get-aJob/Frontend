import React from 'react';
import { RefreshCw } from 'lucide-react';
import PostingList from '@/components/Posting/PostingList';

const styles = {
  container: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column' as const,
    flex: 1,
    background: '#f4f5f8',
    minHeight: '100%',
  },
  apiBar: {
    background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)',
    border: '1.5px solid #c7d2fe',
    borderRadius: '12px',
    padding: '14px 18px',
    marginBottom: '18px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  apiStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#4f46e5',
  },
  apiDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#10b981',
    flexShrink: 0,
    animation: 'pulse 2s infinite',
  },
  crawlingText: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#111827',
  },
  flexRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '18px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#111827',
  },
};

const PostingView: React.FC = () => {
  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `}
      </style>

      <div style={styles.apiBar}>
        <div style={{ ...styles.crawlingText, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RefreshCw size={14} color="#4f46e5" />
          <span>6시간 마다 채용 공고 크롤링</span>
        </div>
      </div>

      <div style={styles.flexRow}>
        <h1 style={styles.title}>전체 공고</h1>
        {/* Removed job tags, filters, and api sources as requested */}
      </div>

      <PostingList />
    </div>
  );
};

export default PostingView;

import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import PostingList from '@/components/Posting/PostingList';
import { usePostingStore } from '@/store/usePostingStore';
import JobModal from '@/components/jobPostForm/JobModal';

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
    justifyContent: 'space-between',
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
  tabContainer: {
    display: 'flex',
    background: '#e2e8f0',
    padding: '4px',
    borderRadius: '8px',
    gap: '4px',
  },
  tab: (isActive: boolean) => ({
    padding: '6px 12px',
    fontSize: '13px',
    fontWeight: 600,
    borderRadius: '6px',
    cursor: 'pointer',
    background: isActive ? '#fff' : 'transparent',
    color: isActive ? '#1e293b' : '#64748b',
    boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
    border: 'none',
    transition: 'all 0.2s',
  }),
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: '#4f46e5',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
};

const PostingView: React.FC = () => {
  const { sourceType, setSourceType } = usePostingStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '18px' }}>
        <div style={styles.tabContainer}>
          <button style={styles.tab(sourceType === 'auto')} onClick={() => setSourceType('auto')}>
            전체 공고
          </button>
          <button
            style={styles.tab(sourceType === 'manual')}
            onClick={() => setSourceType('manual')}
          >
            내가 등록한 공고
          </button>
        </div>
      </div>

      <PostingList />
      {isModalOpen && <JobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default PostingView;

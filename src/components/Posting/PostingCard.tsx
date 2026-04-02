import React from 'react';
import type { JobPosting } from '@/types/Posting';
import PostingActionButtons from './PostingActionButtons';

interface PostingCardProps {
  job: JobPosting & { isScrapped?: boolean };
}

const styles = {
  card: {
    background: '#ffffff',
    border: '1.5px solid #e8eaf0',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    minHeight: '180px',
    transition: 'all 0.15s ease',
    cursor: 'pointer',
    fontFamily: '"Noto Sans KR", sans-serif',
  },
  topSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    position: 'relative' as const,
  },
  logoBoxInfo: {
    width: '54px',
    height: '54px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    fontWeight: 800,
    color: '#fff',
    backgroundColor: '#4ade80',
    flexShrink: 0,
  },
  logoImg: {
    width: '54px',
    height: '54px',
    borderRadius: '14px',
    objectFit: 'contain' as const,
    backgroundColor: '#fff',
    border: '1px solid #f3f4f6',
    flexShrink: 0,
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    flex: 1,
    paddingRight: '60px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#1f2937',
    marginBottom: '6px',
    letterSpacing: '-0.3px',
    lineHeight: '1.3',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
  },
  company: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#6b7280',
    letterSpacing: '-0.2px',
  },
  deadline: {
    position: 'absolute' as const,
    top: '4px',
    right: '0',
    fontSize: '14px',
    fontWeight: 800,
  },
  bottomSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: '28px',
  },
  tagsLeft: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  tagRow: {
    display: 'flex',
    gap: '8px',
  },
  expTag: {
    background: '#f3f0ff',
    color: '#7c3aed',
    fontSize: '12px',
    fontWeight: 700,
    padding: '4px 10px',
    borderRadius: '6px',
  },
  locTag: {
    background: '#f3f0ff',
    color: '#7c3aed',
    fontSize: '12px',
    fontWeight: 700,
    padding: '4px 10px',
    borderRadius: '6px',
  },
  sourceTag: {
    background: '#f0f9ff',
    color: '#0284c7',
    fontSize: '12px',
    fontWeight: 700,
    padding: '4px 10px',
    borderRadius: '6px',
    width: 'max-content',
  },
};

const PostingCard: React.FC<PostingCardProps> = ({ job }) => {
  const getDdayColor = (dday: string) => {
    if (dday === 'D-Day' || dday.includes('마감')) return '#f43f5e';

    const match = dday.match(/^D-(\d+)$/);
    if (match) {
      const days = parseInt(match[1], 10);
      if (days <= 3) return '#f43f5e';
      if (days <= 7) return '#f59e0b';
      return '#10b981';
    }
    return '#6b7280';
  };

  const handleClick = () => {
    if (job.url) {
      window.open(job.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (e.key === ' ') e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      style={styles.card}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div style={styles.topSection}>
        {job.companyLogo ? (
          <img src={job.companyLogo} alt={job.companyName} style={styles.logoImg} />
        ) : (
          <div style={styles.logoBoxInfo}>
            {job.companyName ? job.companyName.charAt(0).toUpperCase() : 'C'}
          </div>
        )}

        <div style={styles.textContainer}>
          <div style={styles.title}>{job.title}</div>
          <div style={styles.company}>{job.companyName}</div>
        </div>

        <div
          style={{
            ...styles.deadline,
            color: job.deadline.includes('상시') ? '#059669' : getDdayColor(job.deadline),
            ...(job.deadline.includes('상시') || job.deadline.includes('채용시')
              ? {
                  background: '#ecfdf5',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: '1px solid #a7f3d0',
                  fontSize: '11px',
                  top: '0px',
                }
              : {}),
          }}
        >
          {job.deadline}
        </div>
      </div>

      <div style={styles.bottomSection}>
        <div style={styles.tagsLeft}>
          <div style={styles.tagRow}>
            {job.experienceLevel && <span style={styles.expTag}>{job.experienceLevel}</span>}
            <span style={styles.locTag}>{job.location || '전국'}</span>
          </div>
          <div style={styles.tagRow}>
            <span style={styles.sourceTag}>{job.site}</span>
          </div>
        </div>

        <PostingActionButtons url={job.url} jobId={job.id} isScrapped={job.isScrapped} />
      </div>
    </div>
  );
};

export default PostingCard;

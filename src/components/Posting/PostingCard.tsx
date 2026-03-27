import React from 'react';
import type { JobPosting } from '@/types/Posting';
import PostingActionButtons from './PostingActionButtons';

interface PostingCardProps {
  job: JobPosting;
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
    backgroundColor: '#4ade80', // 네이버 등 기본 그린 색상
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
    paddingRight: '60px', // 우측 상단 텍스트(deadline)와 겹치지 않게 여유 공간
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
    if (
      dday.includes('마감') ||
      dday.includes('D-1') ||
      dday.includes('D-2') ||
      dday.includes('D-3') ||
      dday.includes('D-Day')
    )
      return '#f43f5e'; // 로즈 (위험)
    if (dday.includes('D-') && parseInt(dday.split('-')[1].replace(/[^0-9]/g, '')) <= 7)
      return '#f59e0b'; // 앰버 (주의)
    return '#10b981'; // 에메랄드 (안전)
  };

  const handleClick = () => {
    if (job.url) {
      window.open(job.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div style={styles.card} onClick={handleClick}>
      <div style={styles.topSection}>
        {/* 맨 왼쪽: company_logo */}
        {job.companyLogo ? (
          <img src={job.companyLogo} alt={job.companyName} style={styles.logoImg} />
        ) : (
          <div style={styles.logoBoxInfo}>
            {job.companyName ? job.companyName.charAt(0).toUpperCase() : 'C'}
          </div>
        )}

        {/* 로고 우측: title 그 아래 company_name */}
        <div style={styles.textContainer}>
          <div style={styles.title}>{job.title}</div>
          <div style={styles.company}>{job.companyName}</div>
        </div>

        {/* 맨 오른쪽 상단: deadline / deadline_text */}
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
        {/* 왼쪽 하단: experience, location, source_type */}
        <div style={styles.tagsLeft}>
          <div style={styles.tagRow}>
            {job.experienceLevel && <span style={styles.expTag}>{job.experienceLevel}</span>}
            <span style={styles.locTag}>{job.location || '전국'}</span>
          </div>
          <div style={styles.tagRow}>
            <span style={styles.sourceTag}>{job.site}</span>
          </div>
        </div>

        {/* 오른쪽 하단 버튼들 컴포넌트로 분리 */}
        <PostingActionButtons url={job.url} />
      </div>
    </div>
  );
};

export default PostingCard;

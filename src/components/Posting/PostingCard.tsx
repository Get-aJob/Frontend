import React from 'react';
import type { JobPosting } from '@/types/Posting';
import PostingActionButtons from './PostingActionButtons';

interface PostingCardProps {
  job: JobPosting;
}

const PostingCard: React.FC<PostingCardProps> = ({ job }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex-1">
        <div className="flex items-start justify-between mb-4">
          <img
            src={job.companyLogo || '/default-logo.png'}
            alt={job.companyName}
            className="w-12 h-12 rounded-lg object-contain border border-gray-100"
          />
          <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded">
            {job.site}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{job.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{job.companyName}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {job.location}
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {job.experienceLevel}
          </span>
        </div>
      </div>

      <PostingActionButtons job={job} />
    </div>
  );
};

export default PostingCard;

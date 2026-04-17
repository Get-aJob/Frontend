import type { JobPosting } from '@/types/Posting';
import PostingCard from './PostingCard';

interface PostingListProps {
  postings: JobPosting[];
  appliedJobIds?: Set<string>;
  onDetail: (job: JobPosting) => void;
}

const PostingList = ({ postings, appliedJobIds, onDetail }: PostingListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {postings.map((posting) => (
        <PostingCard
          key={posting.id}
          posting={posting}
          isApplied={!!appliedJobIds?.has(String(posting.id))}
          onDetail={onDetail}
        />
      ))}
    </div>
  );
};

export default PostingList;

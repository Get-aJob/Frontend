import type { JobPosting } from '@/types/Posting';
import PostingCard from './PostingCard';

interface PostingListProps {
  postings: JobPosting[];
  appliedJobIds?: Set<string>;
  onScrap: (id: string | number) => void;
  onDetail: (job: JobPosting) => void;
}

const PostingList = ({ postings, appliedJobIds, onScrap, onDetail }: PostingListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {postings.map((posting) => (
        <PostingCard
          key={posting.id}
          posting={posting}
          isScrapped={posting.isScrapped}
          isApplied={appliedJobIds?.has(String(posting.id))}
          onScrap={onScrap}
          onDetail={onDetail}
        />
      ))}
    </div>
  );
};

export default PostingList;

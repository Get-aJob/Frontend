import type { JobPosting } from '@/types/Posting';
import PostingCard from './PostingCard';

interface PostingListProps {
  postings: JobPosting[];
  onScrap: (id: string | number) => void;
  onDetail: (job: JobPosting) => void;
}

const PostingList = ({ postings, onScrap, onDetail }: PostingListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {postings.map((posting) => (
        <PostingCard
          key={posting.id}
          posting={posting}
          isScrapped={posting.isScrapped}
          onScrap={onScrap}
          onDetail={onDetail}
        />
      ))}
    </div>
  );
};

export default PostingList;

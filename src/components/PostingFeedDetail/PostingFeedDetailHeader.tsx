import type { JobPosting } from '@/types/Posting';

type Props = {
  job?: JobPosting;
};

const PostingFeedDetailHeader = ({ job }: Props) => {
  return (
    <section className="mb-5 rounded-2xl border border-[#e8eaf0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        {job?.companyLogo ? (
          <img
            src={job.companyLogo}
            alt={job.companyName}
            className="h-14 w-14 rounded-xl border border-[#f3f4f6] bg-white object-contain"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#4ade80] text-xl font-extrabold text-white">
            {job?.companyName ? job.companyName.charAt(0).toUpperCase() : 'C'}
          </div>
        )}

        <div className="min-w-0">
          <p className="truncate text-lg font-bold text-[#111827]">
            {job?.companyName ?? '회사 정보'}
          </p>
          <p className="mt-1 text-sm text-[#6b7280]">
            {job?.title ?? '채용 공고 제목'} · {job?.location ?? '근무지 정보 없음'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default PostingFeedDetailHeader;

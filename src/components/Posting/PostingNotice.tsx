import { AlertCircle } from 'lucide-react';

const PostingNotice = () => {
  return (
    <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 p-4 rounded-xl mb-6 animate-[fadeUp_0.3s_ease]">
      <AlertCircle size={20} className="text-indigo-600 shrink-0" />
      <div className="text-sm text-indigo-900 leading-relaxed">
        <span className="font-bold">안내:</span> 모든 채용 정보는{' '}
        <span className="font-bold">6시간마다 자동으로 크롤링</span>되어 업데이트됩니다. 직접
        등록하거나 수동으로 가져온 공고는 즉시 반영됩니다.
      </div>
    </div>
  );
};

export default PostingNotice;

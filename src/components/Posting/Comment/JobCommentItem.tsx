import { Trash2 } from 'lucide-react';
import type { FeedComment } from '@/types/Comment';

interface JobCommentItemProps {
  item: FeedComment;
  onDelete: (id: string | number) => void;
  canDelete: boolean;
}

const JobCommentItem = ({ item, onDelete, canDelete }: JobCommentItemProps) => {
  // 엑스박스 방지 방어 코드
  const profileImg = item.userImage && item.userImage !== 'null' ? item.userImage : null;

  return (
    <div className="bg-white border border-gray-50 p-5 rounded-3xl transition-all hover:border-btn-point/10">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-body font-black text-btn-point border border-purple-100 shrink-0 overflow-hidden">
            {profileImg ? (
              <img
                src={profileImg}
                alt={`${item.userNickname}님의 프로필`}
                className="w-full h-full object-cover"
              />
            ) : (
              item.userNickname?.charAt(0) || 'U'
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-subtitle font-black text-gray-900">{item.userNickname}</span>
            <span className="text-[11px] text-gray-400 font-medium">
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        {canDelete && (
          <button
            onClick={() => onDelete(item.id)}
            className="p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      <p className="text-body text-gray-600 leading-relaxed pl-11 whitespace-pre-wrap font-medium">
        {item.content}
      </p>
    </div>
  );
};

export default JobCommentItem;

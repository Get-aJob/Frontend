// src/components/common/Topbar/AddJobModal.tsx

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddJobModal = ({ isOpen, onClose }: AddJobModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[#111827]/50 backdrop-blur-[3px] z-1000 transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-7 w-125 max-h-[86vh] overflow-y-auto shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-[18px] font-extrabold mb-5.5">✚ 새 공고 등록</div>
        <div className="flex items-center gap-2 px-3.5 py-2.75 bg-[#eef2ff] border-[1.5px] border-dashed border-[#c7d2fe] rounded-[10px] mb-4">
          <span className="text-[#4f46e5]">🔗</span>
          <input
            className="flex-1 bg-transparent border-none outline-none text-[12.5px]"
            placeholder="사람인 / 잡코리아 / 원티드 URL 붙여넣기"
          />
          <button className="px-3.25 py-1.5 text-[12px] font-bold text-white bg-[#4f46e5] rounded-lg hover:bg-[#4338ca] transition-colors">
            파싱
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3.25">
          <div>
            <label className="block text-[12px] text-[#6b7280] font-semibold mb-1.5">
              회사명 *
            </label>
            <input
              className="w-full bg-[#f8f9fc] border-[1.5px] border-[#e8eaf0] rounded-[9px] px-3.25 py-2.25 text-[13.5px] outline-none focus:border-[#4f46e5] transition-colors"
              placeholder="예: 네이버"
            />
          </div>
          <div>
            <label className="block text-[12px] text-[#6b7280] font-semibold mb-1.5">직군 *</label>
            <input
              className="w-full bg-[#f8f9fc] border-[1.5px] border-[#e8eaf0] rounded-[9px] px-3.25 py-2.25 text-[13.5px] outline-none focus:border-[#4f46e5] transition-colors"
              placeholder="예: 프론트엔드"
            />
          </div>
        </div>
        <div className="mb-3.25">
          <label className="block text-[12px] text-[#6b7280] font-semibold mb-1.5">태그</label>
          <input
            className="w-full bg-[#f8f9fc] border-[1.5px] border-[#e8eaf0] rounded-[9px] px-3.25 py-2.25 text-[13.5px] outline-none focus:border-[#4f46e5] transition-colors"
            placeholder="예: React, 신입"
          />
        </div>
        <div className="flex justify-end gap-2.5 mt-5 pt-4.5 border-t-[1.5px] border-[#e8eaf0]">
          <button
            className="px-4 py-2 text-[13px] font-bold text-[#6b7280] bg-white border-[1.5px] border-[#e8eaf0] rounded-[10px] hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="px-4 py-2 text-[13px] font-bold text-white bg-[#4f46e5] rounded-[10px] hover:bg-[#4338ca] transition-colors"
            onClick={() => {
              alert('등록되었습니다!');
              onClose();
            }}
          >
            등록하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddJobModal;

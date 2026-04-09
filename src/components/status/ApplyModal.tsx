import React, { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { createApplication, getApplicationStatuses } from '@/api/Status';
import type { ApplicationStatus } from '@/types/Status';
import { useStatusStore } from '@/store/useStatusStore';
import ConfirmModal from '@/components/common/UI/ConfirmModal';
import { PATH } from '@/router/Path';

interface ApplyModalProps {
  jobPostingId: string;
  companyName: string;
  title: string;
  onClose: () => void;
  onSuccess: () => void;
}

const ApplyModal: React.FC<ApplyModalProps> = ({
  jobPostingId,
  companyName,
  title,
  onClose,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const [statusId, setStatusId] = useState<string>('');
  const [appliedAt, setAppliedAt] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [options, setOptions] = useState<ApplicationStatus[]>([]);
  const { fetchData } = useStatusStore();

  useEffect(() => {
    getApplicationStatuses().then(setOptions).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusId) return alert('지원 상태를 선택해주세요.');

    setLoading(true);
    try {
      await createApplication({
        jobPostingId,
        statusId,
        appliedAt: new Date(appliedAt).toISOString(),
        notes,
      });

      await fetchData();
      // ✨ [수정 핵심] 여기서 onSuccess()와 onClose()를 바로 호출하지 않고 성공 모달만 엽니다.
      setIsSuccessModalOpen(true);
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === 409) alert('이미 지원한 공고입니다.');
      else alert('지원 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // ✨ 모달을 닫을 때 부모(ScrapCard 등)에게 완료를 알림
  const handleConfirmClose = () => {
    setIsSuccessModalOpen(false);
    onSuccess();
    onClose();
  };

  const handleGoToStatus = () => {
    setIsSuccessModalOpen(false);
    onSuccess();
    onClose();
    navigate(PATH.STATUS);
  };

  // 폼이 보일지 말지 결정 (성공 모달이 뜨면 폼은 뒤에 흐리게 남겨둠)
  return (
    <>
      <div
        className="fixed inset-0 z-1200 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900">지원 정보 입력</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="닫기"
              aria-label="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="bg-blue-50 p-3 rounded-xl text-blue-700 text-sm font-semibold mb-6">
            🏢 {companyName} <span className="mx-1 text-blue-300">|</span> {title}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 ml-1">지원일</label>
              <input
                type="date"
                value={appliedAt}
                onChange={(e) => setAppliedAt(e.target.value)}
                required
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-btn-point outline-none transition-all"
                title="지원일 선택"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 ml-1">지원 상태</label>
              <select
                value={statusId}
                onChange={(e) => setStatusId(e.target.value)}
                required
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-btn-point outline-none bg-white transition-all cursor-pointer"
                title="지원 상태 선택"
              >
                <option value="">지원 상태를 선택하세요</option>
                {options.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.displayName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 ml-1">메모</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="지원 시 특이사항을 적어주세요."
                className="w-full p-3 border border-gray-200 rounded-xl h-28 resize-none focus:ring-2 focus:ring-btn-point outline-none transition-all"
              />
            </div>

            <div className="flex gap-3 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3.5 bg-btn-point text-white rounded-xl font-bold hover:opacity-90 disabled:bg-gray-300 transition-all shadow-lg"
              >
                {loading ? '등록 중...' : '지원 완료'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ✨ 지원 완료 모달 (z-index를 더 높게 설정) */}
      <div className="relative z-1300">
        <ConfirmModal
          isOpen={isSuccessModalOpen}
          onClose={handleConfirmClose}
          onConfirm={handleGoToStatus}
          title="지원 완료"
          message="성공적으로 지원 정보가 등록되었습니다."
          confirmText="지원 현황 확인하기"
          cancelText="닫기"
        />
      </div>
    </>
  );
};

export default ApplyModal;

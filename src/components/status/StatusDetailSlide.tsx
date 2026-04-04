import { createPortal } from 'react-dom';
import { useStatusStore } from '@/store/useStatusStore';
import { updateApplication } from '@/api/Status';
import Button from '@/components/common/UI/Button';
import Badge from '@/components/common/UI/Badge';
import { X, Save, Trash2, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';

const StatusDetailSlide = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { applicationDetail, isDetailLoading, fetchApplications } = useStatusStore();
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (applicationDetail) setNotes(applicationDetail.notes || '');
  }, [applicationDetail]);

  const handleUpdate = async () => {
    if (!applicationDetail) return;
    setIsSaving(true);
    try {
      await updateApplication(applicationDetail.id, { notes });
      await fetchApplications();
      alert('메모가 저장되었습니다.');
    } catch {
      alert('저장 실패');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-8000 animate-fade"
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-100 bg-white shadow-2xl z-8001 transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full p-8">
          <div className="flex justify-between items-center mb-10">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors text-gray-400"
            >
              <X size={24} />
            </button>
            <span className="text-[10px] font-black text-gray-300 tracking-[0.3em] uppercase">
              Detail View
            </span>
          </div>

          {isDetailLoading ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 font-bold">
              데이터를 불러오는 중...
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-10 scrollbar-hide">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-btn-point rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg">
                  {applicationDetail?.jobPostings?.companyName?.charAt(0) || 'J'}
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 leading-tight">
                    {applicationDetail?.jobPostings?.companyName}
                  </h2>
                  <p className="text-sm font-bold text-gray-400 mt-1">
                    {applicationDetail?.jobPostings?.title}
                  </p>
                </div>
              </div>

              <div className="bg-bg-view rounded-2xl p-5 border border-border-light">
                <label className="text-[10px] font-black text-btn-point uppercase tracking-widest block mb-2">
                  Current Status
                </label>
                <div className="flex items-center justify-between">
                  <Badge variant="point" className="text-sm px-4 py-1.5">
                    {applicationDetail?.statusName}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Calendar size={14} />
                    <span className="text-xs font-bold">
                      지원일: {applicationDetail?.appliedAt?.split('T')[0]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block px-1">
                  Notes
                </label>
                <textarea
                  className="w-full h-48 p-5 bg-gray-50 border border-border-light rounded-2xl resize-none outline-none focus:border-btn-point focus:ring-4 focus:ring-purple-50 transition-all text-sm font-medium leading-relaxed"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="면접 질문, 전형 특징 등 기록하고 싶은 내용을 적어주세요."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="flex-1 py-4 gap-2" onClick={handleUpdate} isLoading={isSaving}>
                  <Save size={18} /> 저장하기
                </Button>
                <Button
                  variant="outline"
                  className="border-status-error text-status-error hover:bg-red-50 p-4"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>,
    document.body,
  );
};

export default StatusDetailSlide;

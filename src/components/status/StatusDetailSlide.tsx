import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Trash2, Calendar, Building2, MapPin, Milestone } from 'lucide-react';
import Button from '@/components/common/UI/Button';
import Badge from '@/components/common/UI/Badge';
import type { ApplicationRecord } from '@/types/Status';
import { updateApplication, deleteApplication } from '@/api/Status';
import { useStatusStore } from '@/store/useStatusStore';

interface StatusDetailSlideProps {
  application: ApplicationRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

const StatusDetailSlide: React.FC<StatusDetailSlideProps> = ({ application, isOpen, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // 성공 시 보드를 새로고침하기 위해 스토어에서 fetchData를 가져옵니다.
  const { fetchData, statuses } = useStatusStore();

  useEffect(() => {
    if (application) {
      setNotes(application.notes || '');
      setIsEditing(false);
    }
  }, [application]);

  if (!isOpen || !application) return null;

  // 현재 상태의 이름을 찾습니다.
  const currentStatus = statuses.find((s) => String(s.id) === String(application.statusId));

  // ✨ [해결 핵심] 타임라인용 상태 목록 생성 ('미지원' 제외)
  const timelineStatuses = statuses.filter((s) => s.displayName !== '미지원');
  // 현재 상태의 타임라인 인덱스
  const currentIndex = timelineStatuses.findIndex(
    (s) => String(s.id) === String(application.statusId),
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 메모 내용만 서버에 업데이트
      await updateApplication(application.id, { notes });
      await fetchData(); // 화면 새로고침
      setIsEditing(false);
    } catch (error) {
      console.error('메모 저장 실패:', error);
      alert('메모 저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 이 지원 기록을 삭제하시겠습니까?')) return;

    try {
      await deleteApplication(application.id);
      await fetchData();
      onClose(); // 삭제 후 슬라이드 닫기
    } catch (error) {
      console.error('지원 기록 삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const SlideContent = (
    <>
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[8000] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-[440px] bg-white z-[8001] shadow-2xl transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* 헤더 */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold text-slate-900">지원 상세</h2>
            {currentStatus && (
              <Badge variant="point" className="px-3 py-1 bg-blue-50 text-blue-600 border-blue-100">
                {currentStatus.displayName}
              </Badge>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* 본문 (스크롤 영역) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50">
          {/* 기업 및 공고 정보 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div>
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <Building2 size={16} />
                <span className="font-extrabold text-sm">
                  {application.jobPostings?.companyName}
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 leading-tight">
                {application.jobPostings?.title}
              </h3>
            </div>

            <div className="flex items-center gap-2 text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <Calendar size={18} className="text-slate-400" />
              <span className="font-semibold text-sm">
                지원일:{' '}
                {new Date(application.appliedAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* ✨ 타임라인 영역 추가 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Milestone size={18} className="text-blue-500" /> 지원 진행 현황
              </h3>
            </div>

            <div className="pl-2.5">
              {timelineStatuses.map((status, index) => {
                const isPast = index < currentIndex;
                const isCurrent = index === currentIndex;
                const isFuture = index > currentIndex;
                const isLast = index === timelineStatuses.length - 1;

                return (
                  <div key={status.id} className="relative pb-10">
                    {/* 타임라인 세로선 (연결선) */}
                    {!isLast && (
                      <div
                        className={`absolute left-2.5 top-4 -ml-px h-full w-0.5 ${
                          isPast ? 'bg-blue-500' : 'bg-gray-200'
                        }`}
                        aria-hidden="true"
                      />
                    )}
                    {/* 타임라인 노드(동그라미) 및 텍스트 */}
                    <div className="relative flex space-x-4 items-center">
                      <div>
                        {isPast ? (
                          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-white" />
                          </div>
                        ) : isCurrent ? (
                          <div className="relative w-5 h-5 flex items-center justify-center">
                            {/* 현재 단계 Pulsing 효과 */}
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-100 opacity-75"></span>
                            <div className="relative w-5 h-5 rounded-full border-2 border-blue-500 bg-white flex items-center justify-center">
                              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-[15px] font-bold ${isFuture ? 'text-slate-400' : 'text-slate-900'}`}
                        >
                          {status.displayName}
                        </p>
                        {/* 날짜 표시: 현재 단계일 때만 application.appliedAt 표시 */}
                        {isCurrent && (
                          <span className="text-xs font-semibold text-slate-500">
                            {new Date(application.appliedAt).toLocaleDateString('ko-KR', {
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 메모 영역 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <MapPin size={18} className="text-blue-500" /> 특이사항 및 메모
              </h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  수정
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="면접 일정, 필수 서류 등 기억해야 할 내용을 적어주세요."
                  className="w-full h-40 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none bg-slate-50 text-slate-900 transition-all text-sm font-medium"
                />
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold h-11"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      '저장 중...'
                    ) : (
                      <>
                        <Save size={16} className="mr-2" /> 저장
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 font-bold h-11"
                    onClick={() => {
                      setNotes(application.notes || '');
                      setIsEditing(false);
                    }}
                  >
                    취소
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className="min-h-[100px] bg-slate-50 p-4 rounded-xl text-slate-700 text-sm whitespace-pre-wrap font-medium leading-relaxed border border-slate-100"
                onDoubleClick={() => setIsEditing(true)}
              >
                {application.notes ? (
                  application.notes
                ) : (
                  <span className="text-slate-400 italic">
                    등록된 메모가 없습니다. 더블 클릭하여 메모를 추가하세요.
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 푸터 (삭제 버튼) */}
        <div className="p-6 border-t border-gray-100 bg-white">
          <Button
            variant="outline"
            className="w-full text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 font-bold h-12 transition-all border border-red-200"
            onClick={handleDelete}
          >
            <Trash2 size={18} className="mr-2" /> 이 지원 기록 삭제
          </Button>
        </div>
      </div>
    </>
  );

  return createPortal(SlideContent, document.body);
};

export default StatusDetailSlide;

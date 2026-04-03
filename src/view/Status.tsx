import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useStatusStore } from '@/store/useStatusStore';
import { deleteApplication, updateApplication } from '@/api/Status';
import type { ApplicationRecord, StatusHistory } from '@/types/Status';

interface ApplicationItem {
  id: string;
  company: string;
  role: string;
  statusName: string;
  tags: string[];
  dday: string;
  dateText: string;
  location: string;
  source: string;
  notes: string;
  url?: string;
  deadline: string;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '-';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '-';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${year}.${month}.${day} ${hour}:${minute}`;
}

function toDday(deadlineDate: string) {
  if (!deadlineDate) return '-';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(deadlineDate);
  if (Number.isNaN(target.getTime())) return '-';
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'D-Day';
  if (diffDays > 0) return `D-${diffDays}`;
  return `마감`;
}

function toApplicationItem(application: ApplicationRecord): ApplicationItem {
  const dday = toDday(application.jobPostings?.deadline);
  const statusName = application.statusName || '상태없음';

  return {
    id: application.id,
    company: application.jobPostings?.companyName || '알 수 없는 회사',
    role: application.jobPostings?.title || '제목 없음',
    statusName,
    tags: [statusName, `지원일 ${formatDate(application.appliedAt)}`],
    dday,
    dateText: `${formatDate(application.appliedAt)}`,
    location: '-',
    source: '내 지원 현황',
    notes: application.notes || '-',
    deadline: application.jobPostings?.deadline ? formatDate(application.jobPostings.deadline) : '-',
  };
}

function ddayClass(dday: string) {
  if (dday.startsWith('D-1') || dday.startsWith('D-2') || dday.startsWith('D-3')) {
    return 'text-rose-500';
  }
  if (dday.startsWith('D-')) {
    return 'text-amber-500';
  }
  return 'text-emerald-500';
}

function Status() {
  const [view, setView] = useState<'kanban' | 'list'>('list');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const applications = useStatusStore((state) => state.applications);
  const statuses = useStatusStore((state) => state.statuses);
  const statusOptions = useStatusStore((state) => state.statusOptions);
  const applicationDetail = useStatusStore((state) => state.applicationDetail);
  const isLoading = useStatusStore((state) => state.isLoading);
  const isDetailLoading = useStatusStore((state) => state.isDetailLoading);
  const error = useStatusStore((state) => state.error);
  const detailError = useStatusStore((state) => state.detailError);
  const fetchApplications = useStatusStore((state) => state.fetchApplications);
  const fetchApplicationDetail = useStatusStore((state) => state.fetchApplicationDetail);
  const clearApplicationDetail = useStatusStore((state) => state.clearApplicationDetail);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);
  const applicationItems = useMemo(() => applications.map(toApplicationItem), [applications]);

  const statusColumns = useMemo(() => {
    if (statuses.length > 0) return Array.from(new Set(statuses));
    const derived = Array.from(new Set(applicationItems.map((item) => item.statusName)));
    if (derived.length > 0) return derived;
    return [];
  }, [applicationItems, statuses]);
  console.log(statusColumns);
  const grouped = useMemo(() => {
    return statusColumns.map((statusName) => ({
      statusName,
      items: applicationItems.filter((item) => item.statusName === statusName),
    }));
  }, [applicationItems, statusColumns]);

  const total = applicationItems.length;

  const progressSummary = useMemo(
    () =>
      statusColumns.map((statusName) => ({
        statusName,
        count: applicationItems.filter((item) => item.statusName === statusName).length,
      })),
    [applicationItems, statusColumns],
  );

  const selectedListItem = useMemo(
    () => applicationItems.find((item) => item.id === selectedItemId) ?? null,
    [applicationItems, selectedItemId],
  );

  const selectedItem = useMemo(() => {
    if (applicationDetail && selectedItemId && applicationDetail.id === selectedItemId) {
      return toApplicationItem(applicationDetail);
    }
    return selectedListItem;
  }, [applicationDetail, selectedItemId, selectedListItem]);

  const handleOpenDetail = async (id: string) => {
    setSelectedItemId(id);
    await fetchApplicationDetail(id);
  };

  useEffect(() => {
    setEditingNotes(selectedItem?.notes ?? '');
    setSelectedStatus(selectedItem?.statusName ?? '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItemId, applicationDetail]);

  const handleCloseDetail = () => {
    setSelectedItemId(null);
    clearApplicationDetail();
  };

  const handleUpdate = async () => {
    if (!selectedItemId || !selectedItem) return;

    const selectedIndex = progressStatusOptions.indexOf(selectedStatus);
    const currentIndex = progressStatusOptions.indexOf(selectedItem.statusName);
    if (currentIndex >= 0 && selectedIndex >= 0 && selectedIndex < currentIndex) {
      window.alert('이전 단계로는 변경할 수 없습니다.');
      return;
    }

    const matchedStatusOption = statusOptions.find((option) => option.name === selectedStatus);
    const matchedStatus = applicationDetail?.histories?.find((history) => history.toStatusName === selectedStatus);
    const resolvedStatusId =
      matchedStatusOption?.id ??
      matchedStatus?.toStatusId ??
      (selectedStatus === selectedItem.statusName ? applicationDetail?.statusId : undefined);

    setIsSaving(true);
    try {
      await updateApplication(selectedItemId, {
        notes: editingNotes,
        ...(resolvedStatusId ? { statusId: resolvedStatusId } : {}),
      });
      await fetchApplications();
      await fetchApplicationDetail(selectedItemId);
    } catch {
      window.alert('수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItemId) return;
    const confirmed = window.confirm('정말 삭제하시겠습니까?');
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await deleteApplication(selectedItemId);
      await fetchApplications();
      handleCloseDetail();
    } catch {
      window.alert('삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsDeleting(false);
    }
  };

  const progressRatio = useMemo(() => {
    if (!selectedItem || statusColumns.length === 0) return 0;
    const index = statusColumns.indexOf(selectedItem.statusName);
    const safeIndex = index >= 0 ? index : 0;
    return ((safeIndex + 1) / statusColumns.length) * 100;
  }, [selectedItem, statusColumns]);

  const progressStatusOptions = useMemo(() => {
    if (!selectedItem) return statusColumns;
    if (statusColumns.includes(selectedItem.statusName)) return statusColumns;
    return [selectedItem.statusName, ...statusColumns];
  }, [selectedItem, statusColumns]);

  const currentStatusIndex = useMemo(() => {
    if (!selectedItem) return -1;
    return progressStatusOptions.indexOf(selectedItem.statusName);
  }, [progressStatusOptions, selectedItem]);

  if (error) {
    return <div className="p-6 text-rose-500">지원 현황 데이터를 불러오지 못했습니다: {error}</div>;
  }

  return (
    <div className="p-6">
      <section className="flex flex-nowrap gap-1 overflow-x-auto pb-1">
        <div className="w-[116px] shrink-0 rounded-md border border-slate-200 bg-white p-2.5 shadow-sm">
          <p className="text-xl font-extrabold text-indigo-600">{total}</p>
          <p className="mt-0.5 text-[11px] text-slate-500">총 지원</p>
        </div>
        {progressSummary.map((summary) => (
          <div
            key={`summary-${summary.statusName}`}
            className="w-[116px] shrink-0 rounded-md border border-slate-200 bg-white p-2.5 shadow-sm"
          >
            <p className="text-xl font-extrabold text-slate-700">{summary.count}</p>
            <p className="mt-0.5 truncate text-[11px] text-slate-500">{summary.statusName}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 inline-flex rounded-xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setView('kanban')}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            view === 'kanban' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
          }`}
        >
          칸반 보드
        </button>
        <button
          type="button"
          onClick={() => setView('list')}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            view === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
          }`}
        >
          리스트
        </button>
      </section>

      {view === 'kanban' ? (
        <section className="mt-4 flex gap-4 overflow-x-auto pb-2">
          {isLoading ? <div className="py-8 text-sm text-slate-500">지원 현황을 불러오는 중입니다...</div> : null}
          {grouped.map((group) => (
            <div
              key={group.statusName}
              className="w-72 shrink-0 rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                <p className="text-sm font-bold text-slate-800">{group.statusName}</p>
                <span className="ml-auto rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-400">
                  {group.items.length}
                </span>
              </div>

              {group.items.map((item) => (
                <article
                  key={item.id}
                  className="mb-2 rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:border-indigo-300 hover:shadow cursor-pointer"
                  onClick={() => {
                    void handleOpenDetail(item.id);
                  }}
                >
                  <p className="text-sm font-bold text-slate-900">{item.company}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.role}</p>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <span
                        key={`${item.id}-${tag}`}
                        className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2">
                    <span className={`text-xs font-bold ${ddayClass(item.dday)}`}>{item.dday}</span>
                    <span className="text-[11px] text-slate-400">{item.deadline}</span>
                  </div>
                </article>
              ))}

              {!isLoading && group.items.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-200 bg-white/70 px-3 py-4 text-center text-xs text-slate-400">
                  항목이 없습니다
                </div>
              ) : null}
            </div>
          ))}
        </section>
      ) : (
        <section className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50">
              <tr className="text-center text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">회사</th>
                <th className="px-4 py-3">직무</th>
                <th className="px-4 py-3">단계</th>
                <th className="px-4 py-3">마감</th>
                <th className="px-4 py-3">지원일</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-slate-500" colSpan={5}>
                    지원 현황을 불러오는 중입니다...
                  </td>
                </tr>
              ) : null}
              {applicationItems.map((item) => (
                <tr
                  key={item.id}
                  className="text-center border-t border-slate-100 text-sm text-slate-700 cursor-pointer hover:bg-slate-50"
                  onClick={() => {
                    void handleOpenDetail(item.id);
                  }}
                >
                  <td className="px-4 py-3 text-left text-sm font-bold text-slate-900">{item.company}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{item.role}</td>
                  <td className="px-4 py-3 text-xs">{item.statusName}</td>
                  <td className={`px-4 py-3 text-xs font-semibold ${ddayClass(item.dday)}`}>{item.dday}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{item.dateText}</td>
                </tr>
              ))}
              {!isLoading && applicationItems.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-slate-500" colSpan={5}>
                    검색 조건에 맞는 지원 항목이 없습니다.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </section>
      )}

      {selectedItemId
        ? createPortal(
            <>
              <div
                className="fixed inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 z-9998"
                onClick={handleCloseDetail}
              />
              <aside
                className="fixed top-0 right-0 h-full w-full max-w-100 bg-white shadow-[-15px_0_40px_rgba(0,0,0,0.1)] z-9999 transform transition-transform duration-500 ease-in-out translate-x-0"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between p-6 pb-2">
                    <button
                      type="button"
                      onClick={handleCloseDetail}
                      className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
                      Detail View
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto px-8 py-4">
                    {!selectedItem && isDetailLoading ? (
                      <div className="py-10 text-sm text-gray-500">상세 정보를 불러오는 중입니다...</div>
                    ) : null}

                    {!selectedItem && detailError ? (
                      <div className="py-10 text-sm text-rose-500">{detailError}</div>
                    ) : null}

                    {selectedItem ? (
                      <>
                    <div className="mb-8 flex items-center gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-indigo-700 text-2xl font-black text-white shadow-md">
                        {selectedItem.company.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-2xl leading-tight font-extrabold text-gray-900">
                          {selectedItem.company}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">{selectedItem.role}</p>
                      </div>
                    </div>

                    <section className="mb-6">
                      <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-indigo-500">
                        Status
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-600">
                          {selectedItem.statusName}
                        </span>
                      </div>
                      <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-indigo-600"
                          style={{ width: `${progressRatio}%` }}
                        />
                      </div>
                    </section>

                    {applicationDetail?.histories && applicationDetail.histories.length > 0 ? (
                      <section className="mb-6">
                        <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                          Timeline
                        </p>
                        <ol className="relative border-l border-slate-200">
                          {applicationDetail.histories.map((history: StatusHistory, index: number) => {
                            const label =
                              history.toStatusName ?? '-';
                            const dateStr = history.changedAt ?? '';
                            return (
                              <li key={history.toStatusId ?? index} className="mb-6 ml-4 last:mb-0">
                                <span className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full border-2 border-white bg-indigo-400" />
                                <p className="text-xs font-bold text-slate-800">{label}</p>
                                <p className="mt-0.5 text-[11px] text-slate-400">{formatDateTime(dateStr)}</p>
                              </li>
                            );
                          })}
                        </ol>
                      </section>
                    ) : null}

                    <section className="mb-6 space-y-4">
                      <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Note
                      </p>
                      <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                        <textarea
                          className="w-full resize-none bg-transparent text-xs text-gray-700 outline-none"
                          value={editingNotes}
                          onChange={(e) => setEditingNotes(e.target.value)}
                          rows={4}
                          placeholder="메모를 입력하세요"
                        />
                      </div>
                    </section>

                    <section className="space-y-3">
                      <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Actions
                      </p>

                      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                        <select
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        >
                          {progressStatusOptions.map((status, index) => (
                            <option
                              key={`status-option-${status}`}
                              value={status}
                              disabled={currentStatusIndex >= 0 && index < currentStatusIndex}
                            >
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            void handleUpdate();
                          }}
                          disabled={isSaving || isDeleting}
                          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          {isSaving ? '수정 중...' : '수정하기'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            void handleDelete();
                          }}
                          disabled={isSaving || isDeleting}
                          className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                        >
                          {isDeleting ? '삭제 중...' : '삭제하기'}
                        </button>
                      </div>
                    </section>
                      </>
                    ) : null}
                  </div>

                  {selectedItem?.url ? (
                    <div className="mt-auto p-6">
                      <a
                        className="inline-flex w-full items-center justify-center rounded-xl bg-gray-900 px-4 py-4 text-sm font-bold text-white transition-all hover:bg-indigo-600"
                        href={selectedItem.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        공고 원문 열기
                      </a>
                    </div>
                  ) : null}
                </div>
              </aside>
            </>,
            document.body,
          )
        : null}
    </div>
  );
}

export default Status;

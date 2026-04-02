import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyScraps, type ScrapItem } from '@/api/Scrap';
import { PATH } from '@/router/Path';

const GRADIENTS = [
  'linear-gradient(135deg, #ff8f00, #e65100)',
  'linear-gradient(135deg, #5c6bc0, #3949ab)',
  'linear-gradient(135deg, #43a047, #2e7d32)',
  'linear-gradient(135deg, #00acc1, #00838f)',
  'linear-gradient(135deg, #8e24aa, #6a1b9a)',
];

const getGradientForName = (name: string) => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return GRADIENTS[hash % GRADIENTS.length];
};

const calculateDday = (deadline: string) => {
  if (!deadline || deadline === '상시채용' || deadline === '채용시마감')
    return { text: '상시', color: 'text-[#10b981]' };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(deadline);
  const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { text: '마감', color: 'text-[#6b7280]' };
  if (diffDays === 0) return { text: 'D-Day', color: 'text-[#f43f5e]' };
  if (diffDays <= 3) return { text: `D-${diffDays}`, color: 'text-[#f43f5e]' };
  if (diffDays <= 7) return { text: `D-${diffDays}`, color: 'text-[#f59e0b]' };
  return { text: `D-${diffDays}`, color: 'text-[#6b7280]' };
};

const Scrap = () => {
  const navigate = useNavigate();
  const [scraps, setScraps] = useState<ScrapItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScraps = async () => {
      try {
        const data = await getMyScraps();
        setScraps(data);
      } catch (error) {
        console.error('스크랩 목록을 불러오는 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchScraps();
  }, []);

  return (
    <div className="w-full bg-[#f4f5f8] min-h-dvh p-8 font-sans">
      <div className="max-w-300 mx-auto">
        <div className="flex justify-between items-center mb-5">
          <div className="text-[15px] text-[#6b7280]">
            저장된 공고 <strong className="text-[#111827]">{scraps.length}개</strong>
          </div>
          <button
            onClick={() => navigate(PATH.POSTING)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-[1.5px] border-[#e8eaf0] text-[#6b7280] text-[13px] font-bold rounded-lg hover:bg-gray-50 transition-colors"
          >
            🔍 공고 탐색
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {isLoading ? (
            <div className="col-span-2 text-center py-10 text-gray-500">로딩 중...</div>
          ) : (
            scraps.map((scrap) => {
              const dday = calculateDday(scrap.deadline);
              const logoGradient = getGradientForName(scrap.companyName);

              return (
                <div
                  key={scrap.jobPostingId}
                  className="bg-white border-[1.5px] border-[#e8eaf0] rounded-xl p-4.5 cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:border-[#4f46e5] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:-translate-y-py transition-all flex flex-col justify-between min-h-35"
                >
                  <div>
                    <div className="flex gap-3 items-start mb-3">
                      <div
                        className="flex items-center justify-center text-white font-black w-10 h-10 rounded-lg text-[16px] shrink-0"
                        style={{ background: scrap.companyLogo ? 'transparent' : logoGradient }}
                      >
                        {scrap.companyLogo ? (
                          <img
                            src={scrap.companyLogo}
                            alt="logo"
                            className="w-full h-full object-contain rounded-lg"
                          />
                        ) : (
                          scrap.companyName.charAt(0).toUpperCase()
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-[15px] font-extrabold text-[#111827] truncate">
                          {scrap.companyName}
                        </div>
                        <div className="text-[13px] text-[#6b7280] mt-0.5 truncate">
                          {scrap.title}
                        </div>
                      </div>

                      <span className={`font-mono text-[12px] font-bold shrink-0 ${dday.color}`}>
                        {dday.text}
                      </span>
                    </div>

                    <div className="flex gap-1.5 flex-wrap mb-3">
                      {scrap.experience && (
                        <span className="text-[10.5px] font-semibold px-2 py-0.75 rounded bg-[#eef2ff] text-[#4f46e5]">
                          {scrap.experience}
                        </span>
                      )}
                      {scrap.location && (
                        <span className="text-[10.5px] font-semibold px-2 py-0.75 rounded bg-[#f3f4f6] text-[#6b7280]">
                          {scrap.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[11px] text-[#9ca3af]">
                      📌 {new Date(scrap.createdAt).toLocaleDateString()} 스크랩
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert('지원하기 버튼 클릭!');
                      }}
                      className="px-3 py-1.5 rounded-lg text-[12px] font-bold bg-[#4f46e5] text-white hover:opacity-90 transition-all flex items-center gap-1"
                    >
                      지원하기
                    </button>
                  </div>
                </div>
              );
            })
          )}

          <div
            onClick={() => navigate(PATH.POSTING)}
            className="border-dashed border-[1.5px] border-[#d4d7e3] bg-transparent rounded-xl flex flex-col items-center justify-center gap-2 text-[#9ca3af] min-h-35 cursor-pointer hover:border-[#4f46e5] hover:bg-white hover:text-[#4f46e5] transition-all shadow-none"
          >
            <div className="text-[26px]">🔍</div>
            <div className="text-[13px] font-medium">새로운 공고 탐색하러 가기</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scrap;

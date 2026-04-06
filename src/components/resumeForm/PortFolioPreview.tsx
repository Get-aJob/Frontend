import { usePreviewStore } from '@/store/usePdfPreviewStore';
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const PortFolioPreview = () => {
  const { isOpen, previewUrl, closePreview } = usePreviewStore();
  const previewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (previewRef.current && !previewRef.current.contains(e.target as Node)) {
        if (isOpen) {
          closePreview();
        }
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [closePreview, isOpen]);

  if (!isOpen || !previewUrl) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center top-0 left-0 w-full h-full bg-black/40 backdrop-blur-sm z-[100] animate-fadeIn">
      <div
        ref={previewRef}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white p-2 rounded-2xl shadow-2xl w-[90vw] max-w-[1000px] h-[85vh] animate-[fadeUp_0.3s_ease]"
      >
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 mb-2">
          <h3 className="font-bold text-gray-800">PDF 미리보기</h3>
          <button
            onClick={closePreview}
            className="p-1.5 bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-status-error rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <embed
          key={previewUrl}
          src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          type="application/pdf"
          className="w-full h-[calc(100%-60px)] rounded-b-xl"
        />
      </div>
    </div>
  );
};

export default PortFolioPreview;

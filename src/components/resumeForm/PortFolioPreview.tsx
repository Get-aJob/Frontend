import { usePreviewStore } from '@/store/usePdfPreviewStore';
import { useEffect, useRef } from 'react';

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
    <div className="fixed inset-0 flex justify-center items-center top-0 left-0 w-full h-full border bg-black/5 z-30">
      <div
        ref={previewRef}
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-10 w-fit h-fit rounded-2xl"
      >
        <embed
          key={previewUrl}
          src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          type="application/pdf"
          className="border h-140 w-190"
        />
      </div>
    </div>
  );
};

export default PortFolioPreview;

import { usePreviewStore } from '@/store/usePdfPreviewStore';
import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';

interface PortFolioPreviewProps {
  name: string;
}

const PortFolioPreview = ({ name }: PortFolioPreviewProps) => {
  const { isOpen, previewUrl, closePreview } = usePreviewStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      previewUrl: state.previewUrl,
      closePreview: state.closePreview,
    })),
  );
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
        <h1 className="text-title">{name}</h1>
        <embed
          key={previewUrl}
          src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          type="application/pdf"
          className="border h-70 w-95 lg:h-140 lg:w-190"
        />
      </div>
    </div>
  );
};

export default PortFolioPreview;

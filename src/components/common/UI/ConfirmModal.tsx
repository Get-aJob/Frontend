import Button from './Button';
import clsx from 'clsx';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
  isDanger?: boolean;
  isNested?: boolean;
}

const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onClose,
  isDanger = false,
  isNested = false,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className={clsx(
        'fixed inset-0 flex items-center justify-center z-[9999] animate-in fade-in duration-300',
        isNested ? 'bg-slate-900/20 backdrop-blur-[2px]' : 'bg-slate-900/40 backdrop-blur-md',
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-(--radius-card) p-6 w-100 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-title font-extrabold text-gray-900 mb-2">{title}</h2>
        <p className="text-sm text-gray-600 mb-8">{message}</p>

        <div className="flex justify-end gap-2.5">
          <Button variant="ghost" onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            className={isDanger ? 'bg-status-error hover:bg-red-600 shadow-none' : ''}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

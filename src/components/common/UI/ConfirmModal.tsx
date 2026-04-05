// common/UI/ConfirmModal.tsx 전체 코드
import Button from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
  isDanger?: boolean;
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
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      // 💡 z-index를 최상위급인 9999로 설정하고 배경색 투명도를 살짝 조절했습니다.
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[9999]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-(--radius-card) p-6 w-100 shadow-2xl animate-[fadeInUp_0.2s_ease]"
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

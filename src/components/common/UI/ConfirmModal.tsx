import Button from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
  isDanger?: boolean; // 삭제나 로그아웃 같은 경고성 작업일 때 true를 줍니다.
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
      className="fixed inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-2000"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-(--radius-card) p-6 w-100 shadow-xl animate-[fadeInUp_0.2s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-title font-extrabold text-gray-900 mb-2">{title}</h2>
        <p className="text-sm text-gray-600 mb-8 leading-relaxed whitespace-pre-wrap">{message}</p>

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

import { useEffect, useState } from 'react';
import { Droppable, type DroppableProps } from '@hello-pangea/dnd';

export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // requestAnimationFrame을 통해 마운트 시점을 한 프레임 늦춤으로써
    // React 18의 더블 렌더링 이슈(Context 유실)를 우회합니다.
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
};

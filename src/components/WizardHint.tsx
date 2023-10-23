import { throttle } from '@/utils/throttle';
import { PropsWithChildren, useEffect, useRef } from 'react';
import { useWizard } from './WizardProvider';

const POINTER_WIDTH = 40;
const MARGIN = 16;

export const WizardHint = ({
  id,
  text,
  children,
}: PropsWithChildren<{ id: string; text: string }>) => {
  const { registerHint, unregisterHint, markAsRead, isHintActive, isHintRead } =
    useWizard();
  const hintRef = useRef<HTMLDivElement | null>(null);
  const isRead = isHintRead(id);
  const isActive = isHintActive(id);

  useEffect(() => {
    registerHint(id, text);
    () => unregisterHint(id);
  }, [registerHint, unregisterHint, id, text]);

  useEffect(() => {
    function positionHint() {
      const targetElement = hintRef.current
        ?.previousElementSibling as HTMLDivElement;
      if (targetElement && hintRef.current) {
        const { x, y, right, width, height } =
          targetElement.getBoundingClientRect();
        hintRef.current.style.top = `${y - height / 2}px`;
        hintRef.current.style.left = `${right + POINTER_WIDTH}px`;
        hintRef.current.style.maxWidth = `${
          Math.abs(window.innerWidth - right) - POINTER_WIDTH - MARGIN
        }px`;
        hintRef.current.style.opacity = '1';
      }
    }
    const throttledPositionHint = throttle(positionHint, 100);
    globalThis.window?.addEventListener('scroll', throttledPositionHint);
    globalThis.window?.addEventListener('scrollend', positionHint);
    throttledPositionHint();
    return () => {
      globalThis.window?.removeEventListener('scroll', throttledPositionHint);
      globalThis.window?.removeEventListener('scrollend', positionHint);
    };
  }, [children]);

  const handleClick = () => {
    if (hintRef.current) {
      hintRef.current.style.opacity = '0';
      hintRef.current.style.pointerEvents = 'none';
      setTimeout(() => {
        markAsRead(id);
      }, 1000);
    }
  };

  return (
    <>
      {children}
      {isActive && !isRead && text && (
        <div
          ref={hintRef}
          style={{ transition: 'all 500ms ease-out' }}
          className="fixed flex gap-4 items-center justify-between text-purple-800 bg-white p-3 rounded-lg shadow-hint opacity-0">
          <div className="flex gap-4 items-center">
            <span className="drop-shadow-lg px-2 text-xl">💡</span>
            <span>{text}</span>
          </div>
          <button
            onClick={handleClick}
            className="px-2 rounded-lg text-green-800 text-lg border border-green-500 bg-green-100 hover:bg-green-500 hover:text-white">
            ✓
          </button>
          <div className="block absolute w-4 h-4 -left-6 top-1/2 text-base animate-hint-x">
            <div className="-scale-x-100 -translate-y-1/2">👉</div>
          </div>
        </div>
      )}
    </>
  );
};

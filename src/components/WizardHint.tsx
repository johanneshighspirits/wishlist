'use client';

import { throttle } from '@/utils/throttle';
import { PropsWithChildren, useEffect, useRef } from 'react';
import { useWizard } from './WizardProvider';
import clsx from 'clsx';

const POINTER_WIDTH = 40;
const MARGIN = 16;

export const WizardHint = ({
  hintType,
  text,
  children,
}: PropsWithChildren<{ hintType: string; text: string }>) => {
  const { registerHint, unregisterHint, markAsRead, isHintRead, activeId } =
    useWizard();
  const hintRef = useRef<HTMLDivElement | null>(null);
  const wizardIdRef = useRef<string | undefined>();
  const isActive = wizardIdRef.current && activeId === wizardIdRef.current;

  useEffect(() => {
    const targetElement = hintRef.current
      ?.previousElementSibling as HTMLDivElement;
    if (!wizardIdRef.current && targetElement && hintRef.current) {
      wizardIdRef.current = `${hintType}:${crypto.randomUUID().split('-')[0]}`;
      registerHint(hintType, wizardIdRef.current, targetElement);
    }
  }, [registerHint, unregisterHint, hintType, text]);

  useEffect(() => {
    function positionHint() {
      if (hintRef.current) {
        const targetElement = hintRef.current
          ?.previousElementSibling as HTMLDivElement;
        if (targetElement && targetElement.dataset.isLeaving !== 'true') {
          if (isActive) {
            const { x, y, bottom, right, width, height } =
              targetElement.getBoundingClientRect();
            targetElement.classList.add('shadow-wizard-highlight');
            // Prefer right positioning
            const availableRightSpace =
              Math.abs(window.innerWidth - right) - POINTER_WIDTH - MARGIN;
            if (availableRightSpace > 300) {
              // Position RIGHT
              hintRef.current.dataset.position = `right`;
              hintRef.current.style.top = `${y - height / 2}px`;
              hintRef.current.style.left = `${right + POINTER_WIDTH}px`;
              hintRef.current.style.transform = 'none';
              hintRef.current.style.maxWidth = `${availableRightSpace}px`;
            } else {
              // Position BOTTOM
              hintRef.current.dataset.position = `bottom`;
              hintRef.current.style.top = `${bottom + POINTER_WIDTH}px`;
              hintRef.current.style.left = `${x + width / 2}px`;
              hintRef.current.style.transform = 'translateX(-50%)';
              hintRef.current.style.maxWidth = `${
                Math.abs(window.innerWidth - x + width / 2) - MARGIN
              }px`;
            }
            hintRef.current.style.opacity = '1';
            hintRef.current.style.pointerEvents = 'auto';
          } else {
            hintRef.current.style.opacity = '0';
            hintRef.current.style.pointerEvents = 'none';
          }
        }
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
  }, [children, isActive]);

  const handleClick = () => {
    if (hintRef.current) {
      hintRef.current.style.opacity = '0';
      hintRef.current.style.pointerEvents = 'none';
      const targetElement = hintRef.current
        .previousElementSibling as HTMLDivElement;
      if (targetElement) {
        targetElement.dataset.isLeaving = 'true';
      }
      setTimeout(() => {
        markAsRead(hintType);
        targetElement.classList.remove('shadow-wizard-highlight');
      }, 400);
    }
  };

  return (
    <>
      {children}
      {!isHintRead(hintType) && text && (
        <div
          ref={hintRef}
          style={{ transition: 'all 500ms ease-out' }}
          className="group fixed flex gap-4 items-center justify-between text-purple-800 bg-white p-3 rounded-lg shadow-hint opacity-0 pointer-events-none z-10">
          <div className="flex gap-4 items-center">
            <span className="drop-shadow-lg px-2 text-xl">💡</span>
            <span>{text}</span>
          </div>
          <button
            onClick={handleClick}
            className="px-2 rounded-lg text-green-800 text-lg border border-green-500 bg-green-100 hover:bg-green-500 hover:text-white">
            ✓
          </button>
          <div
            className={clsx(
              'block absolute w-4 h-4 text-base',
              "group-data-[position='right']:-left-6 group-data-[position='right']:top-1/2 group-data-[position='right']:animate-hint-x",
              "group-data-[position='bottom']:left-1/2 group-data-[position='bottom']:-top-6 group-data-[position='bottom']:animate-hint-y"
            )}>
            <div
              className={clsx(
                'animate-fade-in',
                "group-data-[position='right']:-translate-y-1/2 group-data-[position='right']:-scale-x-100",
                "group-data-[position='bottom']:-rotate-90"
              )}>
              👉
            </div>
          </div>
        </div>
      )}
    </>
  );
};

'use client';

import { storeReadHints } from '@/lib/wizard/actions';
import {
  createContext,
  useContext,
  useReducer,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
} from 'react';

type Hint = {
  uid: string;
  hintType: string;
  text: string;
};

type WizardState = {
  activeId: string;
  hints: Record<string, Hint>;
  readHintTypes: Set<string>;
  isReady: boolean;
};

type Action =
  // | { type: 'initReadHints'; readHints: Set<string> }
  | { type: 'setIsReady'; isReady: boolean }
  | { type: 'registerHint'; hintType: string; uid: string }
  | { type: 'setActiveId'; uid: string }
  | { type: 'markAsRead'; hintType: string }
  | { type: 'unregisterHint'; id: string };

type Dispatch = (action: Action) => void;

const WizardContext = createContext<
  | {
      state: WizardState;
      dispatch: Dispatch;
    }
  | undefined
>(undefined);

function reducer(state: WizardState, action: Action): WizardState {
  switch (action.type) {
    case 'setIsReady': {
      return {
        ...state,
        isReady: action.isReady,
      };
    }
    // case 'initReadHints': {
    //   return {
    //     ...state,
    //     readHintTypes: action.readHints,
    //     isReady: true,
    //   };
    // }
    case 'registerHint': {
      return {
        ...state,
        hints: {
          ...state.hints,
          [action.uid]: {
            ...state.hints[action.uid],
            uid: action.uid,
            hintType: action.hintType,
          },
        },
      };
    }
    case 'setActiveId': {
      return {
        ...state,
        activeId: action.uid,
      };
    }
    case 'markAsRead': {
      return {
        ...state,
        activeId: '',
        readHintTypes: new Set([...state.readHintTypes, action.hintType]),
      };
    }
    default: {
      return state;
    }
  }
}

const initialState: WizardState = {
  hints: {},
  readHintTypes: new Set(),
  activeId: '',
  isReady: false,
};

let intersectionObserver: IntersectionObserver;

export const WizardProvider = ({
  readHints,
  children,
}: PropsWithChildren<{ readHints: Set<string> }>) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    readHintTypes: readHints,
  });
  const firstVisibleElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    dispatch({
      type: 'setIsReady',
      isReady: true,
    });
  }, []);

  useEffect(() => {
    function handleIntersection(entries: IntersectionObserverEntry[]) {
      let top = Infinity;
      firstVisibleElementRef.current = null;
      entries.forEach((entry) => {
        if (
          entry.isIntersecting &&
          !state.readHintTypes.has(
            (entry.target as HTMLElement).dataset.hintType || ''
          ) &&
          entry.intersectionRect.top < top
        ) {
          firstVisibleElementRef.current = entry.target as HTMLElement;
          top = entry.intersectionRect.top;
        }
      });
      if (firstVisibleElementRef.current !== null) {
        dispatch({
          type: 'setActiveId',
          uid:
            (firstVisibleElementRef.current as HTMLElement)?.dataset.uid || '',
        });
        intersectionObserver.unobserve(firstVisibleElementRef.current);
      }
    }
    intersectionObserver = new IntersectionObserver(handleIntersection);
    return () => intersectionObserver?.disconnect();
  }, [state.activeId, state.readHintTypes]);

  const value = {
    state,
    dispatch,
  };

  return (
    <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
  );
};

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) {
    throw new Error('useWizard must be used within a WizardContext Provider');
  }

  const {
    state: { hints, activeId, readHintTypes, isReady },
    dispatch,
  } = ctx;

  const registerHint = useCallback(
    (hintType: string, uid: string, targetElement: HTMLElement) => {
      if (!hints[uid]) {
        targetElement.dataset.uid = uid;
        targetElement.dataset.hintType = hintType;
        if (intersectionObserver) {
          intersectionObserver.observe(targetElement);
        }
        dispatch({ type: 'registerHint', uid, hintType });
      }
    },
    [dispatch, hints]
  );

  const unregisterHint = useCallback(
    (id: string) => dispatch({ type: 'unregisterHint', id }),
    [dispatch]
  );

  const isHintRead = useCallback(
    (id: string) => {
      return readHintTypes.has(id);
    },
    [readHintTypes]
  );

  const markAsRead = useCallback(
    (hintType: string) => {
      dispatch({ type: 'markAsRead', hintType });
      storeReadHints([...readHintTypes, hintType]);
      setTimeout(() => {
        Array.from(document.querySelectorAll('[data-hint-type]')).forEach(
          (element) => {
            intersectionObserver.observe(element);
          }
        );
      }, 100);
    },
    [readHintTypes, dispatch]
  );

  return {
    registerHint,
    unregisterHint,
    markAsRead,
    isHintRead,
    activeId,
    isReady,
  };
}

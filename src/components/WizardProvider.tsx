'use client';

import {
  createContext,
  useContext,
  useReducer,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  MutableRefObject,
  useLayoutEffect,
} from 'react';

type Hint = {
  id: string;
  text: string;
  isRead: boolean;
  isVisible: boolean;
  isRegistered: boolean;
};

type WizardState = {
  activeId: string;
  hints: Record<string, Hint>;
};

type Action =
  | { type: 'markAsRead'; id: string }
  | { type: 'initHints'; hints: Record<string, Hint> }
  | { type: 'registerHint'; id: string }
  | { type: 'unregisterHint'; id: string }
  | { type: 'setActiveId'; wizardId: string };
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
    case 'initHints': {
      const newHints = { ...state.hints };
      Object.values(action.hints).forEach(({ isRegistered, ...hint }) => {
        newHints[hint.id] = {
          ...newHints[hint.id],
          ...hint,
        };
      });
      return {
        ...state,
        hints: newHints,
      };
    }
    case 'registerHint': {
      return {
        ...state,
        hints: {
          ...state.hints,
          [action.id]: {
            ...state.hints[action.id],
            id: action.id,
            isVisible: true,
            isRegistered: true,
          },
        },
      };
    }
    case 'unregisterHint': {
      return {
        ...state,
        hints: {
          ...state.hints,
          [action.id]: {
            ...state.hints[action.id],
            isVisible: false,
          },
        },
      };
    }
    case 'setActiveId': {
      return {
        ...state,
        activeId: action.wizardId,
      };
    }
    case 'markAsRead': {
      return {
        ...state,
        activeId: '',
        hints: {
          ...state.hints,
          [action.id]: {
            ...state.hints[action.id],
            isRead: true,
          },
        },
      };
    }
    default: {
      return state;
    }
  }
}

const initialState: WizardState = {
  hints: {},
  activeId: '',
};

let intersectionObserver: IntersectionObserver;

export const WizardProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const firstVisibleElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleIntersection(entries: IntersectionObserverEntry[]) {
      let top = Infinity;
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRect.top < top) {
          firstVisibleElementRef.current = entry.target as HTMLDivElement;
          top = entry.intersectionRect.top;
        }
      });
      if (firstVisibleElementRef.current !== null) {
        console.log(firstVisibleElementRef.current.dataset.wizardId);
        firstVisibleElementRef.current.dataset.topMost = 'true';
        intersectionObserver?.disconnect();
      }
    }
    intersectionObserver = new IntersectionObserver(handleIntersection);
    return () => intersectionObserver?.disconnect();
  }, []);

  const value = {
    state,
    dispatch,
  };
  useEffect(() => {
    try {
      const wizardHints =
        globalThis.window?.localStorage.getItem('wizardHints');
      if (wizardHints) {
        const hints = JSON.parse(wizardHints);
        dispatch({ type: 'initHints', hints });
      }
    } catch {
      console.error('Could not read from localStorage');
    }
  }, []);

  if (globalThis.window?.requestIdleCallback) {
    globalThis.window?.requestIdleCallback(
      () => {
        globalThis.window?.localStorage.setItem(
          'wizardHints',
          JSON.stringify(state.hints)
        );
      },
      { timeout: 1000 }
    );
  } else {
    setTimeout(() => {
      globalThis.window?.localStorage.setItem(
        'wizardHints',
        JSON.stringify(state.hints)
      );
    }, 0);
  }
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
    state: { hints, activeId },
    dispatch,
  } = ctx;

  const registerHint = useCallback(
    (id: string, targetElement: HTMLElement) => {
      if (!hints[id]?.isRegistered) {
        targetElement.dataset.wizardId = id;
        if (intersectionObserver) {
          intersectionObserver.observe(targetElement);
        }
        setTimeout(() => {
          dispatch({ type: 'registerHint', id });
        }, 100);
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
      return hints[id]?.isRead ?? false;
    },
    [hints]
  );
  const isHintRegistered = useCallback(
    (id: string) => {
      return hints[id]?.isRegistered === true;
    },
    [hints]
  );

  const markAsRead = useCallback(
    (id: string) => dispatch({ type: 'markAsRead', id }),
    [dispatch]
  );
  const isHintActive = useCallback((id: string) => true, []);

  return {
    registerHint,
    unregisterHint,
    markAsRead,
    isHintRead,
    isHintActive,
    isHintRegistered,
    activeId,
  };
}

'use client';

import {
  createContext,
  useContext,
  useReducer,
  PropsWithChildren,
  useCallback,
  useEffect,
} from 'react';

type Hint = {
  id: string;
  text: string;
  isRead: boolean;
  isVisible: boolean;
};

type WizardState = {
  hints: Record<string, Hint>;
};

type Action =
  | { type: 'markAsRead'; id: string }
  | { type: 'initHints'; hints: Record<string, Hint> }
  | { type: 'registerHint'; id: string; text: string }
  | { type: 'unregisterHint'; id: string };
type Dispatch = (action: Action) => void;

const WizardContext = createContext<
  { state: WizardState; dispatch: Dispatch } | undefined
>(undefined);

function reducer(state: WizardState, action: Action): WizardState {
  switch (action.type) {
    case 'initHints': {
      const newHints = { ...state.hints };
      Object.values(action.hints).forEach((hint) => {
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
            text: action.text,
            isVisible: true,
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
    case 'markAsRead': {
      return {
        ...state,
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
};

export const WizardProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, initialState);
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
  globalThis.window?.requestIdleCallback(() => {
    globalThis.window?.localStorage.setItem(
      'wizardHints',
      JSON.stringify(state.hints)
    );
  });
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
    state: { hints },
    dispatch,
  } = ctx;

  const registerHint = useCallback(
    (id: string, text: string) => dispatch({ type: 'registerHint', id, text }),
    [dispatch]
  );

  const unregisterHint = useCallback(
    (id: string) => dispatch({ type: 'unregisterHint', id }),
    [dispatch]
  );

  const isHintRead = (id: string) => {
    return hints[id]?.isRead ?? false;
  };
  return {
    registerHint,
    unregisterHint,
    markAsRead: (id: string) => dispatch({ type: 'markAsRead', id }),
    isHintRead,
    isHintActive: (id: string) => true,
  };
}

import { useEffect, useState, useCallback } from 'react';
import { AppState, Message, StateAction } from './types';
import { initialState } from './reducer';

export function useExtensionState() {
  const [state, setState] = useState<AppState>(initialState);
  const [isConnected, setIsConnected] = useState(false);

  // Request current state from background
  const requestState = useCallback(async () => {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'STATE_REQUEST'
      });
      
      if (response?.state) {
        setState(response.state);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('[Store] Failed to request state:', error);
      setIsConnected(false);
    }
  }, []);

  // Dispatch action to background
  const dispatch = useCallback(async (action: StateAction) => {
    try {
      await chrome.runtime.sendMessage({
        type: 'ACTION',
        action
      });
    } catch (error) {
      console.error('[Store] Failed to dispatch action:', error);
    }
  }, []);

  // Listen for state updates from background
  useEffect(() => {
    const messageListener = (message: Message) => {
      if (message.type === 'STATE_UPDATE' && message.state) {
        setState(message.state);
        setIsConnected(true);
      }
    };

    // Add listener for messages from background
    chrome.runtime.onMessage.addListener(messageListener);

    // Request initial state
    requestState();

    // Cleanup
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, [requestState]);

  // Action creators
  const actions = {
    setAuth: (user: any, token: string) => 
      dispatch({ type: 'SET_AUTH', payload: { user, token } }),
    
    clearAuth: () => 
      dispatch({ type: 'CLEAR_AUTH' }),
    
    setUser: (user: any) => 
      dispatch({ type: 'SET_USER', payload: user }),
    
    setTrackingEnabled: (enabled: boolean) => 
      dispatch({ type: 'SET_TRACKING_ENABLED', payload: enabled }),
    
    incrementEmailCount: () => 
      dispatch({ type: 'INCREMENT_EMAIL_COUNT' }),
    
    setEmailCount: (count: number) => 
      dispatch({ type: 'SET_EMAIL_COUNT', payload: count }),
    
    updateSettings: (settings: Partial<AppState['settings']>) => 
      dispatch({ type: 'UPDATE_SETTINGS', payload: settings }),
    
    resetState: () => 
      dispatch({ type: 'RESET_STATE' })
  };

  return {
    state,
    actions,
    dispatch,
    isConnected,
    requestState
  };
}

// Legacy counter hook for compatibility
export default function useCounter() {
  const { state, actions } = useExtensionState();
  
  return {
    counter: state.emailCount,
    increment: actions.incrementEmailCount,
    init: () => {} // No-op for compatibility
  };
}
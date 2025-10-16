// Main store exports
export { useExtensionState, default as useCounter } from './useCounter';
export { default as StateActions } from './actions';
export { default as ExtensionMessenger } from './messenger';

// Types
export type { AppState, StateAction, Message, StateListener } from './types';

// Reducer and initial state
export { stateReducer, initialState } from './reducer';

// Re-export everything for convenience
export * from './types';
export * from './reducer';
export * from './actions';
export * from './messenger';
export * from './useCounter';
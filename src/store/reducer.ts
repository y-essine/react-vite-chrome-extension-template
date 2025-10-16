import { AppState, StateAction } from './types';

export const initialState: AppState = {
  isAuthenticated: false,
  user: null,
  authToken: null,
  trackingEnabled: true,
  emailCount: 0,
  settings: {
    notifications: true,
    autoTrack: true,
    theme: 'light'
  }
};

export function stateReducer(state: AppState, action: StateAction): AppState {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        authToken: action.payload.token
      };

    case 'CLEAR_AUTH':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        authToken: null
      };

    case 'SET_USER':
      return {
        ...state,
        user: action.payload
      };

    case 'SET_TRACKING_ENABLED':
      return {
        ...state,
        trackingEnabled: action.payload
      };

    case 'INCREMENT_EMAIL_COUNT':
      return {
        ...state,
        emailCount: state.emailCount + 1
      };

    case 'SET_EMAIL_COUNT':
      return {
        ...state,
        emailCount: action.payload
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
}
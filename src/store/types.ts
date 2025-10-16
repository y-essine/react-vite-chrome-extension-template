export interface AppState {
  isAuthenticated: boolean;
  user: {
    id?: string;
    email?: string;
    name?: string;
  } | null;
  authToken: string | null;
  trackingEnabled: boolean;
  emailCount: number;
  settings: {
    notifications: boolean;
    autoTrack: boolean;
    theme: 'light' | 'dark';
  };
}

export interface StateAction {
  type: string;
  payload?: any;
}

export interface Message {
  type: 'STATE_UPDATE' | 'STATE_REQUEST' | 'STATE_RESPONSE' | 'ACTION';
  data?: any;
  action?: StateAction;
  state?: AppState;
}

export type StateListener = (state: AppState) => void;
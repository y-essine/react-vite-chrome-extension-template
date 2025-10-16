import { StateAction } from './types';
import ExtensionMessenger from './messenger';

export class StateActions {
  
  // Authentication actions
  static async setAuth(user: any, token: string) {
    return ExtensionMessenger.dispatchAction({
      type: 'SET_AUTH',
      payload: { user, token }
    });
  }

  static async clearAuth() {
    return ExtensionMessenger.dispatchAction({
      type: 'CLEAR_AUTH'
    });
  }

  static async setUser(user: any) {
    return ExtensionMessenger.dispatchAction({
      type: 'SET_USER',
      payload: user
    });
  }

  // Tracking actions
  static async setTrackingEnabled(enabled: boolean) {
    return ExtensionMessenger.dispatchAction({
      type: 'SET_TRACKING_ENABLED',
      payload: enabled
    });
  }

  // Email actions
  static async incrementEmailCount() {
    return ExtensionMessenger.dispatchAction({
      type: 'INCREMENT_EMAIL_COUNT'
    });
  }

  static async setEmailCount(count: number) {
    return ExtensionMessenger.dispatchAction({
      type: 'SET_EMAIL_COUNT',
      payload: count
    });
  }

  // Settings actions
  static async updateSettings(settings: any) {
    return ExtensionMessenger.dispatchAction({
      type: 'UPDATE_SETTINGS',
      payload: settings
    });
  }

  static async setNotifications(enabled: boolean) {
    return this.updateSettings({ notifications: enabled });
  }

  static async setAutoTrack(enabled: boolean) {
    return this.updateSettings({ autoTrack: enabled });
  }

  static async setTheme(theme: 'light' | 'dark') {
    return this.updateSettings({ theme });
  }

  // General actions
  static async resetState() {
    return ExtensionMessenger.dispatchAction({
      type: 'RESET_STATE'
    });
  }

  // Custom action dispatcher
  static async dispatch(action: StateAction) {
    return ExtensionMessenger.dispatchAction(action);
  }
}

export default StateActions;
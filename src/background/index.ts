import { AppState, Message, StateAction } from '@/store/types';
import { initialState, stateReducer } from '@/store/reducer';

class BackgroundStateManager {
  private state: AppState = initialState;

  constructor() {
    this.initializeBackground();
    this.setupMessageListener();
    this.loadStateFromStorage();
  }

  private initializeBackground() {
    console.log('[Background] State manager initialized');
  }

  private setupMessageListener() {
    chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
      console.log('[Background] Received message:', message);

      switch (message.type) {
        case 'STATE_REQUEST':
          // Send current state to requester
          sendResponse({ 
            type: 'STATE_RESPONSE', 
            state: this.state 
          });
          break;

        case 'ACTION':
          if (message.action) {
            this.dispatch(message.action);
            sendResponse({ success: true });
          }
          break;

        case 'STATE_UPDATE':
          // Direct state update (use sparingly)
          if (message.state) {
            this.setState(message.state);
            sendResponse({ success: true });
          }
          break;
      }

      return true; // Keep message channel open for async response
    });
  }

  private async loadStateFromStorage() {
    try {
      const result = await chrome.storage.local.get(['appState']);
      if (result.appState) {
        this.state = { ...initialState, ...result.appState };
        console.log('[Background] State loaded from storage:', this.state);
        this.notifyStateChange();
      }
    } catch (error) {
      console.error('[Background] Failed to load state from storage:', error);
    }
  }

  private async saveStateToStorage() {
    try {
      await chrome.storage.local.set({ appState: this.state });
      console.log('[Background] State saved to storage');
    } catch (error) {
      console.error('[Background] Failed to save state to storage:', error);
    }
  }

  public dispatch(action: StateAction) {
    console.log('[Background] Dispatching action:', action);
    const newState = stateReducer(this.state, action);
    
    if (newState !== this.state) {
      this.setState(newState);
    }
  }

  private setState(newState: AppState) {
    this.state = newState;
    this.saveStateToStorage();
    this.notifyStateChange();
  }

  private notifyStateChange() {
    // Broadcast state change to all extension contexts
    this.broadcastStateUpdate();
  }

  private async broadcastStateUpdate() {
    try {
      // Send to all tabs with content scripts
      const tabs = await chrome.tabs.query({});
      for (const tab of tabs) {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, {
            type: 'STATE_UPDATE',
            state: this.state
          }).catch(() => {
            // Ignore errors for tabs without content scripts
          });
        }
      }

      // Send to popup if it's open
      chrome.runtime.sendMessage({
        type: 'STATE_UPDATE',
        state: this.state
      }).catch(() => {
        // Popup might not be open
      });

    } catch (error) {
      console.error('[Background] Error broadcasting state update:', error);
    }
  }

  public getState(): AppState {
    return this.state;
  }
}

// Initialize the background state manager
const stateManager = new BackgroundStateManager();

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[Background] Extension installed/updated:', details);
});

// Export for potential use in other background scripts
export { stateManager };
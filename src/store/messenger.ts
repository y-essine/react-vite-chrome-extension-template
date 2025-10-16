import { Message, StateAction } from './types';

export class ExtensionMessenger {
  
  /**
   * Send a message to the background script
   */
  static async sendToBackground(message: Message): Promise<any> {
    try {
      return await chrome.runtime.sendMessage(message);
    } catch (error) {
      console.error('[Messenger] Failed to send message to background:', error);
      throw error;
    }
  }

  /**
   * Send a message to all content scripts
   */
  static async sendToAllContentScripts(message: Message): Promise<void> {
    try {
      const tabs = await chrome.tabs.query({});
      const promises = tabs.map(tab => {
        if (tab.id) {
          return chrome.tabs.sendMessage(tab.id, message).catch(() => {
            // Ignore errors for tabs without content scripts
          });
        }
      });
      await Promise.all(promises);
    } catch (error) {
      console.error('[Messenger] Failed to send message to content scripts:', error);
    }
  }

  /**
   * Send a message to a specific tab's content script
   */
  static async sendToContentScript(tabId: number, message: Message): Promise<any> {
    try {
      return await chrome.tabs.sendMessage(tabId, message);
    } catch (error) {
      console.error(`[Messenger] Failed to send message to tab ${tabId}:`, error);
      throw error;
    }
  }

  /**
   * Dispatch an action to the background state manager
   */
  static async dispatchAction(action: StateAction): Promise<void> {
    return this.sendToBackground({
      type: 'ACTION',
      action
    });
  }

  /**
   * Request current state from background
   */
  static async requestState(): Promise<any> {
    return this.sendToBackground({
      type: 'STATE_REQUEST'
    });
  }

  /**
   * Set up a message listener with automatic cleanup
   */
  static setupMessageListener(
    callback: (message: Message, sender: chrome.runtime.MessageSender) => void | Promise<void>
  ): () => void {
    const listener = (
      message: Message, 
      sender: chrome.runtime.MessageSender, 
      sendResponse: (response?: any) => void
    ) => {
      const result = callback(message, sender);
      
      // If callback returns a promise, handle it
      if (result instanceof Promise) {
        result.then(sendResponse).catch(error => {
          console.error('[Messenger] Error in message handler:', error);
          sendResponse({ error: error.message });
        });
        return true; // Keep message channel open
      }
    };

    chrome.runtime.onMessage.addListener(listener);

    // Return cleanup function
    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }
}

export default ExtensionMessenger;
import { StateActions, ExtensionMessenger } from '@/store';

/**
 * Demo functions to test state synchronization
 * These can be called from browser console or other scripts
 */

// Extend Window interface for TypeScript
declare global {
  interface Window {
    trackzDemo: any;
  }
}

// @ts-ignore - Making functions available globally for testing
window.trackzDemo = {
  
  // Authentication demos
  async loginDemo() {
    console.log('🔐 Demo: Logging in...');
    await StateActions.setAuth(
      { 
        id: 'demo-user-123', 
        email: 'demo@trackz.com', 
        name: 'Demo User' 
      },
      'demo-token-' + Date.now()
    );
    console.log('✅ Demo login complete');
  },

  async logoutDemo() {
    console.log('🚪 Demo: Logging out...');
    await StateActions.clearAuth();
    console.log('✅ Demo logout complete');
  },

  // Tracking demos
  async toggleTracking() {
    console.log('🔄 Demo: Toggling tracking...');
    // Get current state first to toggle properly
    const state = await window.trackzDemo.getState();
    await StateActions.setTrackingEnabled(!state.trackingEnabled);
    console.log('✅ Demo tracking toggle complete');
  },

  // Email demos
  async addEmails(count = 1) {
    console.log(`📧 Demo: Adding ${count} emails...`);
    for (let i = 0; i < count; i++) {
      await StateActions.incrementEmailCount();
    }
    console.log('✅ Demo email addition complete');
  },

  async resetEmails() {
    console.log('🔄 Demo: Resetting email count...');
    await StateActions.setEmailCount(0);
    console.log('✅ Demo email reset complete');
  },

  // Settings demos
  async toggleNotifications() {
    console.log('🔔 Demo: Toggling notifications...');
    const state = await window.trackzDemo.getState();
    await StateActions.setNotifications(!state.settings.notifications);
    console.log('✅ Demo notification toggle complete');
  },

  async switchTheme() {
    console.log('🎨 Demo: Switching theme...');
    const state = await window.trackzDemo.getState();
    const newTheme = state.settings.theme === 'light' ? 'dark' : 'light';
    await StateActions.setTheme(newTheme);
    console.log(`✅ Demo theme switched to ${newTheme}`);
  },

  // State inspection
  async getState() {
    const response = await ExtensionMessenger.requestState();
    console.log('📊 Current state:', response.state);
    return response.state;
  },

  async resetAll() {
    console.log('🔄 Demo: Resetting all state...');
    await StateActions.resetState();
    console.log('✅ Demo state reset complete');
  },

  // Quick test sequence
  async runTestSequence() {
    console.log('🧪 Running full demo test sequence...');
    
    await this.loginDemo();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await this.addEmails(3);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await this.toggleTracking();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await this.switchTheme();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await this.getState();
    
    console.log('🎉 Demo test sequence complete!');
    console.log('💡 Try opening the popup and content script to see synced state');
  }
};

console.log('🚀 Trackz Demo loaded!');
console.log('💡 Available demo functions:');
console.log('   - trackzDemo.loginDemo()');
console.log('   - trackzDemo.logoutDemo()'); 
console.log('   - trackzDemo.toggleTracking()');
console.log('   - trackzDemo.addEmails(count)');
console.log('   - trackzDemo.resetEmails()');
console.log('   - trackzDemo.toggleNotifications()');
console.log('   - trackzDemo.switchTheme()');
console.log('   - trackzDemo.getState()');
console.log('   - trackzDemo.resetAll()');
console.log('   - trackzDemo.runTestSequence()');

export {};
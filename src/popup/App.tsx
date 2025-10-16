import crxLogo from '@/assets/crx.svg'
import reactLogo from '@/assets/react.svg'
import viteLogo from '@/assets/vite.svg'
import HelloWorld from '@/components/HelloWorld'
import { useExtensionState } from '@/store/useCounter'
import { useEffect } from 'react'
import './App.css'

export default function App() {
  const { state, actions, isConnected } = useExtensionState();

  useEffect(() => {
    console.log('[Popup] Current state:', state);
  }, [state]);

  const handleAuth = () => {
    actions.setAuth(
      { id: '1', email: 'user@example.com', name: 'Test User' },
      'fake-token-123'
    );
  };

  const handleLogout = () => {
    actions.clearAuth();
  };

  const handleToggleTracking = () => {
    actions.setTrackingEnabled(!state.trackingEnabled);
  };

  const handleIncrementEmails = () => {
    actions.incrementEmailCount();
  };

  return (
    <div style={{ padding: '20px', minWidth: '300px' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org/" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://crxjs.dev/vite-plugin" target="_blank" rel="noreferrer">
          <img src={crxLogo} className="logo crx" alt="crx logo" />
        </a>
      </div>

      <HelloWorld msg="Trackz Extension" />

      <div style={{ marginTop: '20px' }}>
        <h3>State Sync Demo</h3>
        
        <div style={{ marginBottom: '10px' }}>
          <strong>Connection:</strong> {isConnected ? '✅ Connected' : '❌ Disconnected'}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <strong>Auth Status:</strong> {state.isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
        </div>

        {state.user && (
          <div style={{ marginBottom: '10px' }}>
            <strong>User:</strong> {state.user.name} ({state.user.email})
          </div>
        )}

        <div style={{ marginBottom: '10px' }}>
          <strong>Tracking:</strong> {state.trackingEnabled ? '✅ Enabled' : '❌ Disabled'}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <strong>Email Count:</strong> {state.emailCount}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {!state.isAuthenticated ? (
            <button onClick={handleAuth}>
              Login (Demo)
            </button>
          ) : (
            <button onClick={handleLogout}>
              Logout
            </button>
          )}

          <button onClick={handleToggleTracking}>
            {state.trackingEnabled ? 'Disable' : 'Enable'} Tracking
          </button>

          <button onClick={handleIncrementEmails}>
            Add Email (+1)
          </button>
        </div>
      </div>
    </div>
  )
}

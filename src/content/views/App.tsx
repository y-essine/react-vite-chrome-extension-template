import Logo from '@/assets/crx.svg'
import { useEffect, useState } from 'react'
import './App.css'
import { useExtensionState } from "@/store/useCounter"

function App() {
  const [show, setShow] = useState(false)
  const toggle = () => setShow(!show)
  const { state, actions, isConnected } = useExtensionState()

  useEffect(() => {
    console.log('[Content] Current state:', state);
  }, [state]);

  const handleToggleTracking = () => {
    actions.setTrackingEnabled(!state.trackingEnabled);
  };

  const handleIncrementEmails = () => {
    actions.incrementEmailCount();
  };

  return (
    <div className="popup-container">
      {show && (
        <div className={`popup-content ${show ? 'opacity-100' : 'opacity-0'}`}>
          <h1>TRACKZ CONTENT</h1>
          <p>State synchronized with popup.</p>
          
          <div style={{ marginBottom: '15px', fontSize: '12px' }}>
            <div><strong>Connection:</strong> {isConnected ? '✅' : '❌'}</div>
            <div><strong>Auth:</strong> {state.isAuthenticated ? '✅' : '❌'}</div>
            <div><strong>Tracking:</strong> {state.trackingEnabled ? '✅' : '❌'}</div>
            <div><strong>Emails:</strong> {state.emailCount}</div>
          </div>

          <div className="card">
            <button type="button" onClick={handleIncrementEmails}>
              Email count: {state.emailCount}
            </button>
            <button type="button" onClick={handleToggleTracking}>
              {state.trackingEnabled ? 'Disable' : 'Enable'} Tracking
            </button>
          </div>
        </div>
      )}
      <button className="toggle-button" onClick={toggle}>
        <img src={Logo} alt="CRXJS logo" className="button-icon" />
        {state.trackingEnabled && (
          <span style={{ 
            position: 'absolute', 
            top: '-5px', 
            right: '-5px', 
            background: 'green', 
            borderRadius: '50%', 
            width: '10px', 
            height: '10px' 
          }} />
        )}
      </button>
    </div>
  )
}

export default App

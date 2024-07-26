import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { StationProvider } from './context/StationContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StationProvider>
      <App />
    </StationProvider>
  </React.StrictMode>,
)

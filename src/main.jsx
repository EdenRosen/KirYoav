import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter as Router } from 'react-router-dom'
// import { AuthProvider } from './contexts/AuthContext'
// import { DatabaseProvider } from './contexts/DatabaseContext'
import App from './App'
import './styles/index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Router>
      {/* <AuthProvider>
        <DatabaseProvider> */}
          <App />
        {/* </DatabaseProvider>
      </AuthProvider> */}
    </Router>
  </StrictMode>
);

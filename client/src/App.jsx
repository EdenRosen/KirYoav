import { Routes, Route } from 'react-router-dom'
// import { useAuth } from './contexts/AuthContext'
import Home from './pages/Home'
import Climbers from './pages/Climbers'
// import Login from './pages/Login'
// import Signup from './pages/Signup'
// import ForgotPassword from './pages/ForgotPassword'
// import ResetPassword from'./pages/ResetPassword'
// import NotFound from './pages/NotFound'
// import User from './pages/User'
// import Users from './pages/Users'
import './styles/components.css'
import './styles/pages.css'

function App() {
  // const { currentUser } = useAuth()
  
  return (
    <div className="App">
      <div className="content">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/climbers" element={<Climbers/>} />
          
          {/* { !currentUser && <Route path="/login" element={<Login/>} /> }
          { !currentUser && <Route path="/signup" element={<Signup/>} /> }
          { !currentUser && <Route path="/forgot-password" element={<ForgotPassword/>} /> }
          { !currentUser && <Route path="/reset-password" element={<ResetPassword/>} /> }
           */}
          {/* <Route path="/users" element={<Users/>} />
          <Route path="/user/:id" element={<User/>} /> */}
          {/* <Route path="*" element={<NotFound/>} /> */}
        </Routes>
      </div>
    </div>
  )
}

export default App

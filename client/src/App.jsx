import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register'; // <-- IMPORT REGISTER
import Dashboard from './pages/Dashboard';
import ProjectBoard from './pages/ProjectBoard';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} /> {/* <-- ADD THIS ROUTE */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/board/:projectId" 
        element={
          <ProtectedRoute>
            <ProjectBoard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
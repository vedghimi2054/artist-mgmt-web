import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import {  AuthProvider } from './context/AuthContext';
import Dashboard from './pages/DashboardPage';
import Users from './pages/Users';
import BaseLayout from './layout/BaseLayout';
import { ToastContainer } from 'react-toastify';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import Artists from './pages/Artists';
import Music from './pages/Music';



function App() {
  return (
    <AuthProvider>
              <ToastContainer />

      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path='/login' element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
           
           <Route element={<PrivateRoute />}>
            <Route
              path="/"
              element={

                  <Dashboard />

              }
            />
            
            <Route
              path="/users"
              element={

                  <Users />

              }
            />
            <Route
              path="/artists"
              element={

                  <Artists />

              }
            />
             <Route
              path="/artists/:artistId/music"
              element={

                  <Music />

              }
            />
           </Route>
           
            
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

const PrivateRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  
  return user ?   <BaseLayout /> : <Navigate to="/login" />;
};

export default App;


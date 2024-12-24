import React, { useState } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
// import Users from './Users';
// import Artists from './Artists';
// import Songs from './Songs';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* <div className="py-10">
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <Routes>
              {user?.role === 'super_admin' && (
                <Route path="users" element={<Users />} />
              )}
              <Route path="artists" element={<Artists />} />
              <Route path="artists/:artistId/songs" element={<Songs />} />
            </Routes>
          </div>
        </main>
      </div> */}
    </div>
  );
};

export default Dashboard;


import React from "react";
import { useAuth } from "../context/AuthContext";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import UserList from "../components/UserList";
import ArtistList from "../components/ArtistList";

const DashboardPage = () => {
  const { logout } = useAuth();

  return (
    <div className="p-4">
      <header className="flex justify-between items-center bg-blue-500 text-white p-4">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <button
          onClick={logout}
          className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-gray-200"
        >
          Logout
        </button>
      </header>
      <nav className="flex space-x-4 p-4 bg-gray-200">
        <Link to="/dashboard/users" className="text-blue-500">Users</Link>
        <Link to="/dashboard/artists" className="text-blue-500">Artists</Link>
      </nav>
      <main className="p-4">
        <Routes>
          <Route path="users" element={<UserList />} />
          <Route path="artists" element={<ArtistList />} />
          <Route path="*" element={<Navigate to="users" />} />
        </Routes>
      </main>
    </div>
  );
};

export default DashboardPage;
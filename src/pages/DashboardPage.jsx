import React, { useState, useEffect } from "react";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../utils/axios";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    fetchAllDashboardStatistics();
  }, []);

  const fetchAllDashboardStatistics = async () => {
    try {
      const response = await axiosClient.get(`/dashboard`);

      setDashboard(response.data.meta);
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Error fetching artists");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="flex w-full gap-4 px-4"> 
        <div class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow">
          <a href="#">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-black">
              Total Users
            </h5>
          </a>
          <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{dashboard?.totalUsers}</p>
          <Link
            to={"/users"}
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Users
          </Link>
        </div>

        <div class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow">
          <a href="#">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-black">
              Total Artists
            </h5>
          </a>
          <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{dashboard?.totalArtists}</p>
          <Link
            to={"/artists"}
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Artists
          </Link>
        </div>

        <div class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow">
          <a href="#">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-black">
              Total Songs
            </h5>
          </a>
          <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{dashboard?.totalSongs}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

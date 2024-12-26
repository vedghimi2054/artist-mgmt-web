import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../utils/axios";

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const { artistId } = useParams();

  useEffect(() => {
    fetchAllDashboardStatistics();
  }, []);

  const fetchAllDashboardStatistics = async () => {
    try {
      const response = await axiosClient.get(`/dashboard`);
      setDashboard(response.data.meta);
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message || "Error fetching dashboard data"
      );
    }
  };

  if (!user) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="flex w-full gap-4 px-4">
        {/* Total Users Section - Visible only for SUPER_ADMIN */}
        {user.role === "SUPER_ADMIN" && (
          <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-black">
              Total Users
            </h5>
            <p className="mb-3 font-normal text-gray-700">
              {dashboard?.totalUsers}
            </p>
            <Link
              to={"/users"}
              state={{ activeTab: "users" }}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800"
            >
              Users
            </Link>
          </div>
        )}

        {/* Total Artists Section - Visible for SUPER_ADMIN and ARTIST_MANAGER */}
        {(user.role === "SUPER_ADMIN" || user.role === "ARTIST_MANAGER") && (
          <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-black">
              Total Artists
            </h5>
            <p className="mb-3 font-normal text-gray-700">
              {dashboard?.totalArtists}
            </p>
            <Link
              to={"/artists"}
              state={{ activeTab: "artists" }}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800"
            >
              Artists
            </Link>
          </div>
        )}

        {/* Total Songs Section - Visible for all roles */}
        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-black">
            Total Songs
          </h5>
          <p className="mb-3 font-normal text-gray-700">
            {dashboard?.totalSongs}
          </p>
        </div>
      </div>
      {/* Error Message */}
      {errorMessage && (
        <p className="text-red-500 text-center mt-4">{errorMessage}</p>
      )}
    </div>
  );
};

export default Dashboard;

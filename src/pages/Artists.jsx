import React, { useState, useEffect } from "react";
import axiosClient, { baseUrl, getAuthToken } from "../utils/axios";
import { toast } from "react-toastify";
import { FaFileImport, FaFileExport } from "react-icons/fa"; // Import icons
import ArtistForm from "../components/forms/Artist";
import { PlusIcon } from "@heroicons/react/16/solid";
import Pagination from "../components/Pagination";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const Artists = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [artists, setArtists] = useState([]);
  const [editingArtist, setEditingArtist] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [pagination, setPagination] = useState({
    totalPages: 1,
    pageSize: 10,
  });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentPage = searchParams.get("page") || 1;

  useEffect(() => {
    fetchArtists();
  }, [modalOpen, currentPage]);

  const fetchArtists = async () => {
    try {
      const response = await axiosClient.get(`/artists`, {
        params: {
          page: currentPage,
          pageSize: pagination.pageSize,
        },
      });
      console.log("response", response);

      setArtists(response.data.dataResponse || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: response?.data?.meta?.totalPages,
      }));
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Error fetching artists");
    }
  };

  const handleUpdateArtist = (artist) => {
    setEditingArtist(artist);
    setModalOpen(true);
  };

  const handleCreateArtist = () => {
    setModalOpen(true);
  };

  const handleDeleteArtist = async (id) => {
    try {
      await axiosClient.delete(`/artists/${id}`);
      setArtists(artists.filter((artist) => artist.id !== id));
      toast.success("Artist deleted successfully");
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Error deleting artist");
      toast.error(err?.response?.data?.message || "Error deleting artist");
    }
  };

  // Handle CSV import (reading file and calling an API)
  const handleCsvImport = async (e) => {
    try {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      try {
        await axios({
          method: "post",
          url: baseUrl + "/artists/import",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + getAuthToken(),
          },
        }); // Bulk API call
        toast.success("Artists imported successfully");
        window.location.reload();
      } catch (err) {
        console.error("Error posting data:", err);
        toast.error("Error importing artists");
      }
    } catch (err) {
      console.error("Error reading file:", err);
      toast.error("Error importing artists");
    }
  };

  // Handle CSV export
  const handleCsvExport = async () => {
    try {
      const response = await axiosClient.get("/artists/export", {
        params: {
          page: currentPage,
          pageSize: pagination.pageSize,
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "output.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Error fetching users");
    }
  };

  return (
    <div className="flex flex-col gap-2 py-4 bg-white shadow overflow-hidden sm:rounded-lg">
      {/* Artist Form Modal */}

      <ArtistForm
        artist={editingArtist}
        open={modalOpen}
        setOpen={setModalOpen}
      />
      <div className={modalOpen ? "block" : "hidden"}>
        {/* Modal content here */}
        <div>{/* Modal Content */}</div>
      </div>

      <button
        className="absolute bottom-2 right-2 h-11 w-11 rounded-full inline-flex items-center p-2 py-2 border border-transparent text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
        onClick={handleCreateArtist}
      >
        <PlusIcon />
      </button>

      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Artists</h3>

        {/* CSV Import and Export Icons */}
        <div className="flex space-x-4">
          <label
            htmlFor="csv-import"
            className="cursor-pointer"
            title="CSV import"
          >
            <FaFileImport
              size={20}
              className="text-green-500 hover:text-green-700"
            />
            <input
              type="file"
              id="csv-import"
              accept=".csv"
              className="hidden"
              onChange={(e) => handleCsvImport(e)}
            />
          </label>

          <label
            htmlFor="csv-export"
            className="cursor-pointer"
            title="CSV export"
          >
            <FaFileExport
              size={20}
              className="text-blue-500 hover:text-blue-700"
              onClick={handleCsvExport}
            />
          </label>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                DOB
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gender
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Albums Released
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {artists.length > 0 ? (
              artists.map((artist) => (
                <tr key={artist.id}>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                    {artist.name}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                    {artist.dob.split("T")[0]}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                    {artist.gender}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                    {artist.noOfAlbumsReleased}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/artist/${artist.id}/music`}
                      className="inline-flex items-center px-2 py-1 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
                    >
                      View music
                    </Link>
                    <button
                      onClick={() => handleUpdateArtist(artist)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteArtist(artist.id)}
                      className="text-red-600 hover:text-red-900 mr-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-4 text-sm text-gray-500"
                >
                  No artists available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <Pagination totalPages={pagination?.totalPages} />
    </div>
  );
};

export default Artists;

import React, { useState, useEffect } from "react";
import axiosClient, { baseUrl, getAuthToken } from "../utils/axios";
import { toast } from "react-toastify";
import { CSVLink } from "react-csv"; // Import CSVLink for export
import { FaFileImport, FaFileExport } from "react-icons/fa"; // Import icons
import ArtistForm from "../components/forms/Artist";
import { PlusIcon } from "@heroicons/react/16/solid";
import Pagination from "../components/Pagination";
import { useSearchParams } from "react-router-dom";
import { formatToDbDateTime } from "../utils/dataTime";
import axios from "axios";

const Artists = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [artists, setArtists] = useState([]);
  const [searchParams] = useSearchParams();

  const [editingArtist, setEditingArtist] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [pagination, setPagination] = useState({
    totalPages: 1,
    pageSize: 10,
  });

  const currentPage = searchParams.get("page") || 1

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

      setArtists(response.data.dataResponse || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.data.meta.totalPages,
      }));
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Error fetching artists");
    }
  };

  const handleUpdateArtist =  (artist) => {
    setEditingArtist(artist)
    setModalOpen(true)
  };

  const handleCreateArtist = () => {
    setModalOpen(true)
  }

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
          await axios({method: "post", url: baseUrl + "/artists/import",data: formData, headers: { "Content-Type": "multipart/form-data",  'Authorization':'Bearer '+ getAuthToken() },} ); // Bulk API call
          toast.success("Artists imported successfully");
          window.location.reload()
        } catch (err) {
          console.error("Error posting data:", err);
          toast.error("Error importing artists");
        }

  
    } catch (err) {
      console.error("Error reading file:", err);
      toast.error("Error importing artists");
    }
  };
  
  // Parse CSV file into an array of objects
  const parseCsv = (data) => {
    const lines = data.split("\n").filter((line) => line.trim() !== ""); // Split and filter empty lines
    const headers = lines[0].split(",").map((header) => header.trim()); // Extract headers
    const rows = lines.slice(1); // Exclude headers
  
    const formattedRows = rows.map((line) => {
      const values = line.split(",").map((value) => value.trim());
      const rowObject = headers.reduce((acc, header, index) => {
        acc[header] = header === "dob" ? formatToDbDateTime(values[index]) : values[index]; // Format dob
        return acc;
      }, {});
  
      return rowObject;
    });
  
    return formattedRows;
  };
  
  // Helper function to format date to DB-friendly format
  const formatToDbDateTime = (dob) => {
    const date = new Date(dob);
    return date.toISOString(); // Convert to ISO 8601 format
  };
  

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        currentPage: page,
      }));
    }
  };

  return (
    <div className="flex flex-col gap-2 py-4 bg-white shadow overflow-hidden sm:rounded-lg">
      {/* Artist Form Modal */}
      
      <ArtistForm artist={editingArtist} open={modalOpen} setOpen={setModalOpen}  />
      <div className={modalOpen ? "block" : "hidden"}>
        {/* Modal content here */}
        <div>
          {/* Modal Content */}
        </div>
      </div>

        <button
              className="absolute bottom-2 right-2 h-11 w-11 rounded-full inline-flex items-center p-2 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            onClick={handleCreateArtist}
            >
              <PlusIcon /> 
            </button>
     

      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Artists</h3>

        {/* CSV Import and Export Icons */}
        <div className="flex space-x-4">
         
          <label htmlFor="csv-import" className="cursor-pointer" title="CSV Import">
            <FaFileImport size={20} className="text-green-500 hover:text-green-700" />
            <input
              type="file"
              id="csv-import"
              accept=".csv"
              className="hidden"
              onChange={(e) => handleCsvImport(e)}
            />
          </label>

          <CSVLink
            data={artists} // Export the current artist list
            filename="artists.csv"
            className="text-blue-500 hover:text-blue-700"
            title="CSV Export"
          >
            <FaFileExport size={20} />
          </CSVLink>
        </div>
      </div>

      {errorMessage && <div className="text-red-500">{errorMessage}</div>}

      <div className="border-t border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOB</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Albums Released</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {artists.length > 0 ? (
              artists.map((artist) => (
                <tr key={artist.id}>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{artist.name}</td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{artist.dob.split("T")[0]}</td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{artist.gender}</td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{artist.noOfAlbumsReleased}</td>
                  <td className="px-6 py-2 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleUpdateArtist(artist)}
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteArtist(artist.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-sm text-gray-500">
                  No artists available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
  <Pagination totalPages={pagination.totalPages}/>
    </div>
  );
};

export default Artists;

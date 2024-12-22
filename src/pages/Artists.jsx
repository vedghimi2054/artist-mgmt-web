import React, { useState, useEffect } from "react";
import axiosClient from "../utils/axios";
import { toast } from "react-toastify";
import { CSVLink } from "react-csv"; // Import CSVLink for export
import { FaFileImport, FaFileExport } from "react-icons/fa"; // Import icons

const Artists = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentArtist, setCurrentArtist] = useState(null);
  const [artists, setArtists] = useState([]);
  const [newArtist, setNewArtist] = useState({
    name: "",
    dob: "",
    gender: "",
    address: "",
    firstReleaseYear: "",
    noOfAlbumsReleased: "",
  });
  const [editingArtist, setEditingArtist] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [csvFile, setCsvFile] = useState(null); // State for CSV file

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axiosClient.get("/artists");
        setArtists(response.data.dataResponse || []);
      } catch (err) {
        setErrorMessage(err?.response?.data?.message || "Error fetching artists");
      }
    };

    fetchArtists();
  }, []);

  const handleCreateArtist = () => {
    setModalOpen(true);
    const id = Math.random().toString(36).substr(2, 9);
    setArtists([...artists, { ...newArtist, id }]);
    setNewArtist({
      name: "",
      dob: "",
      gender: "",
      address: "",
      firstReleaseYear: "",
      noOfAlbumsReleased: "",
    });
    toast.success("Artist created successfully");
  };

  const handleUpdateArtist = async () => {
    if (editingArtist) {
      try {
        const response = await axiosClient.put(`/artists/${editingArtist.id}`, editingArtist);
        setArtists(
          artists.map((artist) =>
            artist.id === response.data.dataResponse.id ? response.data.dataResponse : artist
          )
        );
        setEditingArtist(null);
        setModalOpen(false);
        toast.success("Artist updated successfully");
      } catch (err) {
        setErrorMessage(err?.response?.data?.message || "Error updating artist");
        toast.error(err?.response?.data?.message || "Error updating artist");
      }
    }
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
  const handleCsvImport = async () => {
    if (csvFile) {
      try {
        const reader = new FileReader();
        reader.onload = async () => {
          const fileContent = reader.result;
          const parsedData = parseCsv(fileContent); // Use a library to parse CSV data
          await axiosClient.post("/artists/bulk", parsedData); // Assuming your API supports bulk import
          toast.success("Artists imported successfully");
        };
        reader.readAsText(csvFile);
      } catch (err) {
        toast.error("Error importing artists");
      }
    }
  };

  // Parse CSV file (assuming CSV structure matches the fields)
  const parseCsv = (data) => {
    const lines = data.split("\n");
    const result = lines.map((line) => {
      const [name, dob, gender, address, firstReleaseYear, noOfAlbumsReleased] = line.split(",");
      return {
        name,
        dob,
        gender,
        address,
        firstReleaseYear,
        noOfAlbumsReleased,
      };
    });
    return result;
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      {/* Artist Form Modal */}
      <div className={modalOpen ? "block" : "hidden"}>
        {/* Modal content here */}
        <div>
          {/* Modal Content */}
        </div>
      </div>

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
              onChange={(e) => setCsvFile(e.target.files[0])}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{artist.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{artist.dob.split("T")[0]}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{artist.gender}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{artist.noOfAlbumsReleased}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingArtist(artist)}
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

      <div className="px-4 py-5 sm:px-6">
        <h4 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          {editingArtist ? "Edit Artist" : "Create New Artist"}
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={editingArtist ? editingArtist.name : newArtist.name}
            onChange={(e) =>
              editingArtist
                ? setEditingArtist({ ...editingArtist, name: e.target.value })
                : setNewArtist({ ...newArtist, name: e.target.value })
            }
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
          <input
            type="date"
            value={editingArtist ? editingArtist.dob : newArtist.dob}
            onChange={(e) =>
              editingArtist
                ? setEditingArtist({ ...editingArtist, dob: e.target.value })
                : setNewArtist({ ...newArtist, dob: e.target.value })
            }
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
          <select
            value={editingArtist ? editingArtist.gender : newArtist.gender}
            onChange={(e) =>
              editingArtist
                ? setEditingArtist({ ...editingArtist, gender: e.target.value })
                : setNewArtist({ ...newArtist, gender: e.target.value })
            }
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
          <input
            type="text"
            placeholder="Address"
            value={editingArtist ? editingArtist.address : newArtist.address}
            onChange={(e) =>
              editingArtist
                ? setEditingArtist({ ...editingArtist, address: e.target.value })
                : setNewArtist({ ...newArtist, address: e.target.value })
            }
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
          <input
            type="number"
            placeholder="First Release Year"
            value={editingArtist ? editingArtist.firstReleaseYear : newArtist.firstReleaseYear}
            onChange={(e) =>
              editingArtist
                ? setEditingArtist({ ...editingArtist, firstReleaseYear: e.target.value })
                : setNewArtist({ ...newArtist, firstReleaseYear: e.target.value })
            }
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
          <input
            type="number"
            placeholder="Albums Released"
            value={editingArtist ? editingArtist.noOfAlbumsReleased : newArtist.noOfAlbumsReleased}
            onChange={(e) =>
              editingArtist
                ? setEditingArtist({ ...editingArtist, noOfAlbumsReleased: e.target.value })
                : setNewArtist({ ...newArtist, noOfAlbumsReleased: e.target.value })
            }
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <div className="mt-4">
          {editingArtist ? (
            <button
              onClick={handleUpdateArtist}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Artist
            </button>
          ) : (
            <button
              onClick={handleCreateArtist}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Artist
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Artists;

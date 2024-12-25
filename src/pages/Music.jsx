import React, { useState, useEffect } from "react";
import axiosClient, { baseUrl, getAuthToken } from "../utils/axios";
import { toast } from "react-toastify";
import { PlusIcon } from "@heroicons/react/16/solid";
import Pagination from "../components/Pagination";
import { useParams, useSearchParams } from "react-router-dom";
import MusicForm from "../components/forms/Music";

const Music = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [music, setMusic] = useState([]);
  const [searchParams] = useSearchParams();
  const {artistId}= useParams()

  const [editingMusic, setEditingMusic] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [pagination, setPagination] = useState({
    totalPages: 1,
    pageSize: 10,
  });

  const currentPage = searchParams.get("page") || 1

  useEffect(() => {
    fetchMusic();
  }, [modalOpen, currentPage]);

  const fetchMusic = async () => {
    try {
      const response = await axiosClient.get(`/music/artist/${artistId}`, {
        params: {
          page: currentPage,
          pageSize: pagination.pageSize,
        },
      });

      setMusic(response.data.dataResponse || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.data.meta.totalPages,
      }));
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Error fetching music");
    }
  };

  const handleUpdateMusic =  (music) => {
    setEditingMusic(music)
    setModalOpen(true)
  };

  const handleCreateMusic = () => {
    setModalOpen(true)
  }

  const handleDeleteMusic = async (id) => {
    try {
      await axiosClient.delete(`/music/artist/${artistId}/${id}`);
      setMusic(music.filter((music) => music.id !== id));
      toast.success("music deleted successfully");
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Error deleting music");
      toast.error(err?.response?.data?.message || "Error deleting music");
    }
  };

  return (
    <div className="flex flex-col gap-2 py-4 bg-white shadow overflow-hidden sm:rounded-lg">
      <button
              className="absolute bottom-2 right-2 h-11 w-11 rounded-full inline-flex items-center p-2 py-2 border border-transparent text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            onClick={handleCreateMusic}
            >
              <PlusIcon /> 
            </button>
    
      {/* music Form Modal */}
      
      <MusicForm music={editingMusic} open={modalOpen} setOpen={setModalOpen}  />
      <div className={modalOpen ? "block" : "hidden"}>
        {/* Modal content here */}
        <div>
          {/* Modal Content */}
        </div>
      </div>

      
     

      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">music</h3>
      </div>

      {errorMessage && <div className="text-red-500">{errorMessage}</div>}

      <div className="border-t border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AlbumName</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {music.length > 0 ? (
              music.map((music) => (
                <tr key={music.id}>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{music.title}</td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{music.albumName}</td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{music.genre}</td>
                  <td className="px-6 py-2 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleUpdateMusic(music)}
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMusic(music.id)}
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
                  No music available.
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

export default Music;

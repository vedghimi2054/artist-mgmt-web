import React, { useState, useEffect } from "react";
import axiosClient from "../utils/axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const Music = () => {
  let {artistId} = useParams()
  const [modalOpen, setModalOpen] = useState(false);
  const [currentMusic, setCurrentMusic] = useState(null);
  const [musicList, setMusicList] = useState([]);

  const [newMusic, setNewMusic] = useState({
    title: "",
    albumName: "",
    genre: "",
  });
  const [editingMusic, setEditingMusic] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchMusic = async () => {
      if (!artistId) return;
      try {
        const response = await axiosClient.get(`/music/artist/${artistId}`);
        setMusicList(response.data.dataResponse || []);
      } catch (err) {
        setErrorMessage(err?.response?.data?.message || "Error fetching music");
      }
    };

    fetchMusic();
  }, [artistId]);

  const handleCreateMusic = () => {
    setModalOpen(true);
    const id = Math.random().toString(36).substr(2, 9);  // Generate unique id for the new music entry
    setMusicList([...musicList, { ...newMusic, id }]);
    setNewMusic({
      title: "",
      albumName: "",
      genre: "",
    });
    toast.success("Music created successfully");
  };

  const handleUpdateMusic = async () => {
    if (editingMusic) {
      try {
        const response = await axiosClient.put(`/music/artist/${artistId}/${editingMusic.id}`, editingMusic);
        setMusicList(
          musicList.map((music) =>
            music.id === response.data.dataResponse.id ? response.data.dataResponse : music
          )
        );
        setEditingMusic(null);
        setModalOpen(false);
        toast.success("Music updated successfully");
      } catch (err) {
        setErrorMessage(err?.response?.data?.message || "Error updating music");
        toast.error(err?.response?.data?.message || "Error updating music");
      }
    }
  };

  const handleDeleteMusic = async (id) => {
    try {
      await axiosClient.delete(`/music/artist/${artistId}/${id}`);
      setMusicList(musicList.filter((music) => music.id !== id));
      toast.success("Music deleted successfully");
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Error deleting music");
      toast.error(err?.response?.data?.message || "Error deleting music");
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      {/* Music Form Modal */}
      <div className={modalOpen ? "block" : "hidden"}>
        {/* Modal content here */}
      </div>

      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Music</h3>
      </div>

      {errorMessage && <div className="text-red-500">{errorMessage}</div>}

      <div className="border-t border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Album</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {musicList.length > 0 ? (
              musicList.map((music) => (
                <tr key={music.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{music.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{music.albumName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{music.genre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingMusic(music)}
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
                <td colSpan="4" className="text-center py-4 text-sm text-gray-500">
                  No music available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-5 sm:px-6">
        <h4 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          {editingMusic ? "Edit Music" : "Create New Music"}
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Title"
            value={editingMusic ? editingMusic.title : newMusic.title}
            onChange={(e) =>
              editingMusic
                ? setEditingMusic({ ...editingMusic, title: e.target.value })
                : setNewMusic({ ...newMusic, title: e.target.value })
            }
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
          <input
            type="text"
            placeholder="Album Name"
            value={editingMusic ? editingMusic.albumName : newMusic.albumName}
            onChange={(e) =>
              editingMusic
                ? setEditingMusic({ ...editingMusic, albumName: e.target.value })
                : setNewMusic({ ...newMusic, albumName: e.target.value })
            }
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
          <select
            value={editingMusic ? editingMusic.genre : newMusic.genre}
            onChange={(e) =>
              editingMusic
                ? setEditingMusic({ ...editingMusic, genre: e.target.value })
                : setNewMusic({ ...newMusic, genre: e.target.value })
            }
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          >
            <option value="CLASSIC">Classic</option>
            <option value="COUNTRY">Country</option>
            <option value="ROCK">Rock</option>
            <option value="JAZZ">Jazz</option>
            <option value="MB">MB</option>
          </select>
        </div>
        <div className="mt-4">
          {editingMusic ? (
            <button
              onClick={handleUpdateMusic}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Music
            </button>
          ) : (
            <button
              onClick={handleCreateMusic}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Music
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Music;

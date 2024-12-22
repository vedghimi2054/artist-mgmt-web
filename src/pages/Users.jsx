import React, { useState, useEffect } from "react";
import UserForm from "../components/forms/User";
import axiosClient from "../utils/axios";
import { toast } from "react-toastify";

const Users = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    role: ""
  });
  const [editingUser, setEditingUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosClient.get("/user/list");
        setUsers(response.data.dataResponse || []);
      } catch (err) {
        setErrorMessage(err?.response?.data?.message || "Error fetching users");
      }
    };

    fetchUsers();
  }, []);

  const handleCreateUser = () => {
    setModalOpen(true);
    const id = Math.random().toString(36).substr(2, 9);
    setUsers([...users, { ...newUser, id }]);
    setNewUser({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dob: "",
      gender: "",
      address: "",
      role: ""
    });
  };

  const handleUpdateUser = async () => {
    if (editingUser) {
      try {
        const response = await axiosClient.put(`/user/${editingUser.id}`, editingUser);
        setUsers(
          users.map((user) =>
            user.id === response.data.dataResponse.id ? response.data.dataResponse : user
          )
        );
        setEditingUser(null);
        setModalOpen(false);
        toast.success("User updated successfully");
      } catch (err) {
        setErrorMessage(err?.response?.data?.message || "Error updating user");
        toast.error(err?.response?.data?.message || "Error updating user");
      }
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axiosClient.delete(`/user/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      toast.success("User deleted successfully");
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Error deleting user");
      toast.error(err?.response?.data?.message || "Error deleting user");
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <UserForm user={currentUser} open={modalOpen} setOpen={setModalOpen} />
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Users</h3>
      </div>
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
      <div className="border-t border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4 text-sm text-gray-500">
                  No users available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-5 sm:px-6">
        <h4 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          {editingUser ? "Edit User" : "Create New User"}
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First Name"
            value={editingUser ? editingUser.firstName : newUser.firstName}
            onChange={(e) =>
              editingUser
                ? setEditingUser({ ...editingUser, firstName: e.target.value })
                : setNewUser({ ...newUser, firstName: e.target.value })
            }
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={editingUser ? editingUser.lastName : newUser.lastName}
            onChange={(e) =>
              editingUser
                ? setEditingUser({ ...editingUser, lastName: e.target.value })
                : setNewUser({ ...newUser, lastName: e.target.value })
            }
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
          <input
            type="email"
            placeholder="Email"
            value={editingUser ? editingUser.email : newUser.email}
            onChange={(e) =>
              editingUser
                ? setEditingUser({ ...editingUser, email: e.target.value })
                : setNewUser({ ...newUser, email: e.target.value })
            }
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
          <input
            type="text"
            placeholder="Phone"
            value={editingUser ? editingUser.phone : newUser.phone}
            onChange={(e) =>
              editingUser
                ? setEditingUser({ ...editingUser, phone: e.target.value })
                : setNewUser({ ...newUser, phone: e.target.value })
            }
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
          <input
            type="date"
            value={editingUser ? editingUser.dob : newUser.dob}
            onChange={(e) =>
              editingUser
                ? setEditingUser({ ...editingUser, dob: e.target.value })
                : setNewUser({ ...newUser, dob: e.target.value })
            }
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
          <select
            value={editingUser ? editingUser.gender : newUser.gender}
            onChange={(e) =>
              editingUser
                ? setEditingUser({ ...editingUser, gender: e.target.value })
                : setNewUser({ ...newUser, gender: e.target.value })
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
            value={editingUser ? editingUser.address : newUser.address}
            onChange={(e) =>
              editingUser
                ? setEditingUser({ ...editingUser, address: e.target.value })
                : setNewUser({ ...newUser, address: e.target.value })
            }
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
          <select
            value={editingUser ? editingUser.role : newUser.role}
            onChange={(e) =>
              editingUser
                ? setEditingUser({ ...editingUser, role: e.target.value })
                : setNewUser({ ...newUser, role: e.target.value })
            }
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          >
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ARTIST_MANAGER">Artist Manager</option>
            <option value="ARTIST">Artist</option>
          </select>
        </div>
        <div className="mt-4">
          {editingUser ? (
            <button
              onClick={handleUpdateUser}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update User
            </button>
          ) : (
            <button
              onClick={handleCreateUser}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create User
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;

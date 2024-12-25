import React, { useState, useEffect } from "react";
import UserForm from "../components/forms/UserEdit";
import axiosClient from "../utils/axios";
import { toast } from "react-toastify";
import Pagination from "../components/Pagination";
const Users = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [pagination, setPagination] = useState({
    totalPages: 1,
    pageSize: 10,
    currentPage: 1,
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.currentPage]);

  const fetchUsers = async () => {
    try {
      const response = await axiosClient.get("/user/list", {
        params: {
          page: pagination.currentPage,
          pageSize: pagination.pageSize,
        },
      });
      setUsers(response.data.dataResponse || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.data.meta.totalPages,
      }));
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Error fetching users");
    }
  };

  const handleUserEdit = (user) => {
    setEditingUser(user);
    setModalOpen(true);
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
      {editingUser && (
        <UserForm user={editingUser} open={modalOpen} setOpen={setModalOpen} />
      )}
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Users</h3>
      </div>
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
                      onClick={() => handleUserEdit(user)}
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

      {/* Pagination Controls */}
      <Pagination
        totalPages={pagination?.totalPages}
      />
    </div>
  );
};

export default Users;

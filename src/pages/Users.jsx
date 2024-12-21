import React, { useState } from 'react';
import UserForm from '../components/forms/User';



const Users = () => {
const [modalOpen, setModalOpen] = useState(false)
const [currentUser, setCurrentUser] = useState(null)
    const [users, setUsers] = useState([
    { id: '1', email: 'admin@example.com', role: 'super_admin' },
    { id: '2', email: 'manager@example.com', role: 'artist_manager' },
    { id: '3', email: 'artist@example.com', role: 'artist' },
  ]);

  const [newUser, setNewUser] = useState({ email: '', role: 'artist' });
  const [editingUser, setEditingUser] = useState(null);


  const handleCreateUser = () => {
    setModalOpen(true)
    const id = Math.random().toString(36).substr(2, 9);
    setUsers([...users, { ...newUser, id }]);
    setNewUser({ email: '', role: 'artist' });
  };

  const handleUpdateUser = () => {
    if (editingUser) {
      setUsers(users.map(user => user.id === editingUser.id ? editingUser : user));
      setEditingUser(null);
    }
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
     
     <UserForm user={currentUser} open={modalOpen} setOpen={setModalOpen} />
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
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => setEditingUser(user)} className="text-indigo-600 hover:text-indigo-900 mr-2">Edit</button>
                  <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-5 sm:px-6">
        <h4 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          {editingUser ? 'Edit User' : 'Create New User'}
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="email"
            placeholder="Email"
            value={editingUser ? editingUser.email : newUser.email}
            onChange={(e) => editingUser ? setEditingUser({...editingUser, email: e.target.value}) : setNewUser({...newUser, email: e.target.value})}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
          <select
            value={editingUser ? editingUser.role : newUser.role}
            // onChange={(e) => editingUser ? setEditingUser({...editingUser, role: e.target.value : setNewUser({...newUser, role: e.target.value as User['role']})}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          >
            <option value="artist">Artist</option>
            <option value="artist_manager">Artist Manager</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
        <div className="mt-4">
          {editingUser ? (
            <button onClick={handleUpdateUser} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Update User
            </button>
          ) : (
            <button onClick={handleCreateUser} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Create User
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from '../utils/axios';
import {  toast } from 'react-toastify';
import { formatToDbDateTime } from "../utils/dataTime";

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    role: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("Value", value);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleRegister = (e) => {
    e.preventDefault();
const formattedData = {
      ...formData,
      dob: formatToDbDateTime(formData.dob), // Format DOB to required format
    };
  

    axiosClient
      .post("/user/register", formattedData)
      .then((response) => {
        console.log("base response",response)
        toast("User register succesfully")
        navigate("/login");
      })
      .catch((err) => {
        setErrorMessage(err?.response?.data?.message || "Registration failed. Please try again.");
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-80">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring"
        />

        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring"
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring"
        >
          <option value="">Select Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring"
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring"
        >
          <option value="">Select Role</option>
          <option value="SUPER_ADMIN">Super Admin</option>
          <option value="ARTIST_MANAGER">Artist Manger</option>
          <option value="ARTIST">Arist</option>
        </select>
        <input
        type="password" // Toggle the input type
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring"
      />
      
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Register
        </button>
        {errorMessage && <span className="pt-2 text-red-500">{errorMessage}</span>}
        <p className="text-center mt-4">
          Already have an account? <a href="/login" className="text-blue-500">Login Here</a>
        </p>
      </form>
    </div>
  );
};

export default RegistrationPage;

import React, { useState } from "react";
import axiosClient from "../utils/axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { register, handleSubmit, watch } = useForm();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Watch email and password fields
  const email = watch("email");
  const password = watch("password");

  const handleLogin = async (data) => {
   await axiosClient
      .post("/auth/login", data)
      .then((response) => {
        localStorage.setItem(
          "user",
          JSON.stringify({
            Id: response.data.dataResponse.id,
            token: response.data.dataResponse.token,
            role: response.data.dataResponse.role,
            firstName: response.data.dataResponse.firstName,
            lastName: response.data.dataResponse.lastName,

          })
        );
        localStorage.setItem("role", response.data.dataResponse.role);
        window.location.replace("/");
      })
      .catch((err) => setErrorMessage(err?.response?.data?.message));
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit(handleLogin)}>
        <div className="bg-white p-6 rounded shadow-md w-80">
          <input
            type="text"
            placeholder="john@company.com"
            {...register("email")}
            className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring"
          />
          <div className="relative w-full mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-sm text-gray-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!email || !password} // Disable if email or password is empty
          >
            Login
          </button>
          <span className="pt-2 text-red-500">{errorMessage}</span>
          <p className="text-center mt-4">
            New Admin?{" "}
            <a href="/register" className="text-blue-500">
              Register Here
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;

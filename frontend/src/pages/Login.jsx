import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { setToken } from "../utils/auth";
import "../App.css";
import logo from "../assets/Stacked_RGB_Purple-Photoroom.png";
import { toast } from "react-toastify";
import { Eye, EyeOff } from 'lucide-react'; // Importing icons from lucide-react
import "../App.css"

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loader
    try {
      const res = await api.post("/auth/login", { email, password });
      setToken(res.data.token);
      setIsLoggedIn(true);
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false); // Stop loader
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 loginhome">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96 form"
      >
        <h2 className="text-2xl text-white font-bold mb-6 flex justify-center items-center gap-2 text-center">
          Sign In
          <img src={logo} alt="" width={30} />
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2 text-gray-700" htmlFor="email"> {/* Added text-gray-700 for label color */}
            Email:
          </label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline line"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-bold mb-2 text-gray-700" htmlFor="password"> {/* Added text-gray-700 for label color */}
            Password:
          </label>
          <div className="relative"> {/* Added relative positioning for the toggle button */}
            <input
              type={passwordVisible ? "text" : "password"} // Dynamically change type based on state
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 pr-10 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline line" // Added pr-10 for button spacing
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* Show/Hide Password Toggle Button */}
            <button
              type="button" // Important: Prevents form submission when clicked
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-black hover:text-gray-700 focus:outline-none eye"
              aria-label={passwordVisible ? "Hide password" : "Show password"}
            >
              {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`bg-violet-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full log-btn ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              Signing in...
            </span>
          ) : (
            "Sign in"
          )}
        </button>

        <div className="mt-4 text-center">
          <Link to="/register" className="text-white hover:underline">
            Don't have an account? Sign Up
          </Link>
        </div>
        <div className="mt-2 text-center">
          <Link to="/forgot-password" className="text-white hover:underline">
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;

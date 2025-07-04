import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import logo from "../assets/Stacked_RGB_Purple-Photoroom.png";
import { toast } from "react-toastify";
import { Eye, EyeOff } from 'lucide-react'; // Importing icons from lucide-react
import "../App.css"

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); 

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Optional: email format check
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Strong password check
    const isStrongPassword = (password) => {
      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
      return regex.test(password);
    };

    // Validate email format
    if (!isValidEmail(email)) {
      const msg = "Invalid email format";
      setError(msg);
      setSuccess("");
      toast.error(msg);
      setLoading(false);
      return;
    }

    // Validate strong password
    if (!isStrongPassword(password)) {
      const msg =
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.";
      setError(msg);
      setSuccess("");
      toast.error(msg);
      setLoading(false);
      return;
    }

    try {
      await api.post("/auth/register", { username, email, password });
      setSuccess("Registration successful! Please login.");
      setError("");
      toast.success("Registration successful! Please login.");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Registration failed";
      setError(errorMsg);
      setSuccess("");
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 loginhome">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96 form"
      >
        <h2 className="text-2xl text-white font-bold mb-6 flex  justify-center items-center gap-2 text-center">
          Sign Up
          <img src={logo} alt="" width={30} />
        </h2>
        {/* {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mb-4">{success}</p>
        )} */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username:
          </label>
          <input
            type="text"
            id="username"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline line"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
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
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password:
          </label>
          <input
            type={passwordVisible ? "text" : "password"} // Dynamically change type based on state
            id="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline line"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
           <button
              type="button" // Important: Prevents form submission when clicked
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute inset-y-0 right-0 flex items-center text-black hover:text-gray-700 focus:outline-none eye2"
              aria-label={passwordVisible ? "Hide password" : "Show password"}
            >
              {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`bg-violet-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full log-btn ${
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
              Signing up...
            </span>
          ) : (
            "Sign Up"
          )}
        </button>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-white hover:underline">
            Already have an account? Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;

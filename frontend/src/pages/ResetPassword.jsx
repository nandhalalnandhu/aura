import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import "../App.css"

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const res = await api.put(`/auth/reset-password/${token}`, { password });
            setMessage(res.data.message);
            setError('');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Password reset failed');
            setMessage('');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100 loginhome">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96 form">
                <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
                {message && <p className="text-green-500 text-center mb-4">{message}</p>}
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <div className="mb-4">
                    <label className="block  text-sm font-bold mb-2" htmlFor="password">
                        New Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline line"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block  text-sm font-bold mb-2" htmlFor="confirmPassword">
                        Confirm New Password:
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline line"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-violet-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full log-btn"
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;

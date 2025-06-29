import React from 'react';
import { Link } from 'react-router-dom';
import { getToken } from '../utils/auth'; // Assuming you have this utility
import "../App.css"

const Home = () => {
    const isAuthenticated = getToken();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 home">
            <h1 className="text-5xl font-extrabold text-white mb-6 animate-fade-in-down">
                Welcome to Your Document Workspace
            </h1>
            <p className="text-xl text-white mb-8 max-w-2xl text-center">
                Create, organize, and collaborate on documents with ease.
            </p>

            {isAuthenticated ? (
                <div className="space-x-4">
                    <Link
                        to="/documents"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Go to My Documents
                    </Link>
                    <Link
                        to="/documents/new"
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Create New Document
                    </Link>
                </div>
            ) : (
                <div className="space-x-4">
                    <Link
                        to="/login"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Register
                    </Link>
                </div>
            )}

            <style>{`
                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-down {
                    animation: fadeInDown 1s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Home;
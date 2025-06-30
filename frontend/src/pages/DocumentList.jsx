import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { HashLoader } from 'react-spinners';
import "../App.css";
import { FaSearch } from "react-icons/fa";

const DocumentList = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchDocuments = async (query = '') => {
        setLoading(true);
        try {
            const endpoint = query ? `/documents/search?query=${query}` : '/documents';
            const res = await api.get(endpoint);
            setDocuments(res.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch documents');
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchDocuments();
    }, []);

    // Debounced auto search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchDocuments(searchTerm);
        }, 400);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    return (
        <div className="mt-8 p-4">
            <h1 className="text-3xl font-bold mb-6">Your Documents</h1>
            <div className="flex justify-between items-center mb-6">
                <Link to="/documents/new" className="bg-violet-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Create New Document
                </Link>

                <div className="flex items-center border border-gray-300 rounded">
                    <input
                        type="text"
                        placeholder="Search documents..."
                        className="py-2 px-3 w-64 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="px-2 text-gray-500">
                        <FaSearch />
                    </span>
                </div>
            </div>

            {loading ? (
                <div className="text-center mt-8 loader">
                    <HashLoader color="rgb(145,70,255)" size={50} />
                </div>
            ) : error ? (
                <div className="text-center mt-8 text-red-500">{error}</div>
            ) : documents.length === 0 ? (
                <p className="text-center text-gray-600">No documents found. Start by creating one!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documents.map((doc) => (
                        <div key={doc._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <Link to={`/documents/${doc._id}`} className="text-xl font-semibold text-blue-600 hover:underline">
                                {doc.title}
                            </Link>
                            <p className="text-gray-600 text-sm mt-2">
                                Author: {doc.author?.username || 'N/A'}
                            </p>
                            <p className="text-gray-600 text-sm">
                                Last Modified: {new Date(doc.updatedAt).toLocaleString()}
                            </p>
                            <p className="text-gray-600 text-sm">
                                Visibility: <span className={`font-medium ${doc.visibility === 'public' ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {doc.visibility}
                                </span>
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DocumentList;

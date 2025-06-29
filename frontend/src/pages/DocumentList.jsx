import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

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

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchDocuments(searchTerm);
    };

    if (loading) return <div className="text-center mt-8">Loading documents...</div>;
    if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

    return (
        <div className="mt-8 p-4 ">
            <h1 className="text-3xl font-bold mb-6">Your Documents</h1>
            <div className="flex justify-between items-center mb-6">
                <Link to="/documents/new" className="bg-violet-500 round hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Create New Document
                </Link>
                <form onSubmit={handleSearch} className="flex">
                    <input
                        type="text"
                        placeholder="Search documents..."
                        className="border rounded-1 py-2 px-3 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="bg-blue-600 text-white hover:bg-gray-300 py-2 px-4 rounded-r">
                        Search
                    </button>
                </form>
            </div>
            {documents.length === 0 ? (
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
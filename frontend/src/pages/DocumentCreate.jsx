import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const DocumentCreate = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [visibility, setVisibility] = useState('private');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false); // New state for AI generation loading
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/documents', { title, content, visibility });
            navigate(`/documents/${res.data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create document');
        } finally {
            setLoading(false);
        }
    };

    // NEW FUNCTION: Handle AI content generation
    const handleGenerateContent = async () => {
        if (!title.trim()) {
            setError('Please enter a title before generating content.');
            return;
        }

        setAiLoading(true);
        setError('');
        try {
            // Call the new backend AI endpoint
            const res = await api.post('/ai/generate-content', { title });
            // Set the generated content to the ReactQuill editor
            setContent(res.data.content);
        } catch (err) {
            console.error('Error fetching AI content:', err);
            setError(err.response?.data?.message || 'Failed to generate AI content. Try again.');
        } finally {
            setAiLoading(false);
        }
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent', 'link', 'image'
    ];

    return (
        <div className="mt-8 p-6">
            <h1 className="text-3xl font-bold mb-6">Create New Document</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                        Title:
                    </label>
                    <input
                        type="text"
                        id="title"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Content:
                    </label>
                    {/* NEW BUTTON FOR AI GENERATION */}
                    <button
                        type="button" // Important: type="button" to prevent form submission
                        onClick={handleGenerateContent}
                        className="bg-green-500 hover:bg-green-700 text-white text-sm py-1 px-3 rounded mb-2 focus:outline-none focus:shadow-outline"
                        disabled={aiLoading || !title.trim()} // Disable if loading or no title
                    >
                        {aiLoading ? 'Generating...' : 'Generate AI Content'}
                    </button>
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        formats={formats}
                        className="h-64 mb-12"
                    />
                </div>
                <div className="mb-6 mt-12">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="visibility">
                        Visibility:
                    </label>
                    <select
                        id="visibility"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                    >
                        <option value="private">Private (Only me)</option>
                        <option value="shared">Shared (Specific users)</option>
                        <option value="public">Public (Anyone can view)</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create Document'}
                </button>
            </form>
        </div>
    );
};

export default DocumentCreate;
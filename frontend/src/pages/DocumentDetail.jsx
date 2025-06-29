import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../api/axios";
import { debounce } from "lodash"; // npm install lodash

const DocumentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false); // For auto-save indicator

  const fetchDocument = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/documents/${id}`);
      setDocument(res.data);
      setTitle(res.data.title);
      setContent(res.data.content);
      setVisibility(res.data.visibility);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch document");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocument();
  }, [id]);

  // Debounced auto-save function
  const autoSave = useCallback(
    debounce(async (newTitle, newContent, newVisibility) => {
      setIsSaving(true);
      try {
        await api.put(`/documents/${id}`, {
          title: newTitle,
          content: newContent,
          visibility: newVisibility,
        });
        // console.log('Document auto-saved!');
      } catch (err) {
        console.error("Auto-save failed:", err);
        setError(err.response?.data?.message || "Auto-save failed");
      } finally {
        setIsSaving(false);
      }
    }, 1500), // Auto-save after 1.5 seconds of no activity
    [id]
  );

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    autoSave(newTitle, content, visibility);
  };

  const handleContentChange = (newContent) => {
    setContent(newContent);
    autoSave(title, newContent, visibility);
  };

  const handleVisibilityChange = (e) => {
    const newVisibility = e.target.value;
    setVisibility(newVisibility);
    autoSave(title, content, newVisibility);
  };

  const Done = () => {
    navigate("/documents");
    window.location.reload(); // To trigger App.jsx re-render and remove Navbar
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await api.delete(`/documents/${id}`);
        navigate("/documents"); // Redirect to document list
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete document");
      }
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  if (loading)
    return <div className="text-center mt-8">Loading document...</div>;
  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!document)
    return (
      <div className="text-center mt-8 text-gray-600">
        Document not found or access denied.
      </div>
    );

  return (
    <div className="mt-8 p-4 bg-white p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          className="text-3xl font-bold border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full"
          value={title}
          onChange={handleTitleChange}
        />
        <div className="ml-4 flex space-x-2">
          <select
            className="border rounded py-2 px-3 text-gray-700"
            value={visibility}
            onChange={handleVisibilityChange}
          >
            <option value="private">Private</option>
            <option value="shared">Shared</option>
            <option value="public">Public</option>
          </select>
          <button
            className="bg-green-700 hover:bg-black-700 text-white font-bold py-2 px-4 rounded"
            onClick={Done}
          >
            Done
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete
          </button>
        </div>
      </div>

      {isSaving && <p className="text-sm text-gray-500 mb-2">Saving...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4">
        <ReactQuill
          theme="snow"
          value={content}
          onChange={handleContentChange}
          modules={modules}
          formats={formats}
          className="h-96"
        />
      </div>
      <div className="mt-16 text-gray-600 text-sm">
        <p>Author: {document.author?.username}</p>
        <p>Last Modified By: {document.lastModifiedBy?.username || "N/A"}</p>
        <p>Created At: {new Date(document.createdAt).toLocaleString()}</p>
        <p>Last Updated At: {new Date(document.updatedAt).toLocaleString()}</p>
        {document.sharedWith.length > 0 && (
          <p>
            Shared With:{" "}
            {document.sharedWith.map((user) => user.username).join(", ")}
          </p>
        )}
      </div>
    </div>
  );
};

export default DocumentDetail;

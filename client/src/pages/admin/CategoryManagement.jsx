import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { assets } from '../../assets/assets';

const CategoryManagement = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        text: '',
        path: '',
        image: '',
        bgColor: '#F5F5F5',
        description: '',
    });

    useEffect(() => {
        checkAuth();
        fetchCategories();
    }, []);

    const checkAuth = () => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/admin/login');
            return;
        }
        const parsedUser = JSON.parse(userData);
        if (!parsedUser.isAdmin) {
            navigate('/');
        }
    };

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/categories');
            if (data.success) {
                setCategories(data.categories);
            }
        } catch (error) {
            toast.error('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingCategory) {
                const { data } = await api.put(`/categories/${editingCategory._id}`, formData);
                if (data.success) {
                    toast.success('Category updated successfully');
                    fetchCategories();
                    resetForm();
                }
            } else {
                const { data } = await api.post('/categories', formData);
                if (data.success) {
                    toast.success('Category created successfully');
                    fetchCategories();
                    resetForm();
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            text: category.text,
            path: category.path,
            image: category.image,
            bgColor: category.bgColor,
            description: category.description || '',
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            const { data } = await api.delete(`/categories/${id}`);
            if (data.success) {
                toast.success('Category deleted successfully');
                fetchCategories();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Delete failed');
        }
    };

    const resetForm = () => {
        setFormData({
            text: '',
            path: '',
            image: '',
            bgColor: '#F5F5F5',
            description: '',
        });
        setEditingCategory(null);
        setShowForm(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button onClick={() => navigate('/admin/dashboard')} className="text-gray-600 hover:text-gray-800">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
                        </div>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
                        >
                            {showForm ? 'Cancel' : '+ Add Category'}
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Form */}
                {showForm && (
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">
                            {editingCategory ? 'Edit Category' : 'Add New Category'}
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                                <input
                                    type="text"
                                    name="text"
                                    value={formData.text}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="e.g., Organic Veggies"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">URL Path</label>
                                <input
                                    type="text"
                                    name="path"
                                    value={formData.path}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="e.g., Vegetables"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="https://example.com/image.png"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        name="bgColor"
                                        value={formData.bgColor}
                                        onChange={handleChange}
                                        className="h-12 w-20 border border-gray-300 rounded-lg cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        name="bgColor"
                                        value={formData.bgColor}
                                        onChange={handleChange}
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        placeholder="#F5F5F5"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="Brief description of the category"
                                />
                            </div>

                            <div className="md:col-span-2 flex gap-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition"
                                >
                                    {editingCategory ? 'Update Category' : 'Create Category'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-8 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Categories List */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">All Categories</h2>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="mt-4 text-gray-600">Loading categories...</p>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600">No categories found. Add your first category!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categories.map((category) => (
                                <div
                                    key={category._id}
                                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition"
                                >
                                    <div
                                        className="h-32 flex items-center justify-center"
                                        style={{ backgroundColor: category.bgColor }}
                                    >
                                        <img
                                            src={category.image}
                                            alt={category.text}
                                            className="h-24 w-24 object-contain"
                                            onError={(e) => {
                                                e.target.src = assets.upload_area;
                                            }}
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-800 text-lg mb-1">{category.text}</h3>
                                        <p className="text-sm text-gray-600 mb-2">Path: /{category.path}</p>
                                        {category.description && (
                                            <p className="text-sm text-gray-500 mb-4">{category.description}</p>
                                        )}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(category)}
                                                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category._id)}
                                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CategoryManagement;

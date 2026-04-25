import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { assets } from '../../assets/assets';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/admin/login');
            return;
        }
        const parsedUser = JSON.parse(userData);
        if (!parsedUser.isAdmin) {
            navigate('/');
            return;
        }
        setUser(parsedUser);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/admin/login');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src={assets.logo} alt="Logo" className="h-10" />
                            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-600">Welcome, {user.name}</span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Categories Card */}
                    <Link
                        to="/admin/categories"
                        className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition group"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                                <svg
                                    className="w-8 h-8 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition">
                                    Manage Categories
                                </h2>
                                <p className="text-gray-600">Add, edit, or delete product categories</p>
                            </div>
                        </div>
                        <div className="flex items-center text-blue-600 font-semibold">
                            Go to Categories
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>

                    {/* Products Card */}
                    <Link
                        to="/admin/products"
                        className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition group"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                                <svg
                                    className="w-8 h-8 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 group-hover:text-green-600 transition">
                                    Manage Products
                                </h2>
                                <p className="text-gray-600">Add, edit, or delete products</p>
                            </div>
                        </div>
                        <div className="flex items-center text-green-600 font-semibold">
                            Go to Products
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>
                </div>

                {/* Quick Stats */}
                <div className="mt-12">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <button
                            onClick={() => navigate('/admin/categories')}
                            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-left"
                        >
                            <div className="text-blue-600 font-semibold mb-1">Add Category</div>
                            <div className="text-gray-600 text-sm">Create a new category</div>
                        </button>
                        <button
                            onClick={() => navigate('/admin/products')}
                            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-left"
                        >
                            <div className="text-green-600 font-semibold mb-1">Add Product</div>
                            <div className="text-gray-600 text-sm">Create a new product</div>
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-left"
                        >
                            <div className="text-purple-600 font-semibold mb-1">View Store</div>
                            <div className="text-gray-600 text-sm">See customer view</div>
                        </button>
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-left"
                        >
                            <div className="text-orange-600 font-semibold mb-1">Browse Products</div>
                            <div className="text-gray-600 text-sm">View all products</div>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;

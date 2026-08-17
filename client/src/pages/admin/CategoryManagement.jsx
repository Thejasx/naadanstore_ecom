import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { assets } from '../../assets/assets';

const CategoryManagement = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [formData, setFormData] = useState({
        text: '',
        path: '',
        image: '',
        bgColor: '#E8F5E9',
        description: '',
    });

    useEffect(() => {
        checkAuth();
        fetchCategories();
    }, []);

    const checkAuth = () => {
        const userData = localStorage.getItem('user');
        if (!userData) { navigate('/admin/login'); return; }
        const parsedUser = JSON.parse(userData);
        if (!parsedUser.isAdmin) navigate('/');
    };

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/categories');
            if (data.success) {
                setCategories(data.categories);
            }
        } catch (error) {
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
            bgColor: category.bgColor || '#E8F5E9',
            description: category.description || '',
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        try {
            const { data } = await api.delete(`/categories/${id}`);
            if (data.success) {
                toast.success('Category deleted');
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
            bgColor: '#E8F5E9',
            description: '',
        });
        setEditingCategory(null);
        setShowForm(false);
    };

    const navItems = [
        { label: 'Dashboard', icon: HomeIcon, path: '/admin/dashboard' },
        { label: 'Categories', icon: GridIcon, path: '/admin/categories', active: true },
        { label: 'Products', icon: BoxIcon, path: '/admin/products' },
        { label: 'View Storefront', icon: StoreIcon, path: '/' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex">
            {/* Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <Link to="/admin/dashboard" className="flex items-center gap-3">
                        <img src={assets.logo} alt="Logo" className="h-8 object-contain" />
                    </Link>
                    <button className="lg:hidden text-slate-400" onClick={() => setSidebarOpen(false)}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                    <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Management</div>
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${item.active
                                ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${item.active ? 'text-emerald-600' : 'text-slate-400'}`} />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <h1 className="text-lg font-bold text-slate-800">Category Management</h1>
                    </div>
                    <button
                        onClick={() => { if (showForm) resetForm(); else setShowForm(true); }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                        {showForm ? 'Close Form' : '+ Add Category'}
                    </button>
                </header>

                <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
                    {/* Add / Edit Form */}
                    {showForm && (
                        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-md transition-all">
                            <h2 className="text-xl font-extrabold text-slate-900 mb-6">
                                {editingCategory ? 'Edit Category' : 'Create New Category'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Category Name</label>
                                        <input
                                            type="text" name="text" value={formData.text} onChange={handleChange} required
                                            placeholder="e.g. Fresh Vegetables"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">URL Slug Path</label>
                                        <input
                                            type="text" name="path" value={formData.path} onChange={handleChange} required
                                            placeholder="e.g. vegetables"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Image URL</label>
                                        <input
                                            type="url" name="image" value={formData.image} onChange={handleChange} required
                                            placeholder="https://images.unsplash.com/..."
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Card Background Tint</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color" name="bgColor" value={formData.bgColor} onChange={handleChange}
                                                className="w-12 h-11 p-1 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                                            />
                                            <input
                                                type="text" name="bgColor" value={formData.bgColor} onChange={handleChange}
                                                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
                                            />
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Description</label>
                                        <textarea
                                            name="description" rows="2" value={formData.description} onChange={handleChange}
                                            placeholder="Brief description of the category..."
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button type="submit" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer">
                                        {editingCategory ? 'Save Category Changes' : 'Create Category'}
                                    </button>
                                    <button type="button" onClick={resetForm} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Category Cards List */}
                    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-900">All Categories</h3>
                                <p className="text-slate-500 text-xs mt-0.5">Showing total {categories.length} departments</p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-16 text-slate-400 font-medium text-sm">
                                Loading store categories...
                            </div>
                        ) : categories.length === 0 ? (
                            <div className="text-center py-16 text-slate-400 font-medium text-sm">
                                No categories found. Click "+ Add Category" above to create your first category.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {categories.map((category) => (
                                    <div
                                        key={category._id}
                                        className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:shadow-md transition-all group flex flex-col justify-between"
                                    >
                                        <div
                                            className="h-32 flex items-center justify-center p-4"
                                            style={{ backgroundColor: category.bgColor || '#F8FAFC' }}
                                        >
                                            <img
                                                src={category.image}
                                                alt={category.text}
                                                className="h-20 w-20 object-contain group-hover:scale-110 transition-transform duration-300"
                                                onError={(e) => { e.target.src = assets.upload_area; }}
                                            />
                                        </div>
                                        <div className="p-4 flex-1 flex flex-col justify-between">
                                            <div>
                                                <h4 className="font-extrabold text-slate-900 text-base mb-1">{category.text}</h4>
                                                <p className="text-xs font-semibold text-emerald-600 mb-2">Path: /{category.path}</p>
                                                {category.description && (
                                                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">{category.description}</p>
                                                )}
                                            </div>
                                            <div className="flex gap-2 pt-3 border-t border-slate-100">
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category._id)}
                                                    className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
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
        </div>
    );
};

const HomeIcon = (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const GridIcon = (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const BoxIcon = (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const StoreIcon = (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" /></svg>;

export default CategoryManagement;

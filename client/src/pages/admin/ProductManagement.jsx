import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';

const ProductManagement = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [filterCategory, setFilterCategory] = useState('all');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { currency } = useAppContext();

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        offerPrice: '',
        image: [''],
        description: [''],
        inStock: true,
    });

    useEffect(() => {
        checkAuth();
        fetchCategories();
        fetchProducts();
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
            if (data.success) setCategories(data.categories);
        } catch (error) {
            toast.error('Failed to load categories');
        }
    };

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            if (data.success) setProducts(data.products);
        } catch (error) {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleImageChange = (index, value) => {
        const newImages = [...formData.image];
        newImages[index] = value;
        setFormData({ ...formData, image: newImages });
    };

    const addImageField = () => setFormData({ ...formData, image: [...formData.image, ''] });
    const removeImageField = (index) => setFormData({ ...formData, image: formData.image.filter((_, i) => i !== index) });

    const handleDescriptionChange = (index, value) => {
        const newDesc = [...formData.description];
        newDesc[index] = value;
        setFormData({ ...formData, description: newDesc });
    };

    const addDescriptionField = () => setFormData({ ...formData, description: [...formData.description, ''] });
    const removeDescriptionField = (index) => setFormData({ ...formData, description: formData.description.filter((_, i) => i !== index) });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const cleanedData = {
            ...formData,
            image: formData.image.filter((img) => img.trim() !== ''),
            description: formData.description.filter((desc) => desc.trim() !== ''),
            price: parseFloat(formData.price),
            offerPrice: parseFloat(formData.offerPrice),
        };

        if (cleanedData.image.length === 0) {
            toast.error('Please add at least one product image URL');
            return;
        }

        try {
            if (editingProduct) {
                const { data } = await api.put(`/products/${editingProduct._id}`, cleanedData);
                if (data.success) {
                    toast.success('Product updated successfully');
                    fetchProducts();
                    resetForm();
                }
            } else {
                const { data } = await api.post('/products', cleanedData);
                if (data.success) {
                    toast.success('Product created successfully');
                    fetchProducts();
                    resetForm();
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price.toString(),
            offerPrice: product.offerPrice.toString(),
            image: product.image.length > 0 ? product.image : [''],
            description: product.description.length > 0 ? product.description : [''],
            inStock: product.inStock,
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            const { data } = await api.delete(`/products/${id}`);
            if (data.success) {
                toast.success('Product deleted');
                fetchProducts();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Delete failed');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            category: '',
            price: '',
            offerPrice: '',
            image: [''],
            description: [''],
            inStock: true,
        });
        setEditingProduct(null);
        setShowForm(false);
    };

    const filteredProducts = filterCategory === 'all'
        ? products
        : products.filter((p) => p.category === filterCategory);

    const navItems = [
        { label: 'Dashboard', icon: HomeIcon, path: '/admin/dashboard' },
        { label: 'Categories', icon: GridIcon, path: '/admin/categories' },
        { label: 'Products', icon: BoxIcon, path: '/admin/products', active: true },
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

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <h1 className="text-lg font-bold text-slate-800">Product Management</h1>
                    </div>
                    <button
                        onClick={() => { if (showForm) resetForm(); else setShowForm(true); }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                        {showForm ? 'Close Form' : '+ Add Product'}
                    </button>
                </header>

                <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
                    {/* Add/Edit Product Form */}
                    {showForm && (
                        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-md transition-all">
                            <h2 className="text-xl font-extrabold text-slate-900 mb-6">
                                {editingProduct ? 'Edit Product Item' : 'Add New Product'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Product Title</label>
                                        <input
                                            type="text" name="name" value={formData.name} onChange={handleChange} required
                                            placeholder="e.g. Fresh Red Tomatoes (1kg)"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Category</label>
                                        <select
                                            name="category" value={formData.category} onChange={handleChange} required
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
                                        >
                                            <option value="">Select Department</option>
                                            {categories.map((cat) => (
                                                <option key={cat._id} value={cat.path}>{cat.text}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Original MRP ({currency})</label>
                                        <input
                                            type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01"
                                            placeholder="60.00"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Selling Offer Price ({currency})</label>
                                        <input
                                            type="number" name="offerPrice" value={formData.offerPrice} onChange={handleChange} required min="0" step="0.01"
                                            placeholder="45.00"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
                                        />
                                    </div>

                                    {/* Image URLs */}
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Image URLs</label>
                                        {formData.image.map((img, i) => (
                                            <div key={i} className="flex gap-2 mb-2">
                                                <input
                                                    type="url" value={img} onChange={(e) => handleImageChange(i, e.target.value)}
                                                    placeholder="https://images.unsplash.com/..."
                                                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                                />
                                                {formData.image.length > 1 && (
                                                    <button type="button" onClick={() => removeImageField(i)} className="px-3 py-2 bg-rose-50 text-rose-700 font-bold text-xs rounded-xl hover:bg-rose-100">
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button type="button" onClick={addImageField} className="mt-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 cursor-pointer">
                                            + Add Image Field
                                        </button>
                                    </div>

                                    {/* Bullet Description Points */}
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Product Features (Bullet Points)</label>
                                        {formData.description.map((desc, i) => (
                                            <div key={i} className="flex gap-2 mb-2">
                                                <input
                                                    type="text" value={desc} onChange={(e) => handleDescriptionChange(i, e.target.value)}
                                                    placeholder="e.g. 100% Organic certified"
                                                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                                />
                                                {formData.description.length > 1 && (
                                                    <button type="button" onClick={() => removeDescriptionField(i)} className="px-3 py-2 bg-rose-50 text-rose-700 font-bold text-xs rounded-xl hover:bg-rose-100">
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button type="button" onClick={addDescriptionField} className="mt-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 cursor-pointer">
                                            + Add Bullet Point
                                        </button>
                                    </div>

                                    {/* In Stock toggle */}
                                    <div className="sm:col-span-2 flex items-center gap-3">
                                        <input
                                            type="checkbox" id="inStock" name="inStock"
                                            checked={formData.inStock} onChange={handleChange}
                                            className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                                        />
                                        <label htmlFor="inStock" className="text-xs font-bold text-slate-700 cursor-pointer">
                                            Product Available & In Stock
                                        </label>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button type="submit" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer">
                                        {editingProduct ? 'Save Product Changes' : 'Publish Product'}
                                    </button>
                                    <button type="button" onClick={resetForm} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Filter & Product List */}
                    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-900">Product Inventory</h3>
                                <p className="text-slate-500 text-xs mt-0.5">Showing {filteredProducts.length} items</p>
                            </div>
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            >
                                <option value="all">All Departments</option>
                                {categories.map((c) => (
                                    <option key={c._id} value={c.path}>{c.text}</option>
                                ))}
                            </select>
                        </div>

                        {loading ? (
                            <div className="text-center py-16 text-slate-400 font-medium text-sm">
                                Loading catalog items...
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-16 text-slate-400 font-medium text-sm">
                                No products found in this category. Click "+ Add Product" to add items.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredProducts.map((p) => (
                                    <div
                                        key={p._id}
                                        className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:shadow-md transition-all group flex flex-col justify-between"
                                    >
                                        <div className="h-44 bg-slate-50 relative flex items-center justify-center p-4">
                                            <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                                }`}>
                                                {p.inStock ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                            <img
                                                src={p.image[0]}
                                                alt={p.name}
                                                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => { e.target.src = assets.upload_area; }}
                                            />
                                        </div>

                                        <div className="p-4 flex-1 flex flex-col justify-between">
                                            <div>
                                                <span className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">{p.category}</span>
                                                <h4 className="font-extrabold text-slate-900 text-sm line-clamp-2 mt-0.5 mb-2 leading-snug">{p.name}</h4>
                                                <div className="flex items-baseline gap-2 mb-4">
                                                    <span className="text-base font-black text-slate-900">{currency}{p.offerPrice}</span>
                                                    {p.price > p.offerPrice && (
                                                        <span className="text-xs text-slate-400 line-through font-semibold">{currency}{p.price}</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex gap-2 pt-3 border-t border-slate-100">
                                                <button
                                                    onClick={() => handleEdit(p)}
                                                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p._id)}
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

export default ProductManagement;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { assets } from '../../assets/assets';

const ProductManagement = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [filterCategory, setFilterCategory] = useState('all');
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
        }
    };

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            if (data.success) {
                setProducts(data.products);
            }
        } catch (error) {
            toast.error('Failed to fetch products');
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

    const addImageField = () => {
        setFormData({ ...formData, image: [...formData.image, ''] });
    };

    const removeImageField = (index) => {
        const newImages = formData.image.filter((_, i) => i !== index);
        setFormData({ ...formData, image: newImages });
    };

    const handleDescriptionChange = (index, value) => {
        const newDesc = [...formData.description];
        newDesc[index] = value;
        setFormData({ ...formData, description: newDesc });
    };

    const addDescriptionField = () => {
        setFormData({ ...formData, description: [...formData.description, ''] });
    };

    const removeDescriptionField = (index) => {
        const newDesc = formData.description.filter((_, i) => i !== index);
        setFormData({ ...formData, description: newDesc });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Filter out empty images and descriptions
        const cleanedData = {
            ...formData,
            image: formData.image.filter((img) => img.trim() !== ''),
            description: formData.description.filter((desc) => desc.trim() !== ''),
            price: parseFloat(formData.price),
            offerPrice: parseFloat(formData.offerPrice),
        };

        if (cleanedData.image.length === 0) {
            toast.error('Please add at least one image');
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
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const { data } = await api.delete(`/products/${id}`);
            if (data.success) {
                toast.success('Product deleted successfully');
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

    const filteredProducts =
        filterCategory === 'all'
            ? products
            : products.filter((product) => product.category === filterCategory);

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
                            <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
                        </div>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition"
                        >
                            {showForm ? 'Cancel' : '+ Add Product'}
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Form */}
                {showForm && (
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">
                            {editingProduct ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                        placeholder="e.g., Fresh Tomatoes 1kg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat._id} value={cat.path}>
                                                {cat.text}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Offer Price</label>
                                    <input
                                        type="number"
                                        name="offerPrice"
                                        value={formData.offerPrice}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            {/* Images */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                                {formData.image.map((img, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input
                                            type="url"
                                            value={img}
                                            onChange={(e) => handleImageChange(index, e.target.value)}
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                            placeholder="https://example.com/image.png"
                                        />
                                        {formData.image.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeImageField(index)}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addImageField}
                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                                >
                                    + Add Image
                                </button>
                            </div>

                            {/* Descriptions */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description Points</label>
                                {formData.description.map((desc, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={desc}
                                            onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                            placeholder="e.g., Fresh and organic"
                                        />
                                        {formData.description.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeDescriptionField(index)}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addDescriptionField}
                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                                >
                                    + Add Description
                                </button>
                            </div>

                            {/* In Stock */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="inStock"
                                    name="inStock"
                                    checked={formData.inStock}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                                />
                                <label htmlFor="inStock" className="text-sm font-medium text-gray-700">
                                    In Stock
                                </label>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition"
                                >
                                    {editingProduct ? 'Update Product' : 'Create Product'}
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

                {/* Products List */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">All Products</h2>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        >
                            <option value="all">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat.path}>
                                    {cat.text}
                                </option>
                            ))}
                        </select>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                            <p className="mt-4 text-gray-600">Loading products...</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600">No products found. Add your first product!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product._id}
                                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition"
                                >
                                    <div className="h-48 bg-gray-100 flex items-center justify-center">
                                        <img
                                            src={product.image[0]}
                                            alt={product.name}
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                e.target.src = assets.upload_area;
                                            }}
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-800 text-lg mb-1">{product.name}</h3>
                                        <p className="text-sm text-gray-600 mb-2">Category: {product.category}</p>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-lg font-bold text-green-600">${product.offerPrice}</span>
                                            <span className="text-sm text-gray-500 line-through">${product.price}</span>
                                        </div>
                                        <div className="mb-4">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${product.inStock
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id)}
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

export default ProductManagement;

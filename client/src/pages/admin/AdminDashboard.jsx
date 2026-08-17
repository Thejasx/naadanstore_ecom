import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { products, categories } = useAppContext();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) { navigate('/admin/login'); return; }
        const parsedUser = JSON.parse(userData);
        if (!parsedUser.isAdmin) { navigate('/'); return; }
        setUser(parsedUser);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/admin/login');
    };

    if (!user) return null;

    const navItems = [
        { label: 'Dashboard', icon: HomeIcon, path: '/admin/dashboard', active: true },
        { label: 'Categories', icon: GridIcon, path: '/admin/categories' },
        { label: 'Products', icon: BoxIcon, path: '/admin/products' },
        { label: 'Customer Orders', icon: TruckIcon, path: '/admin/orders' },
        { label: 'Offers & Coupons', icon: TicketIcon, path: '/admin/coupons' },
        { label: 'View Storefront', icon: StoreIcon, path: '/' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex">
            {/* Mobile Sidebar Backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar Navigation */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                {/* Brand Logo Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <Link to="/admin/dashboard" className="flex items-center gap-3">
                        <img src={assets.logo} alt="Logo" className="h-8 object-contain" />
                    </Link>
                    <button className="lg:hidden text-slate-400 hover:text-slate-600" onClick={() => setSidebarOpen(false)}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                    <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Management
                    </div>
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

                {/* User Info / Logout */}
                <div className="p-4 border-t border-slate-100">
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-9 h-9 bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                                {user.name?.charAt(0)?.toUpperCase() || 'A'}
                            </div>
                            <div className="truncate">
                                <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                                <p className="text-[10px] font-medium text-emerald-600 uppercase tracking-wider">Admin</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 text-rose-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="text-lg font-bold text-slate-800">Overview</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200/60 text-emerald-700 rounded-full text-xs font-semibold">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Backend Connected
                        </span>
                        <Link
                            to="/"
                            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                        >
                            Visit Shop →
                        </Link>
                    </div>
                </header>

                {/* Dashboard Body */}
                <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
                    {/* Welcome Banner */}
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-600/15 relative overflow-hidden">
                        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="relative z-10 max-w-xl">
                            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
                                Dashboard Overview
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                Welcome back, {user.name?.split(' ')[0]}! 👋
                            </h2>
                            <p className="text-emerald-100 text-sm mt-2 leading-relaxed">
                                Manage customer orders, shipping status, product inventory, and promo deals from this unified e-commerce control panel.
                            </p>
                        </div>
                    </div>

                    {/* Key E-commerce Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Products</span>
                                <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                                    <BoxIcon className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-3xl font-black text-slate-900">{products?.length || 0}</p>
                            <span className="text-xs font-semibold text-emerald-600 inline-flex items-center gap-1 mt-1">
                                Catalog Items Listed
                            </span>
                        </div>

                        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Categories</span>
                                <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                                    <GridIcon className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-3xl font-black text-slate-900">{categories?.length || 0}</p>
                            <span className="text-xs font-semibold text-indigo-600 inline-flex items-center gap-1 mt-1">
                                Store Departments
                            </span>
                        </div>

                        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Orders</span>
                                <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                                    <TruckIcon className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-3xl font-black text-slate-900">Manage</p>
                            <span className="text-xs font-semibold text-blue-600 inline-flex items-center gap-1 mt-1">
                                Shipping & Status Updates
                            </span>
                        </div>

                        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Offers & Deals</span>
                                <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                                    <TicketIcon className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-3xl font-black text-slate-900">Active</p>
                            <span className="text-xs font-semibold text-amber-600 inline-flex items-center gap-1 mt-1">
                                Promos Enabled
                            </span>
                        </div>
                    </div>

                    {/* Quick Access Management Cards */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Management</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
                            {/* Orders Card */}
                            <Link
                                to="/admin/orders"
                                className="group bg-white border border-slate-200/80 rounded-3xl p-6 hover:shadow-xl hover:shadow-slate-200/50 hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <TruckIcon className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                                        Customer Orders
                                    </h4>
                                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                                        View placed orders and update delivery status (Shipped, Out for Delivery, Delivered).
                                    </p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-emerald-600 font-bold text-xs">
                                    <span>Manage Orders →</span>
                                </div>
                            </Link>

                            {/* Categories Card */}
                            <Link
                                to="/admin/categories"
                                className="group bg-white border border-slate-200/80 rounded-3xl p-6 hover:shadow-xl hover:shadow-slate-200/50 hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <GridIcon className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                                        Categories
                                    </h4>
                                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                                        Manage store departments and background tints.
                                    </p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-emerald-600 font-bold text-xs">
                                    <span>Manage →</span>
                                </div>
                            </Link>

                            {/* Products Card */}
                            <Link
                                to="/admin/products"
                                className="group bg-white border border-slate-200/80 rounded-3xl p-6 hover:shadow-xl hover:shadow-slate-200/50 hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <BoxIcon className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                                        Products
                                    </h4>
                                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                                        Add items, update stock, pricing, and image URLs.
                                    </p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-emerald-600 font-bold text-xs">
                                    <span>Manage →</span>
                                </div>
                            </Link>

                            {/* Offers & Coupons Card */}
                            <Link
                                to="/admin/coupons"
                                className="group bg-white border border-slate-200/80 rounded-3xl p-6 hover:shadow-xl hover:shadow-slate-200/50 hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <TicketIcon className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                                        Coupons & Offers
                                    </h4>
                                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                                        Create discount coupon codes and promo banners.
                                    </p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-emerald-600 font-bold text-xs">
                                    <span>Manage →</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

const HomeIcon = (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const GridIcon = (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const BoxIcon = (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const TruckIcon = (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1e1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h2" /></svg>;
const TicketIcon = (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>;
const StoreIcon = (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" /></svg>;

export default AdminDashboard;

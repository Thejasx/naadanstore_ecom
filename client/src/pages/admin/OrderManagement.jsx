import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';

const OrderManagement = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { currency } = useAppContext();

    useEffect(() => {
        checkAuth();
        fetchOrders();
    }, []);

    const checkAuth = () => {
        const userData = localStorage.getItem('user');
        if (!userData) { navigate('/admin/login'); return; }
        const parsedUser = JSON.parse(userData);
        if (!parsedUser.isAdmin) navigate('/');
    };

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders/list');
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, status) => {
        try {
            const { data } = await api.post('/orders/status', { orderId, status });
            if (data.success) {
                toast.success(data.message);
                fetchOrders();
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const navItems = [
        { label: 'Dashboard', icon: HomeIcon, path: '/admin/dashboard' },
        { label: 'Categories', icon: GridIcon, path: '/admin/categories' },
        { label: 'Products', icon: BoxIcon, path: '/admin/products' },
        { label: 'Customer Orders', icon: TruckIcon, path: '/admin/orders', active: true },
        { label: 'Offers & Coupons', icon: TicketIcon, path: '/admin/coupons' },
        { label: 'View Storefront', icon: StoreIcon, path: '/' },
    ];

    const statusOptions = [
        'Order Placed',
        'Processing',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Cancelled'
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex">
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
                        <h1 className="text-lg font-bold text-slate-800">Order Management</h1>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
                    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-black text-slate-900">Customer Orders</h2>
                                <p className="text-slate-500 text-xs mt-0.5">Manage order confirmation, dispatch & shipping status</p>
                            </div>
                            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                                {orders.length} Total Orders
                            </span>
                        </div>

                        {loading ? (
                            <div className="text-center py-16 text-slate-400 font-medium text-sm">
                                Loading orders...
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-16 text-slate-400 font-medium text-sm">
                                No customer orders placed yet.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div
                                        key={order._id}
                                        className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4"
                                    >
                                        {/* Order Top Bar */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs font-bold text-slate-900">ID: {order._id}</span>
                                                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${order.payment ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                                        }`}>
                                                        {order.payment ? 'Paid (Razorpay)' : `Unpaid (${order.paymentMethod})`}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                                                    Date: {new Date(order.date).toLocaleString()}
                                                </p>
                                            </div>

                                            {/* Status Dropdown */}
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-slate-500">Status:</span>
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-extrabold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
                                                >
                                                    {statusOptions.map((opt) => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Order Details Body */}
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                                            {/* Items List */}
                                            <div className="md:col-span-6 space-y-2">
                                                <p className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">Ordered Items ({order.items?.length || 0})</p>
                                                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-2">
                                                    {order.items?.map((item, idx) => (
                                                        <div key={idx} className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-100">
                                                            <div className="flex items-center gap-2">
                                                                <img src={item.image?.[0]} alt="" className="w-8 h-8 object-contain rounded-lg bg-slate-50" />
                                                                <span className="font-bold text-slate-800 line-clamp-1">{item.name} x {item.quantity}</span>
                                                            </div>
                                                            <span className="font-extrabold text-slate-900">{currency}{item.offerPrice * item.quantity}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Customer Address */}
                                            <div className="md:col-span-4 space-y-1 bg-white p-3 rounded-xl border border-slate-100">
                                                <p className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] mb-1">Customer Address</p>
                                                <p className="font-bold text-slate-800">{order.address?.firstName} {order.address?.lastName}</p>
                                                <p className="text-slate-600">{order.address?.street}, {order.address?.city}</p>
                                                <p className="text-slate-600">{order.address?.state} - {order.address?.zipcode}</p>
                                                <p className="text-slate-600 font-semibold mt-1">📞 {order.address?.phone} | ✉️ {order.address?.email}</p>
                                            </div>

                                            {/* Pricing Breakdown */}
                                            <div className="md:col-span-2 space-y-1 bg-white p-3 rounded-xl border border-slate-100 flex flex-col justify-between">
                                                <div>
                                                    <p className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] mb-1">Total</p>
                                                    {order.discountAmount > 0 && (
                                                        <p className="text-emerald-600 font-semibold">Discount: -{currency}{order.discountAmount}</p>
                                                    )}
                                                    <p className="text-base font-black text-emerald-600 mt-1">{currency}{order.amount}.00</p>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">{order.paymentMethod}</span>
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
const TruckIcon = (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1e1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h2" /></svg>;
const TicketIcon = (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>;
const StoreIcon = (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" /></svg>;

export default OrderManagement;
